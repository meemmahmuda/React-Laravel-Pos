<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Supplier;
use App\Models\Category;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('supplier', 'category')->orderBy('created_at', 'desc')->get();
        return response()->json($products);
    }

    public function create()
    {
        $suppliers = Supplier::all();
        $categories = Category::all();
        return view('products.create', compact('suppliers', 'categories'));
    }

    public function store(Request $request)
    {
        $products = $request->input('products', []);
        
        foreach ($products as $productData) {
            $validatedData = \Validator::make($productData, [
                'name' => 'required|string',
                'code' => 'required|string|unique:products',
                'supplier_id' => 'required',
                'category_id' => 'required',
                'purchase_price' => 'required|integer',
                'selling_price' => 'required|integer',
                'stock' => 'nullable|integer',
            ])->validate();

            Product::create($validatedData);
        }

        return response()->json(['success' => 'Products created successfully.']);
    }

    public function edit(Product $product)
    {
        $suppliers = Supplier::all();
        $categories = Category::all();
        return view('products.edit', compact('product', 'suppliers', 'categories'));
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'supplier_id' => 'required',
            'category_id' => 'required',
            'name' => 'required|string',
            'code' => 'required|string|unique:products,code,' . $product->id,
            'purchase_price' => 'required|integer',
            'selling_price' => 'required|integer',
            'stock' => 'nullable|integer',
        ]);

        $product->update($request->all());

        return response()->json(['success' => 'Product updated successfully.']);
    }

    public function show(Product $product)
    {
        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(['success' => 'Product deleted successfully.']);
    }
}
