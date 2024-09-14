<?php

namespace App\Http\Controllers;
use App\Models\Sale;
use App\Models\Product;
use PDF;

use Illuminate\Http\Request;

class SaleController extends Controller
{
    public function index()
    {
        $sales = Sale::with('product')->orderBy('created_at', 'desc')->get();
        return view('sales.index', compact('sales'));
    }

    public function create()
    {
        $products = Product::where('stock', '>', 0)->get();
        return view('sales.create', compact('products'));
    }

    public function store(Request $request)
    {
        $product = Product::find($request->product_id);

        if ($product->stock <= 0) {
            return redirect()->back()->withErrors(['product_id' => 'The selected product is out of stock.']);
        }

        if ($request->quantity > $product->stock) {
            return redirect()->back()->withErrors(['quantity' => 'The quantity cannot be greater than the available stock.']);
        }
    
        $sellingPrice = $product->selling_price;
        $quantity = $request->quantity;
        $discountPercentage = $request->discount;
    
        // Calculate the subtotal
        $subtotal = $sellingPrice * $quantity;
        
        // Calculate the discount amount
        $discountAmount = ($discountPercentage / 100) * $subtotal;
        
        // Calculate the total price after discount
        $totalPrice = $subtotal - $discountAmount;
        if ($totalPrice < 0) {
            $totalPrice = 0;
        }
    
        // Calculate money returned
        $moneyTaken = $request->money_taken;
        $moneyReturned = $moneyTaken - $totalPrice;
        if ($moneyReturned < 0) {
            $moneyReturned = 0;
        }

    // Create the sale record
    Sale::create([
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

    // Update the product stock
    $product->decrement('stock', $quantity);

    return redirect()->route('sales.index')->with('success', 'Sale created successfully!');


        // Update product stock
        $product->update([
            'stock' => $product->stock - $request->quantity,
        ]);


        

        // Generate an invoice (implement your own logic)
        // $this->generateInvoice($sale);

        return redirect()->route('sales.index')->with('success', 'Sale completed and invoice generated.');
    }

    public function edit(Sale $sale)
    {
        $products = Product::where('stock', '>', 0)->get();
        return view('sales.edit', compact('sale', 'products'));
    }

    public function update(Request $request, Sale $sale)
    {
        $product = Product::find($request->product_id);
    
        // Adjust stock only if the quantity has changed
        $oldQuantity = $sale->quantity;
        $newQuantity = $request->quantity;
    
        if ($newQuantity != $oldQuantity) {
            // Revert the previous quantity from the stock
            $product->increment('stock', $oldQuantity);
    
            // Deduct the new quantity from the stock
            if ($newQuantity > $product->stock) {
                return redirect()->back()->withErrors(['quantity' => 'The quantity cannot be greater than the available stock.']);
            }
            $product->decrement('stock', $newQuantity);
        }
    
        $sellingPrice = $product->selling_price;
        $discountPercentage = $request->discount;
    
        // Calculate the subtotal
        $subtotal = $sellingPrice * $newQuantity;
    
        // Calculate the discount amount
        $discountAmount = ($discountPercentage / 100) * $subtotal;
    
        // Calculate the total price after discount
        $totalPrice = $subtotal - $discountAmount;
        if ($totalPrice < 0) {
            $totalPrice = 0;
        }
    
        // Calculate money returned
        $moneyTaken = $request->money_taken;
        $moneyReturned = $moneyTaken - $totalPrice;
        if ($moneyReturned < 0) {
            $moneyReturned = 0;
        }
    
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
    
        return redirect()->route('sales.index')->with('success', 'Sale updated successfully.');
    }
    
    

    public function destroy(Sale $sale)
    {
        $sale->delete();
        return redirect()->route('sales.index')->with('success', 'Sale deleted successfully.');
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

