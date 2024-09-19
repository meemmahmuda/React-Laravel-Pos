<?php

namespace App\Http\Controllers;

use App\Models\SalesReturn;
use App\Models\Sale;
use Illuminate\Http\Request;

class SalesReturnController extends Controller
{
    public function index()
    {
        $salesReturns = SalesReturn::with('sale.product')->orderBy('created_at', 'desc')->get();
        return response()->json($salesReturns);
    }

    public function create()
    {
        $sales = Sale::with('product')->get();
        return response()->json($sales);
    }

    public function store(Request $request)
    {
        $request->validate([
            'sale_id' => 'required|exists:sales,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $sale = Sale::findOrFail($request->sale_id);
        $product = $sale->product;
        $quantityReturned = $request->quantity;

        if ($quantityReturned > $sale->quantity) {
            return response()->json(['error' => 'The quantity returned cannot exceed the quantity sold.'], 422);
        }

        // Calculate the total price for the returned items
        $returnedSubtotal = $sale->selling_price * $quantityReturned;
        $discountAmount = ($sale->discount / 100) * $returnedSubtotal;
        $returnedTotalPrice = $returnedSubtotal - $discountAmount;

        // Create the sales return record
        $salesReturn = SalesReturn::create([
            'sale_id' => $sale->id,
            'quantity' => $quantityReturned,
            'total_price' => $returnedTotalPrice,
        ]);

        // Update the product stock by adding the returned quantity
        $product->increment('stock', $quantityReturned);

        // Deduct the returned amount from the sale's total price
        $sale->total_price -= $returnedTotalPrice;
        $sale->quantity -= $quantityReturned;
        $sale->save();

        return response()->json(['success' => 'Sales return processed successfully!', 'salesReturn' => $salesReturn], 201);
    }

    public function destroy(SalesReturn $salesReturn)
    {
        $sale = $salesReturn->sale;

        // Revert the total price in the sale
        $sale->total_price += $salesReturn->total_price;
        $sale->quantity += $salesReturn->quantity;
        $sale->save();

        // Restore the stock
        $salesReturn->sale->product->decrement('stock', $salesReturn->quantity);

        // Delete the sales return record
        $salesReturn->delete();

        return response()->json(['success' => 'Sales return deleted successfully.']);
    }
}
