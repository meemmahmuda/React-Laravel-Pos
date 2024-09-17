<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;

class PurchaseController extends Controller
{
  
    public function index()
{
    $purchases = Purchase::with(['order.product', 'order.supplier'])->orderBy('created_at', 'desc')->get();
    return response()->json($purchases);
}

public function printInvoice(Purchase $purchase)
{
    return view('purchases.invoice', compact('purchase'));
}


    public function create()
    {
        $orders = Order::all();
        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required',
            'quantity' => 'required|integer',
            'amount_given' => 'required|integer',
        ]);

        $order = Order::findOrFail($request->order_id);

        $totalPrice = $order->purchase_price * $request->quantity;
        $changeReturned = $request->amount_given - $totalPrice;

        // Update product stock
        $product = Product::findOrFail($order->product_id);
        $product->stock += $request->quantity;
        $product->save();

        Purchase::create([
            'order_id' => $order->id,
            'quantity' => $request->quantity,
            'total_price' => $totalPrice,
            'amount_given' => $request->amount_given,
            'change_returned' => $changeReturned,
        ]);

        return response()->json(['message' => 'Purchase created successfully.']);
    }

    public function edit($id)
{
    $purchase = Purchase::with(['order.product', 'order.supplier'])->findOrFail($id);
    $orders = Order::with(['product', 'supplier'])->get();

    return response()->json([
        'purchase' => $purchase,
        'orders' => $orders,
    ]);
}

public function update(Request $request, $id)
{
    $request->validate([
        'order_id' => 'required',
        'quantity' => 'required|integer',
        'amount_given' => 'required|integer',
    ]);

    $purchase = Purchase::findOrFail($id);
    $order = Order::findOrFail($request->order_id);

    $totalPrice = $order->purchase_price * $request->quantity;
    $changeReturned = $request->amount_given - $totalPrice;

    $purchase->update([
        'order_id' => $order->id,
        'quantity' => $request->quantity,
        'total_price' => $totalPrice,
        'amount_given' => $request->amount_given,
        'change_returned' => $changeReturned,
    ]);

    return response()->json(['success' => 'Purchase updated successfully.']);
}


public function show(Purchase $purchase)
{
    // Eager load the related order, product, and supplier
    $purchase->load('order.product', 'order.supplier');
    return response()->json($purchase);
}


    public function destroy(Purchase $purchase)
    {
        $product = Product::findOrFail($purchase->order->product_id);
        $product->stock -= $purchase->quantity;
        $product->save();

        $purchase->delete();
        return response()->json(['message' => 'Purchase deleted successfully.']);
    }


    public function report(Request $request)
    {
        // Get the date and month from the request
        $date = $request->input('date');
        $month = $request->input('month');
        
        // Initialize the query
        $query = Purchase::with('order.product.category');
        
        // Filter by date if provided
        if ($date) {
            $query->whereDate('created_at', $date);
        }
        // Filter by month if provided (ignore date)
        elseif ($month) {
            $year = now()->year;
            $startDate = "$year-$month-01";
            $endDate = now()->year($year)->month($month)->endOfMonth()->format('Y-m-d');
            $query->whereBetween('created_at', [$startDate, $endDate]);
        } 
        // If neither date nor month is provided, use today's date
        else {
            $date = now()->format('Y-m-d');
            $query->whereDate('created_at', $date);
        }
        
        // Fetch purchase data and eager load relationships
        $purchases = $query->get();
        
        // Initialize array to store report data
        $reportData = [];
        
        foreach ($purchases as $purchase) {
            $order = $purchase->order;
            $product = $order->product;
            $category = $product->category->name ?? 'N/A'; // Ensure category exists
            $productName = $product->name;
            $quantity = $purchase->quantity;
            $purchasePrice = $order->purchase_price; // Get purchase price from the order
            $totalPrice = $purchase->total_price;
            
            // Add data to report array
            $reportData[] = [
                'category' => $category,
                'product_name' => $productName,
                'quantity' => $quantity,
                'purchase_price' => number_format($purchasePrice, 2),
                'total_price' => number_format($totalPrice, 2),
            ];
        }
        
        // Pass data to the view
        return view('purchases.report', [
            'reportData' => $reportData,
            'selectedDate' => $date,
            'selectedMonth' => $month
        ]);
    }
    
    
    

}
