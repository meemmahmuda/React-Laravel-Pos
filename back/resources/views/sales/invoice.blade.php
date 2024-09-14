<!DOCTYPE html>
<html>
<head>
    <title>Invoice</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .invoice-container { max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; }
        .header, .footer { text-align: center; margin-bottom: 20px; }
        .details { margin-bottom: 20px; }
        .details table { width: 100%; border-collapse: collapse; }
        .details table, .details th, .details td { border: 1px solid #ddd; }
        .details th, .details td { padding: 10px; text-align: left; }
        .total { text-align: right; font-weight: bold; }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <h1>Invoice</h1>
        </div>

        <div class="details">
            <p><strong>Customer Name:</strong> {{ $sale->customer_name }}</p>
            <p><strong>Address:</strong> {{ $sale->address }}</p>
            <p><strong>Phone No:</strong> {{ $sale->phone_no }}</p>
            <p><strong>Date of Sale:</strong> {{ $sale->created_at->format('d-m-Y') }}</p>
            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Product Code</th>
                        <th>Category</th>
                        <th>Selling Price</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ $sale->product->name }}</td>
                        <td>{{ $sale->product->code }}</td>
                        <td>{{ $sale->product->category->name }}</td>
                        <td>{{ $sale->selling_price }}</td>
                        <td>{{ $sale->quantity }}</td>
                        <td>{{ $sale->total_price }}</td>
                    </tr>
                </tbody>
            </table>
            <p class="total">Total Price: {{ $sale->total_price }}</p>
            <p class="total">Discount: {{ $sale->discount }}%</p>
            <p class="total">Amount Paid: {{ $sale->money_taken }}</p>
            <p class="total">Amount Returned: {{ $sale->money_returned }}</p>
        </div>

        <div class="footer">
            <p>Thank you for your business!</p>
        </div>
    </div>
</body>
</html>
