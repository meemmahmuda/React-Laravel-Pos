import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct = () => {
    const [product, setProduct] = useState({
        name: '',
        code: '',
        supplier_id: '',
        category_id: '',
        purchase_price: '',
        selling_price: '',
    });
    const [suppliers, setSuppliers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { id } = useParams(); // Get the product ID from URL

    useEffect(() => {
        fetchProductData();
        fetchSuppliersAndCategories();
    }, []);

    // Fetch the product data
    const fetchProductData = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/products/${id}`);
            setProduct(response.data);
        } catch (error) {
            console.error('Error fetching product data', error);
        }
    };

    // Fetch suppliers and categories
    const fetchSuppliersAndCategories = async () => {
        try {
            const suppliersResponse = await axios.get('http://127.0.0.1:8000/api/suppliers');
            const categoriesResponse = await axios.get('http://127.0.0.1:8000/api/categories');
            setSuppliers(suppliersResponse.data);
            setCategories(categoriesResponse.data);
        } catch (error) {
            console.error('Error fetching suppliers or categories', error);
        }
    };

    // Handle form input changes
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setProduct({ ...product, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`http://127.0.0.1:8000/api/products/${id}`, product);
            navigate('/products'); // Redirect to the product list after successful update
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors); // Set validation errors
            }
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className="form-control"
                        value={product.name}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.name && <div className="alert alert-danger">{errors.name[0]}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="code">Product Code</label>
                    <input
                        type="text"
                        name="code"
                        id="code"
                        className="form-control"
                        value={product.code}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.code && <div className="alert alert-danger">{errors.code[0]}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="supplier_id">Supplier</label>
                    <select
                        name="supplier_id"
                        id="supplier_id"
                        className="form-control"
                        value={product.supplier_id}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select Supplier</option>
                        {suppliers.map((supplier) => (
                            <option key={supplier.id} value={supplier.id}>
                                {supplier.name}
                            </option>
                        ))}
                    </select>
                    {errors.supplier_id && <div className="alert alert-danger">{errors.supplier_id[0]}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="category_id">Category</label>
                    <select
                        name="category_id"
                        id="category_id"
                        className="form-control"
                        value={product.category_id}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {errors.category_id && <div className="alert alert-danger">{errors.category_id[0]}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="purchase_price">Purchase Price</label>
                    <input
                        type="number"
                        name="purchase_price"
                        id="purchase_price"
                        className="form-control"
                        value={product.purchase_price}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.purchase_price && <div className="alert alert-danger">{errors.purchase_price[0]}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="selling_price">Selling Price</label>
                    <input
                        type="number"
                        name="selling_price"
                        id="selling_price"
                        className="form-control"
                        value={product.selling_price}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.selling_price && <div className="alert alert-danger">{errors.selling_price[0]}</div>}
                </div>

                <button type="submit" className="btn btn-primary">Update Product</button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/products')} style={{ marginLeft: '10px' }}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default EditProduct;
