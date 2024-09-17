import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const CreateOrder = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        product_id: '',
        quantity: '',
        supplier_name: '',
        purchase_price: '',
        total_price: ''
    });
    const navigate = useNavigate();  // Initialize useNavigate

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/products')
            .then(response => setProducts(response.data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    const handleProductChange = (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const price = selectedOption.getAttribute('data-price');
        const supplier = selectedOption.getAttribute('data-supplier');

        setFormData({
            ...formData,
            product_id: e.target.value,
            supplier_name: supplier,
            purchase_price: price,
            total_price: calculateTotalPrice(formData.quantity, price)
        });
    };

    const handleQuantityChange = (e) => {
        const quantity = e.target.value;
        setFormData({
            ...formData,
            quantity: quantity,
            total_price: calculateTotalPrice(quantity, formData.purchase_price)
        });
    };

    const calculateTotalPrice = (quantity, price) => {
        return quantity * price;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://127.0.0.1:8000/api/orders', formData)
            .then(response => {
                alert('Order created successfully.');
                navigate('/orders');  // Redirect to the order list page
            })
            .catch(error => console.error('Error creating order:', error));
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="product_id">Product</label>
                    <select
                        id="product_id"
                        name="product_id"
                        className="form-control"
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
                        value={formData.supplier_name}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="purchase_price">Purchase Price</label>
                    <input
                        type="number"
                        id="purchase_price"
                        className="form-control"
                        value={formData.purchase_price}
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
                        value={formData.quantity}
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
                        value={formData.total_price}
                        readOnly
                    />
                </div>
                <button type="submit" className="btn btn-primary">Create Order</button>
            </form>
        </div>
    );
};

export default CreateOrder;
