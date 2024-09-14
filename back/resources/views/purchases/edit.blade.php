@extends('layouts.master')

@section('title', 'Edit Purchase')

@section('content')
<div class="container">
    <form action="{{ route('purchases.update', $purchase->id) }}" method="POST">
        @csrf
        @method('PUT')
        <div class="form-group">
            <label for="order_id">Order</label>
            <select id="order_id" name="order_id" class="form-control">
                <option value="">Select Order</option>
                @foreach($orders as $order)
                    <option value="{{ $order->id }}" 
                        data-product="{{ $order->product->name }}" 
                        data-supplier="{{ $order->supplier->name }}" 
                        data-price="{{ $order->purchase_price }}" 
                        data-quantity="{{ $order->quantity }}"
                        {{ $order->id == $purchase->order_id ? 'selected' : '' }}>
                        {{ 'Order No ' . $order->id }}
                    </option>
                @endforeach
            </select>
        </div>
        <div class="form-group">
            <label for="product_name">Product</label>
            <input type="text" id="product_name" class="form-control" readonly value="{{ $purchase->order->product->name }}">
        </div>
        <div class="form-group">
            <label for="supplier_name">Supplier</label>
            <input type="text" id="supplier_name" class="form-control" readonly value="{{ $purchase->order->supplier->name }}">
        </div>
        <div class="form-group">
            <label for="purchase_price">Purchase Price</label>
            <input type="number" id="purchase_price" class="form-control" readonly value="{{ $purchase->order->purchase_price }}">
        </div>
        <div class="form-group">
            <label for="quantity">Quantity</label>
            <input type="number" id="quantity" name="quantity" class="form-control" required readonly value="{{ $purchase->quantity }}">
        </div>
        <div class="form-group">
            <label for="total_price">Total Price</label>
            <input type="number" id="total_price" class="form-control" readonly value="{{ $purchase->total_price }}">
        </div>
        <div class="form-group">
            <label for="amount_given">Amount Given</label>
            <input type="number" id="amount_given" name="amount_given" class="form-control" required value="{{ $purchase->amount_given }}">
        </div>
        <div class="form-group">
            <label for="change_returned">Change Returned</label>
            <input type="number" id="change_returned" class="form-control" readonly value="{{ $purchase->change_returned }}">
        </div>
        <button type="submit" class="btn btn-primary">Update Purchase</button>
    </form>
</div>

<script>
    document.getElementById('order_id').addEventListener('change', function () {
        const selectedOption = this.options[this.selectedIndex];
        const product = selectedOption.getAttribute('data-product');
        const supplier = selectedOption.getAttribute('data-supplier');
        const price = selectedOption.getAttribute('data-price');
        const quantity = selectedOption.getAttribute('data-quantity');

        document.getElementById('product_name').value = product;
        document.getElementById('supplier_name').value = supplier;
        document.getElementById('purchase_price').value = price;
        document.getElementById('quantity').value = quantity;

        calculateTotalPrice();
    });

    document.getElementById('amount_given').addEventListener('input', calculateChangeReturned);

    function calculateTotalPrice() {
        const quantity = document.getElementById('quantity').value;
        const price = document.getElementById('purchase_price').value;
        const totalPrice = quantity * price;

        document.getElementById('total_price').value = totalPrice;
    }

    function calculateChangeReturned() {
        const totalPrice = document.getElementById('total_price').value;
        const amountGiven = document.getElementById('amount_given').value;
        const changeReturned = amountGiven - totalPrice;

        document.getElementById('change_returned').value = changeReturned >= 0 ? changeReturned : 0;
    }

    // Initialize the total price and change returned when the page loads
    calculateTotalPrice();
    calculateChangeReturned();
</script>
@endsection
