import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateSales = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState({
        customer_name: '',
        address: '',
        phone_no: '',
        product_id: '',
        product_name: '',
        product_code: '',
        category: '',
        selling_price: 0,
        stock: 0,
        discount: 0,
        quantity: 1,
        total_price: 0,
        money_taken: 0,
        money_returned: 0,
    });

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the list of products from the backend
        axios.get('http://127.0.0.1:8000/api/products')
            .then(response => setProducts(response.data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    const handleProductChange = (e) => {
        const selectedOption = products.find(product => product.id === parseInt(e.target.value));

        if (selectedOption) {
            setFormData({
                ...formData,
                product_id: selectedOption.id,
                product_name: selectedOption.name,
                product_code: selectedOption.code,
                category: selectedOption.category.name,
                selling_price: selectedOption.selling_price,
                stock: selectedOption.stock,
                quantity: 1, // Reset the quantity when a new product is selected
                discount: 0,
                total_price: selectedOption.selling_price,
            });
            setSelectedProduct(selectedOption);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === 'quantity' && selectedProduct) {
            const quantity = Math.min(value, selectedProduct.stock);
            setFormData(prevState => ({
                ...prevState,
                quantity,
                total_price: calculateTotalPrice(quantity, prevState.selling_price, prevState.discount),
            }));
        }

        if (name === 'discount' || name === 'quantity') {
            const updatedTotalPrice = calculateTotalPrice(formData.quantity, formData.selling_price, formData.discount);
            setFormData(prevState => ({
                ...prevState,
                total_price: updatedTotalPrice,
            }));
        }

        if (name === 'money_taken') {
            setFormData(prevState => ({
                ...prevState,
                money_returned: calculateMoneyReturned(prevState.total_price, value),
            }));
        }
    };

    const calculateTotalPrice = (quantity, price, discount) => {
        const subtotal = quantity * price;
        const discountAmount = (discount / 100) * subtotal;
        return Math.max(subtotal - discountAmount, 0);
    };

    const calculateMoneyReturned = (totalPrice, moneyTaken) => {
        return Math.max(moneyTaken - totalPrice, 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Send the data to the server via POST
        axios.post('http://127.0.0.1:8000/api/sales', formData)
            .then(response => {
                console.log('Sale created successfully:', response.data);
                navigate('/sales'); // Redirect to sales list page after successful creation
            })
            .catch(error => console.error('Error creating sale:', error));
    };

    return (
        <div className="container">
            <h2>Create Sale</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="customer_name">Customer Name</label>
                    <input
                        type="text"
                        id="customer_name"
                        name="customer_name"
                        className="form-control"
                        value={formData.customer_name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        className="form-control"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phone_no">Phone No</label>
                    <input
                        type="number"
                        id="phone_no"
                        name="phone_no"
                        className="form-control"
                        value={formData.phone_no}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="product_id">Product</label>
                    <select
                        id="product_id"
                        name="product_id"
                        className="form-control"
                        value={formData.product_id}
                        onChange={handleProductChange}
                        required
                    >
                        <option value="">Select Product</option>
                        {products.map(product => (
                            <option key={product.id} value={product.id}>
                                {product.name} (Stock: {product.stock})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="product_name">Product Name</label>
                    <input type="text" id="product_name" className="form-control" value={formData.product_name} readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="product_code">Product Code</label>
                    <input type="text" id="product_code" className="form-control" value={formData.product_code} readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input type="text" id="category" className="form-control" value={formData.category} readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="selling_price">Selling Price</label>
                    <input type="number" id="selling_price" className="form-control" value={formData.selling_price} readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="stock">Stock Available</label>
                    <input type="number" id="stock" className="form-control" value={formData.stock} readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="discount">Discount</label>
                    <input
                        type="number"
                        id="discount"
                        name="discount"
                        className="form-control"
                        value={formData.discount}
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="total_price">Total Price</label>
                    <input
                        type="number"
                        id="total_price"
                        name="total_price"
                        className="form-control"
                        value={formData.total_price}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="money_taken">Money Taken</label>
                    <input
                        type="number"
                        id="money_taken"
                        name="money_taken"
                        className="form-control"
                        value={formData.money_taken}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="money_returned">Money Returned</label>
                    <input
                        type="number"
                        id="money_returned"
                        name="money_returned"
                        className="form-control"
                        value={formData.money_returned}
                        readOnly
                    />
                </div>
                <button type="submit" className="btn btn-primary">Create Sale</button>
            </form>
        </div>
    );
};

export default CreateSales;
