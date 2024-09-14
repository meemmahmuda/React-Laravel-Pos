@extends('layouts.master')

@section('title', 'Purchases List')

@section('content')
<div class="container">
    <a href="{{ route('purchases.create') }}" class="btn btn-primary">Add New Purchase</a>
    <table class="table table-bordered mt-3">
        <thead>
            <tr style="text-align: center;">
                <th>SL No.</th>
                <th>Order No</th>
                <th>Product Name</th>
                <th>Supplier Name</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            @foreach($purchases as $purchase)
                <tr>
                    <td style="text-align: center;">{{ $loop->iteration }}</td>
                    <td>{{ 'Order No ' . $purchase->order->id }}</td>
                    <td>{{ $purchase->order->product->name }}</td>
                    <td>{{ $purchase->order->supplier->name }}</td>
                    <td>{{ $purchase->quantity }}</td>
                    <td>{{ $purchase->total_price }}</td>
                    <td>
                        <a href="{{ route('purchases.edit', $purchase->id) }}" class="btn btn-warning">Edit</a>
                        <form action="{{ route('purchases.destroy', $purchase->id) }}" method="POST" style="display:inline;">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger" onclick="return confirm('Are you sure?')">Delete</button>
                        </form>
                        <a href="{{ route('purchases.invoice', $purchase->id) }}" class="btn btn-info" target="_blank">Print Invoice</a>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection
