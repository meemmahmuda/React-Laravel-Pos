@extends('layouts.master')

@section('title', 'Orders List')

@section('content')
<div class="container">
    <a href="{{ route('orders.create') }}" class="btn btn-primary">Add New Order</a>
    <table class="table table-bordered mt-3">
        <thead>
            <tr style="text-align: center;">
                <th>SL No.</th>
                <th>Product</th>
                <th>Supplier</th>
                <th>Quantity</th>
                <th>Purchase Price</th>
                <th>Total Price</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            @foreach($orders as $order)
                <tr>
                    <td style="text-align: center;">{{ 'Order No ' . $loop->iteration }}</td>
                    <td>{{ $order->product->name }}</td>
                    <td>{{ $order->supplier->name }}</td>
                    <td>{{ $order->quantity }}</td>
                    <td>{{ $order->purchase_price }}</td>
                    <td>{{ $order->total_price }}</td>
                    <td style="text-align: center;">
                        <a href="{{ route('orders.edit', $order->id) }}" class="btn btn-warning">Edit</a>
                        <form action="{{ route('orders.destroy', $order->id) }}" method="POST" style="display:inline;">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger" onclick="return confirm('Are you sure?')">Delete</button>
                        </form>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection
