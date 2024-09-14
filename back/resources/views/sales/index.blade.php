@extends('layouts.master')

@section('title', 'Sales List')

@section('content')
<div class="container">
    <a href="{{ route('sales.create') }}" class="btn btn-primary">Add New Sale</a>
    <table class="table table-bordered mt-3">
        <thead>
            <tr style="text-align: center;">
                <th>SL No.</th>
                <th>Customer Name</th>
                <th>Address</th>
                <th>Customer Contact No.</th>
                <th>Product</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Discount</th>
                <th>Total Price</th>
                <th style='width: 30%'>Action</th>
            </tr>
        </thead>
        <tbody>
            @foreach($sales as $sale)
                <tr>
                    <td style="text-align: center;">{{ $loop->iteration }}</td>
                    <td>{{ $sale->customer_name }}</td>
                    <td>{{ $sale->address }}</td>
                    <td>{{ $sale->phone_no }}</td>
                    <td>{{ $sale->product->name }}</td>
                    <td>{{ $sale->product->category->name }}</td>
                    <td>{{ $sale->quantity }}</td>
                    <td>{{ $sale->discount }}%</td>
                    <td>{{ $sale->total_price }}</td>
                    <td style="text-align: center;">
                        <a href="{{ route('sales.edit', $sale->id) }}" class="btn btn-warning btn-sm">Edit</a>
                        <form action="{{ route('sales.destroy', $sale->id) }}" method="POST" style="display:inline;">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure?')">Delete</button>
                        </form>
                        <a href="{{ route('sales.invoice', $sale->id) }}" target="_blank" class="btn btn-info btn-sm">Print Invoice</a>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection
