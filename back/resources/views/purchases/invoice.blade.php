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
            <p><strong>Date of Purchase:</strong> {{ $purchase->created_at->format('d-m-Y') }}</p>
            <p><strong>Supplier Name:</strong> {{ $purchase->order->supplier->name }}</p>
            <p><strong>Order:</strong> {{ 'Order No ' . $purchase->order->id }}</p>
            <p><strong>Product:</strong> {{ $purchase->order->product->name }}</p>
            <p><strong>Purchase Price:</strong> {{ $purchase->order->purchase_price }}</p>
            <p><strong>Quantity:</strong> {{ $purchase->quantity }}</p>
            <p><strong>Total Price:</strong> {{ $purchase->total_price }}</p>
            <p><strong>Amount Given:</strong> {{ $purchase->amount_given }}</p>
            <p><strong>Change Returned:</strong> {{ $purchase->change_returned }}</p>
        </div>

        <div class="footer" style="text-align: center; margin-top: 20px;">
            <button onclick="window.print()" class="btn btn-primary">Print Invoice</button>
        </div>
    </div>
</body>
</html>
