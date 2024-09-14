@extends('layouts.master')

@section('title', 'Create Purchase')

@section('content')
<div class="container">
    <form action="{{ route('purchases.store') }}" method="POST">
        @csrf
        <div class="form-group">
            <label for="order_id">Order</label>
            <select id="order_id" name="order_id" class="form-control">
                <option value="">Select Order</option>
                @foreach($orders as $order)
                    <option value="{{ $order->id }}" 
                        data-product="{{ $order->product->name }}" 
                        data-supplier="{{ $order->supplier->name }}" 
                        data-price="{{ $order->purchase_price }}" 
                        data-quantity="{{ $order->quantity }}">
                        {{ 'Order No ' . $order->id . ' - Product: ' . $order->product->name}}
                    </option>
                @endforeach
            </select>
        </div>
        <div class="form-group">
            <label for="product_name">Product</label>
            <input type="text" id="product_name" class="form-control" readonly>
        </div>
        <div class="form-group">
            <label for="supplier_name">Supplier</label>
            <input type="text" id="supplier_name" class="form-control" readonly>
        </div>
        <div class="form-group">
            <label for="purchase_price">Purchase Price</label>
            <input type="number" id="purchase_price" class="form-control" readonly>
        </div>
        <div class="form-group">
            <label for="quantity">Quantity</label>
            <input type="number" id="quantity" name="quantity" class="form-control" required readonly>
        </div>
        <div class="form-group">
            <label for="total_price">Total Price</label>
            <input type="number" id="total_price" class="form-control" readonly>
        </div>
        <div class="form-group">
            <label for="amount_given">Amount Given</label>
            <input type="number" id="amount_given" name="amount_given" class="form-control" required>
        </div>
        <div class="form-group">
            <label for="change_returned">Change Returned</label>
            <input type="number" id="change_returned" class="form-control" readonly>
        </div>
        <button type="submit" class="btn btn-primary">Create Purchase</button>
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
</script>
@endsection
