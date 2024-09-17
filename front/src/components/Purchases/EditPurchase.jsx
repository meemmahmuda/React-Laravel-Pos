// src/components/EditPurchase.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditPurchase = () => {
    const [purchase, setPurchase] = useState(null);
    const [orders, setOrders] = useState([]);
    const [amountGiven, setAmountGiven] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [changeReturned, setChangeReturned] = useState(0);

    const { id } = useParams(); // Get the 'id' from URL parameters

    useEffect(() => {
        // Fetch purchase data
        axios.get(`http://127.0.0.1:8000/api/purchases/${id}`).then(response => {
            setPurchase(response.data);
            setAmountGiven(response.data.amount_given);
            setTotalPrice(response.data.total_price);
            setChangeReturned(response.data.change_returned);
        });

        // Fetch orders data
        axios.get('http://127.0.0.1:8000/api/orders').then(response => {
            setOrders(response.data);
        });
    }, [id]);

    const handleOrderChange = (e) => {
        const selectedOrderId = e.target.value;
        const selectedOrder = orders.find(order => order.id === parseInt(selectedOrderId));

        if (selectedOrder) {
            document.getElementById('product_name').value = selectedOrder.product.name;
            document.getElementById('supplier_name').value = selectedOrder.supplier.name;
            document.getElementById('purchase_price').value = selectedOrder.purchase_price;
            document.getElementById('quantity').value = selectedOrder.quantity;

            calculateTotalPrice();
        }
    };

    const handleAmountGivenChange = (e) => {
        setAmountGiven(e.target.value);
        calculateChangeReturned();
    };

    const calculateTotalPrice = () => {
        const quantity = document.getElementById('quantity').value;
        const price = document.getElementById('purchase_price').value;
        setTotalPrice(quantity * price);
    };

    const calculateChangeReturned = () => {
        const change = amountGiven - totalPrice;
        setChangeReturned(change >= 0 ? change : 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.put(`http://127.0.0.1:8000/api/purchases/${id}`, {
            order_id: document.getElementById('order_id').value,
            quantity: document.getElementById('quantity').value,
            amount_given: amountGiven
        }).then(response => {
            alert('Purchase updated successfully');
        }).catch(error => {
            console.error(error);
        });
    };

    if (!purchase) return <div>Loading...</div>;

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="order_id">Order</label>
                    <select id="order_id" name="order_id" className="form-control" onChange={handleOrderChange}>
                        <option value="">Select Order</option>
                        {orders.map(order => (
                            <option key={order.id} value={order.id} selected={order.id === purchase.order_id}>
                                {`Order No ${order.id}`}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="product_name">Product</label>
                    <input type="text" id="product_name" className="form-control" readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="supplier_name">Supplier</label>
                    <input type="text" id="supplier_name" className="form-control" readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="purchase_price">Purchase Price</label>
                    <input type="number" id="purchase_price" className="form-control" readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input type="number" id="quantity" name="quantity" className="form-control" readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="total_price">Total Price</label>
                    <input type="number" id="total_price" className="form-control" readOnly value={totalPrice} />
                </div>
                <div className="form-group">
                    <label htmlFor="amount_given">Amount Given</label>
                    <input type="number" id="amount_given" name="amount_given" className="form-control" value={amountGiven} onChange={handleAmountGivenChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="change_returned">Change Returned</label>
                    <input type="number" id="change_returned" className="form-control" readOnly value={changeReturned} />
                </div>
                <button type="submit" className="btn btn-primary">Update Purchase</button>
            </form>
        </div>
    );
};

export default EditPurchase;
