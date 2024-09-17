<?php
namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('product', 'supplier')->orderBy('created_at', 'desc')->get();
        return response()->json($orders);
    }

    public function create()
    {
        $products = Product::with('supplier')->get();
        return response()->json($products);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required',
            'quantity' => 'required|integer',
        ]);

        $product = Product::findOrFail($request->product_id);

        $totalPrice = $product->purchase_price * $request->quantity;

        Order::create([
            'product_id' => $product->id,
            'supplier_id' => $product->supplier_id,
            'quantity' => $request->quantity,
            'purchase_price' => $product->purchase_price,
            'total_price' => $totalPrice,
        ]);

        return response()->json(['message' => 'Order created successfully.']);
    }

    public function edit(Order $order)
    {
        $products = Product::with('supplier')->get();
        return response()->json([
            'order' => $order,
            'products' => $products
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $request->validate([
            'product_id' => 'required',
            'quantity' => 'required|integer',
        ]);

        $product = Product::findOrFail($request->product_id);

        $totalPrice = $product->purchase_price * $request->quantity;

        $order->update([
            'product_id' => $product->id,
            'supplier_id' => $product->supplier_id,
            'quantity' => $request->quantity,
            'purchase_price' => $product->purchase_price,
            'total_price' => $totalPrice,
        ]);

        return response()->json(['message' => 'Order updated successfully.']);
    }

    public function show(Order $order)
    {
        $order->load('product', 'supplier');
        return response()->json($order);
    }

    public function destroy(Order $order)
    {
        $order->delete();
        return response()->json(['message' => 'Order deleted successfully.']);
    }
}
