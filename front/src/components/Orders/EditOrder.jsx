import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [order, setOrder] = useState({
        product_id: '',
        quantity: '',
        supplier_name: '',
        purchase_price: '',
        total_price: ''
    });

    useEffect(() => {
        // Fetch products
        axios.get('http://127.0.0.1:8000/api/products')
            .then(response => setProducts(response.data))
            .catch(error => console.error('Error fetching products:', error));

        // Fetch order details
        axios.get(`http://127.0.0.1:8000/api/orders/${id}`)
            .then(response => {
                const orderData = response.data;
                setOrder({
                    product_id: orderData.product_id,
                    quantity: orderData.quantity,
                    supplier_name: orderData.supplier.name, // Adjust if supplier is nested
                    purchase_price: orderData.purchase_price,
                    total_price: orderData.total_price
                });
            })
            .catch(error => console.error('Error fetching order details:', error));
    }, [id]);

    const handleProductChange = (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const price = selectedOption.getAttribute('data-price');
        const supplier = selectedOption.getAttribute('data-supplier');

        setOrder({
            ...order,
            product_id: e.target.value,
            supplier_name: supplier,
            purchase_price: price,
            total_price: calculateTotalPrice(order.quantity, price)
        });
    };

    const handleQuantityChange = (e) => {
        const quantity = e.target.value;
        setOrder({
            ...order,
            quantity: quantity,
            total_price: calculateTotalPrice(quantity, order.purchase_price)
        });
    };

    const calculateTotalPrice = (quantity, price) => {
        return quantity * price;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.put(`http://127.0.0.1:8000/api/orders/${id}`, order)
            .then(response => {
                alert('Order updated successfully.');
                navigate('/orders'); // Redirect to the order list page
            })
            .catch(error => console.error('Error updating order:', error));
    };

    return (
        <div className="container">
            <h2>Edit Order</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="product_id">Product</label>
                    <select
                        id="product_id"
                        name="product_id"
                        className="form-control"
                        value={order.product_id}
                        onChange={handleProductChange}
                    >
                        <option value="">Select Product</option>
                        {products.map(product => (
                            <option
                                key={product.id}
                                value={product.id}
                                data-price={product.purchase_price}
                                data-supplier={product.supplier.name}
                            >
                                {product.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="supplier_name">Supplier</label>
                    <input
                        type="text"
                        id="supplier_name"
                        className="form-control"
                        value={order.supplier_name}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="purchase_price">Purchase Price</label>
                    <input
                        type="number"
                        id="purchase_price"
                        className="form-control"
                        value={order.purchase_price}
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
                        value={order.quantity}
                        onChange={handleQuantityChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="total_price">Total Price</label>
                    <input
                        type="number"
                        id="total_price"
                        className="form-control"
                        value={order.total_price}
                        readOnly
                    />
                </div>
                <button type="submit" className="btn btn-primary">Update Order</button>
            </form>
        </div>
    );
};

export default EditOrder;
