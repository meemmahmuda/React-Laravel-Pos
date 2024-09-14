@extends('layouts.master')

@section('title', 'Create Sale')

@section('content')
<div class="container">
    <form action="{{ route('sales.store') }}" method="POST">
        @csrf
        <div class="form-group">
            <label for="customer_name">Customer Name</label>
            <input type="text" id="customer_name" name="customer_name" class="form-control" required>
        </div>
        <div class="form-group">
            <label for="address">Address</label>
            <input type="text" id="address" name="address" class="form-control" required>
        </div>
        <div class="form-group">
            <label for="phone_no">Phone No</label>
            <input type="number" id="phone_no" name="phone_no" class="form-control" required>
        </div>
        <div class="form-group">
            <label for="product_id">Product</label>
            <select id="product_id" name="product_id" class="form-control" required>
                <option value="">Select Product</option>
                @foreach($products as $product)
                    <option value="{{ $product->id }}"
                        data-name="{{ $product->name }}"
                        data-code="{{ $product->code }}"
                        data-category="{{ $product->category->name }}"
                        data-price="{{ $product->selling_price }}"
                        data-stock="{{ $product->stock }}">
                        {{ $product->name }} (Stock: {{ $product->stock }})
                    </option>
                @endforeach
            </select>
        </div>
        <div class="form-group">
            <label for="product_name">Product Name</label>
            <input type="text" id="product_name" class="form-control" readonly>
        </div>
        <div class="form-group">
            <label for="product_code">Product Code</label>
            <input type="text" id="product_code" class="form-control" readonly>
        </div>
        <div class="form-group">
            <label for="category">Category</label>
            <input type="text" id="category" class="form-control" readonly>
        </div>
        <div class="form-group">
            <label for="selling_price">Selling Price</label>
            <input type="number" id="selling_price" class="form-control" readonly>
        </div>
        <div class="form-group">
            <label for="stock">Stock Available</label>
            <input type="number" id="stock" class="form-control" readonly>
        </div>
        <div class="form-group">
            <label for="discount">Discount</label>
            <input type="number" id="discount" name="discount" class="form-control">
        </div>
        <div class="form-group">
            <label for="quantity">Quantity</label>
            <input type="number" id="quantity" name="quantity" class="form-control" required>
        </div>
        <div class="form-group">
            <label for="total_price">Total Price</label>
            <input type="number" id="total_price" name="total_price" class="form-control" readonly>
        </div>
        <div class="form-group">
            <label for="money_taken">Money Taken</label>
            <input type="number" id="money_taken" name="money_taken" class="form-control" required>
        </div>
        <div class="form-group">
            <label for="money_returned">Money Returned</label>
            <input type="number" id="money_returned" name="money_returned" class="form-control" readonly>
        </div>
        <button type="submit" class="btn btn-primary">Create Sale</button>
    </form>
</div>

<script>
    document.getElementById('product_id').addEventListener('change', function () {
        const selectedOption = this.options[this.selectedIndex];
        const productName = selectedOption.getAttribute('data-name');
        const productCode = selectedOption.getAttribute('data-code');
        const category = selectedOption.getAttribute('data-category');
        const sellingPrice = parseFloat(selectedOption.getAttribute('data-price'));
        const stock = parseInt(selectedOption.getAttribute('data-stock'));

        document.getElementById('product_name').value = productName;
        document.getElementById('product_code').value = productCode;
        document.getElementById('category').value = category;
        document.getElementById('selling_price').value = sellingPrice;
        document.getElementById('stock').value = stock;
        calculateTotalPrice();
    });

    document.getElementById('quantity').addEventListener('input', function () {
        const stock = parseInt(document.getElementById('stock').value) || 0;
        const quantity = parseInt(this.value) || 0;

        if (quantity > stock) {
            alert('The quantity cannot be greater than the available stock.');
            this.value = stock; // Set the quantity to the maximum stock available
        }

        calculateTotalPrice();
    });

    document.getElementById('discount').addEventListener('input', calculateTotalPrice);
    document.getElementById('money_taken').addEventListener('input', calculateMoneyReturned);

    function calculateTotalPrice() {
        const sellingPrice = parseFloat(document.getElementById('selling_price').value) || 0;
        const quantity = parseInt(document.getElementById('quantity').value) || 0;
        const discountPercentage = parseFloat(document.getElementById('discount').value) || 0;

        const subtotal = sellingPrice * quantity;
        const discountAmount = (discountPercentage / 100) * subtotal;
        let totalPrice = subtotal - discountAmount;
        if (totalPrice < 0) {
            totalPrice = 0;
        }

        document.getElementById('total_price').value = totalPrice;
        calculateMoneyReturned();
    }

    function calculateMoneyReturned() {
        const totalPrice = parseFloat(document.getElementById('total_price').value) || 0;
        const moneyTaken = parseFloat(document.getElementById('money_taken').value) || 0;
        const moneyReturned = moneyTaken - totalPrice;

        document.getElementById('money_returned').value = moneyReturned >= 0 ? moneyReturned : 0;
    }
</script>

@endsection
