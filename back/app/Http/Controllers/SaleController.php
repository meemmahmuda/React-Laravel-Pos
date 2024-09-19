<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Product;
use Illuminate\Http\Request;
use PDF;

class SaleController extends Controller
{
    // Return all sales with product details
    public function index()
    {
        $sales = Sale::with('product')->orderBy('created_at', 'desc')->get();
        return response()->json($sales, 200);
    }

    // Return available products for creating a sale
    public function create()
    {
        $products = Product::where('stock', '>', 0)->get();
        return response()->json($products, 200);
    }

    // Store a new sale and update product stock
    public function store(Request $request)
    {
        $product = Product::find($request->product_id);

        if (!$product || $product->stock <= 0) {
            return response()->json(['error' => 'The selected product is out of stock.'], 422);
        }

        if ($request->quantity > $product->stock) {
            return response()->json(['error' => 'The quantity cannot be greater than the available stock.'], 422);
        }

        // Calculate totals
        $sellingPrice = $product->selling_price;
        $quantity = $request->quantity;
        $discountPercentage = $request->discount ?? 0;

        $subtotal = $sellingPrice * $quantity;
        $discountAmount = ($discountPercentage / 100) * $subtotal;
        $totalPrice = $subtotal - $discountAmount;
        $totalPrice = max($totalPrice, 0);

        $moneyTaken = $request->money_taken;
        $moneyReturned = max($moneyTaken - $totalPrice, 0);

        // Create the sale record
        $sale = Sale::create([
            'customer_name' => $request->customer_name,
            'address' => $request->address,
            'phone_no' => $request->phone_no,
            'product_id' => $request->product_id,
            'quantity' => $quantity,
            'selling_price' => $sellingPrice,
            'total_price' => $totalPrice,
            'discount' => $discountPercentage,
            'money_taken' => $moneyTaken,
            'money_returned' => $moneyReturned,
        ]);

        // Update product stock
        $product->decrement('stock', $quantity);

        return response()->json(['message' => 'Sale created successfully!', 'sale' => $sale], 201);
    }

    // Edit a sale by fetching the sale data and available products
    public function edit(Sale $sale)
    {
        $products = Product::where('stock', '>', 0)->get();
        return response()->json(['sale' => $sale, 'products' => $products], 200);
    }

    // Update a sale and adjust product stock
    public function update(Request $request, Sale $sale)
    {
        $product = Product::find($request->product_id);

        if (!$product) {
            return response()->json(['error' => 'The selected product does not exist.'], 404);
        }

        $oldQuantity = $sale->quantity;
        $newQuantity = $request->quantity;

        // Adjust stock if the quantity has changed
        if ($newQuantity != $oldQuantity) {
            $product->increment('stock', $oldQuantity);  // Revert old quantity

            if ($newQuantity > $product->stock) {
                return response()->json(['error' => 'The quantity cannot be greater than the available stock.'], 422);
            }

            $product->decrement('stock', $newQuantity);  // Deduct new quantity
        }

        // Recalculate totals
        $sellingPrice = $product->selling_price;
        $discountPercentage = $request->discount ?? 0;

        $subtotal = $sellingPrice * $newQuantity;
        $discountAmount = ($discountPercentage / 100) * $subtotal;
        $totalPrice = $subtotal - $discountAmount;
        $totalPrice = max($totalPrice, 0);

        $moneyTaken = $request->money_taken;
        $moneyReturned = max($moneyTaken - $totalPrice, 0);

        // Update the sale record
        $sale->update([
            'customer_name' => $request->customer_name,
            'address' => $request->address,
            'phone_no' => $request->phone_no,
            'product_id' => $request->product_id,
            'quantity' => $newQuantity,
            'selling_price' => $sellingPrice,
            'total_price' => $totalPrice,
            'discount' => $discountPercentage,
            'money_taken' => $moneyTaken,
            'money_returned' => $moneyReturned,
        ]);

        return response()->json(['message' => 'Sale updated successfully!', 'sale' => $sale], 200);
    }

    // Delete a sale and adjust stock
    public function destroy(Sale $sale)
    {
        $product = $sale->product;
        $product->increment('stock', $sale->quantity);  // Revert stock

        $sale->delete();

        return response()->json(['message' => 'Sale deleted successfully!'], 200);
    }


    public function printInvoice($id)
    {
        $sale = Sale::findOrFail($id);

        // Load your PDF view and pass the sale data
        $pdf = PDF::loadView('sales.invoice', ['sale' => $sale]);

        return $pdf->stream('invoice.pdf'); // or use ->download('invoice.pdf') to force download
    }

  
    
public function report(Request $request)
{
    // Get the date and month from the request
    $date = $request->input('date');
    $month = $request->input('month');
    
    // Initialize the query
    $query = Sale::with('product.category');
    
    // Filter by date if provided
    if ($date) {
        // Ensure the date is in Y-m-d format
        $query->whereDate('created_at', $date);
    }
    // Filter by month if provided (ignore date)
    elseif ($month) {
        $year = now()->year;
        $startDate = "$year-$month-01";
        // Ensure the end date includes the last day of the month
        $endDate = now()->year($year)->month($month)->endOfMonth()->format('Y-m-d');
        $query->whereBetween('created_at', [$startDate, $endDate]);
    } 
    // If neither date nor month is provided, use today's date
    else {
        $date = now()->format('Y-m-d');
        $query->whereDate('created_at', $date);
    }
    
    // Fetch sales data and eager load relationships
    $sales = $query->get();
    
    // Initialize array to store report data
    $reportData = [];
    
    foreach ($sales as $sale) {
        $category = $sale->product->category->name;
        $productName = $sale->product->name;
        $unitsSold = $sale->quantity;
        $unitPrice = $sale->selling_price;
        $discount = $sale->discount;
        
        // Calculate total sales and net sales
        $subtotal = $unitPrice * $unitsSold;
        $discountAmount = ($discount / 100) * $subtotal;
        $totalSales = $subtotal;
        $netSales = $subtotal - $discountAmount;
    
        // Add data to report array
        $reportData[] = [
            'category' => $category,
            'product_name' => $productName,
            'units_sold' => $unitsSold,
            'unit_price' => number_format($unitPrice, 2),
            'discount' => number_format($discountAmount, 2),
            'total_sales' => number_format($totalSales, 2),
            'net_sales' => number_format($netSales, 2),
        ];
    }
    
    // Pass data to the view
    return view('sales.report', [
        'reportData' => $reportData,
        'selectedDate' => $date,
        'selectedMonth' => $month
    ]);
}

}

