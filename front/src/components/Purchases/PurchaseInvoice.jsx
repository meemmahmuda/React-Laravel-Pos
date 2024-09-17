// src/components/PurchaseInvoice.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PurchaseInvoice = ({ match }) => {
    const [purchase, setPurchase] = useState(null);
    const purchaseId = match.params.id;

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/purchases/invoice/${purchaseId}`)
            .then(response => setPurchase(response.data))
            .catch(error => console.error('Error fetching invoice:', error));
    }, [purchaseId]);

    const printInvoice = () => {
        window.print();
    };

    if (!purchase) return <div>Loading...</div>;

    return (
        <div>
            <style>
                {`
                    @media print {
                        .printButton {
                            display: none;
                        }
                        @page {
                            margin: 20mm;
                        }
                    }
                    .invoiceContainer {
                        width: 100%;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #ddd;
                        background: #fff;
                        font-family: Arial, sans-serif;
                    }
                    .invoiceHeader {
                        margin-bottom: 20px;
                    }
                    .invoiceBody {
                        margin-bottom: 20px;
                    }
                    .printButton {
                        display: block;
                        margin: 20px 0;
                        padding: 10px 20px;
                        background-color: #007bff;
                        color: #fff;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                `}
            </style>
            <div className="invoiceContainer">
                <div className="invoiceHeader">
                    <h1>Purchase Invoice</h1>
                </div>
                <div className="invoiceBody">
                    <p><strong>Order No:</strong> {purchase.order.id}</p>
                    <p><strong>Product Name:</strong> {purchase.order.product.name}</p>
                    <p><strong>Supplier Name:</strong> {purchase.order.supplier.name}</p>
                    <p><strong>Quantity:</strong> {purchase.quantity}</p>
                    <p><strong>Total Price:</strong> {purchase.total_price}</p>
                    <p><strong>Amount Given:</strong> {purchase.amount_given}</p>
                    <p><strong>Change Returned:</strong> {purchase.change_returned}</p>
                </div>
                <button onClick={printInvoice} className="printButton">Print Invoice</button>
            </div>
        </div>
    );
};

export default PurchaseInvoice;
