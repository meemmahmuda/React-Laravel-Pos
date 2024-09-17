import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const CreatePurchase = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState('');
    const [product, setProduct] = useState('');
    const [supplier, setSupplier] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState(''); // Quantity fetched from order
    const [totalPrice, setTotalPrice] = useState('');
    const [amountGiven, setAmountGiven] = useState('');
    const [changeReturned, setChangeReturned] = useState('');

    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/orders')
            .then(response => setOrders(response.data))
            .catch(error => console.error('Error fetching orders:', error));
    }, []);

    useEffect(() => {
        // Recalculate totalPrice whenever price or quantity changes
        if (price && quantity) {
            const total = price * quantity;
            setTotalPrice(total);
        }
    }, [price, quantity]);

    useEffect(() => {
        // Recalculate changeReturned whenever amountGiven or totalPrice changes
        if (amountGiven && totalPrice) {
            const change = amountGiven - totalPrice;
            setChangeReturned(change >= 0 ? change : 0);
        }
    }, [amountGiven, totalPrice]);

    const handleOrderChange = (e) => {
        const orderId = parseInt(e.target.value);
        const order = orders.find(o => o.id === orderId);
        if (order) {
            setProduct(order.product.name);
            setSupplier(order.supplier.name);
            setPrice(order.purchase_price);
            setQuantity(order.quantity); // Fetch quantity from order
            setTotalPrice(order.purchase_price * order.quantity); // Initialize totalPrice
            setAmountGiven('');
            setChangeReturned('');
        }
        setSelectedOrder(orderId);
    };

    const handleAmountGivenChange = (e) => {
        const newAmountGiven = e.target.value;
        setAmountGiven(newAmountGiven);
        // Change returned will be recalculated in the useEffect
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://127.0.0.1:8000/api/purchases', {
            order_id: selectedOrder,
            quantity: parseInt(quantity, 10), // Quantity is fetched from order and sent as-is
            amount_given: parseInt(amountGiven, 10),
        })
        .then(response => {
            console.log('Response:', response.data);
            alert(response.data.message);
            navigate('/purchases'); // Redirect to the list page
        })
        .catch(error => {
            console.error('Error creating purchase:', error.response ? error.response.data : error.message);
        });
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit} style={{ marginBottom: '60px' }}>
                <div className="form-group">
                    <label htmlFor="order_id">Order</label>
                    <select id="order_id" name="order_id" className="form-control" onChange={handleOrderChange} value={selectedOrder}>
                        <option value="">Select Order</option>
                        {orders.map(order => (
                            <option key={order.id} value={order.id}>
                                {`Order No ${order.id} - Product: ${order.product.name}`}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="product_name">Product</label>
                    <input type="text" id="product_name" className="form-control" value={product} readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="supplier_name">Supplier</label>
                    <input type="text" id="supplier_name" className="form-control" value={supplier} readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="purchase_price">Purchase Price</label>
                    <input type="number" id="purchase_price" className="form-control" value={price} readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input type="number" id="quantity" className="form-control" value={quantity} readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="total_price">Total Price</label>
                    <input type="number" id="total_price" className="form-control" value={totalPrice} readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="amount_given">Amount Given</label>
                    <input type="number" id="amount_given" name="amount_given" className="form-control" value={amountGiven} onChange={handleAmountGivenChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="change_returned">Change Returned</label>
                    <input type="number" id="change_returned" className="form-control" value={changeReturned} readOnly />
                </div>
                <button type="submit" className="btn btn-primary">Create Purchase</button>
            </form>
        </div>
    );
};

export default CreatePurchase;
