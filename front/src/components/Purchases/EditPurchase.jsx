import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditPurchase = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [purchase, setPurchase] = useState({
        order_id: '',
        quantity: '',
        amount_given: '',
        total_price: '',
        change_returned: '',
        product_name: '',
        supplier_name: '',
        purchase_price: ''
    });

    useEffect(() => {
        // Fetch orders
        axios.get('http://127.0.0.1:8000/api/orders')
            .then(response => setOrders(response.data))
            .catch(error => console.error('Error fetching orders:', error));

        // Fetch purchase details
        axios.get(`http://127.0.0.1:8000/api/purchases/${id}`)
            .then(response => {
                const purchaseData = response.data;
                setPurchase({
                    order_id: purchaseData.order_id,
                    quantity: purchaseData.quantity,
                    amount_given: purchaseData.amount_given,
                    total_price: purchaseData.total_price,
                    change_returned: purchaseData.change_returned,
                    product_name: purchaseData.order.product.name,
                    supplier_name: purchaseData.order.supplier.name,
                    purchase_price: purchaseData.order.purchase_price
                });
            })
            .catch(error => console.error('Error fetching purchase details:', error));
    }, [id]);

    const handleOrderChange = (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const product = selectedOption.getAttribute('data-product');
        const supplier = selectedOption.getAttribute('data-supplier');
        const price = selectedOption.getAttribute('data-price');
        const quantity = selectedOption.getAttribute('data-quantity');

        setPurchase({
            ...purchase,
            order_id: e.target.value,
            product_name: product,
            supplier_name: supplier,
            purchase_price: price,
            quantity: quantity,
            total_price: calculateTotalPrice(quantity, price)
        });
    };

    const handleQuantityChange = (e) => {
        const quantity = e.target.value;
        setPurchase({
            ...purchase,
            quantity: quantity,
            total_price: calculateTotalPrice(quantity, purchase.purchase_price)
        });
    };

    const handleAmountGivenChange = (e) => {
        const amountGiven = e.target.value;
        setPurchase({
            ...purchase,
            amount_given: amountGiven,
            change_returned: calculateChangeReturned(amountGiven, purchase.total_price)
        });
    };

    const calculateTotalPrice = (quantity, price) => {
        return quantity * price;
    };

    const calculateChangeReturned = (amountGiven, totalPrice) => {
        return amountGiven - totalPrice >= 0 ? amountGiven - totalPrice : 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.put(`http://127.0.0.1:8000/api/purchases/${id}`, purchase)
            .then(response => {
                alert('Purchase updated successfully.');
                navigate('/purchases'); // Redirect to the purchases list page
            })
            .catch(error => console.error('Error updating purchase:', error));
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit} style={{ marginBottom: '60px' }}>
                <div className="form-group">
                    <label htmlFor="order_id">Order</label>
                    <select
                        id="order_id"
                        name="order_id"
                        className="form-control"
                        value={purchase.order_id}
                        onChange={handleOrderChange}
                    >
                        <option value="">Select Order</option>
                        {orders.map(order => (
                            <option
                                key={order.id}
                                value={order.id}
                                data-product={order.product.name}
                                data-supplier={order.supplier.name}
                                data-price={order.purchase_price}
                                data-quantity={order.quantity}
                            >
                                {`Order No ${order.id} - Product: ${order.product.name}`}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="product_name">Product</label>
                    <input
                        type="text"
                        id="product_name"
                        className="form-control"
                        value={purchase.product_name}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="supplier_name">Supplier</label>
                    <input
                        type="text"
                        id="supplier_name"
                        className="form-control"
                        value={purchase.supplier_name}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="purchase_price">Purchase Price</label>
                    <input
                        type="number"
                        id="purchase_price"
                        className="form-control"
                        value={purchase.purchase_price}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        className="form-control"
                        value={purchase.quantity}
                        onChange={handleQuantityChange}
                        required
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="total_price">Total Price</label>
                    <input
                        type="number"
                        id="total_price"
                        className="form-control"
                        value={purchase.total_price}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="amount_given">Amount Given</label>
                    <input
                        type="number"
                        id="amount_given"
                        name="amount_given"
                        className="form-control"
                        value={purchase.amount_given}
                        onChange={handleAmountGivenChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="change_returned">Change Returned</label>
                    <input
                        type="number"
                        id="change_returned"
                        className="form-control"
                        value={purchase.change_returned}
                        readOnly
                    />
                </div>
                <button type="submit" className="btn btn-primary">Update Purchase</button>
            </form>
        </div>
    );
};

export default EditPurchase;
