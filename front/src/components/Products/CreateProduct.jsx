import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const CreateProduct = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([{ name: '', code: '', supplier_id: '', category_id: '', purchase_price: '', selling_price: '' }]);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        fetchSuppliersAndCategories();
    }, []);

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

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const newProducts = [...products];
        newProducts[index][name] = value;
        setProducts(newProducts);
    };

    const addProduct = () => {
        setProducts([...products, { name: '', code: '', supplier_id: '', category_id: '', purchase_price: '', selling_price: '' }]);
    };

    const removeProduct = (index) => {
        const newProducts = products.filter((_, i) => i !== index);
        setProducts(newProducts);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/api/products', { products });
            // Redirect to product list page after successful creation
            navigate('/products'); // Use navigate to redirect
        } catch (error) {
            console.error('Error creating products', error);
        }
    };

    return (
        <div className="container">
            <h2>Add New Product</h2>
            <form onSubmit={handleSubmit} style={{ paddingBottom: '60px' }}>
                {products.map((product, index) => (
                    <div key={index} className="product-form-group">
                        <h4 style={{ textAlign: 'center', fontWeight: 'bold', color: 'blue', fontSize: '20px' }}>
                            Product {index + 1}
                        </h4>
                        <div className="form-group">
                            <label>Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={product.name}
                                onChange={(e) => handleInputChange(index, e)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Product Code</label>
                            <input
                                type="text"
                                name="code"
                                value={product.code}
                                onChange={(e) => handleInputChange(index, e)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Supplier</label>
                            <select
                                name="supplier_id"
                                value={product.supplier_id}
                                onChange={(e) => handleInputChange(index, e)}
                                className="form-control"
                                required
                            >
                                <option value="">Select Supplier</option>
                                {suppliers.map((supplier) => (
                                    <option key={supplier.id} value={supplier.id}>
                                        {supplier.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select
                                name="category_id"
                                value={product.category_id}
                                onChange={(e) => handleInputChange(index, e)}
                                className="form-control"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Purchase Price</label>
                            <input
                                type="number"
                                name="purchase_price"
                                value={product.purchase_price}
                                onChange={(e) => handleInputChange(index, e)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Selling Price</label>
                            <input
                                type="number"
                                name="selling_price"
                                value={product.selling_price}
                                onChange={(e) => handleInputChange(index, e)}
                                className="form-control"
                                required
                            />
                        </div>
                        {products.length > 1 && (
                            <button type="button" className="btn btn-danger" onClick={() => removeProduct(index)}>
                                <i className="fa fa-minus"></i> Remove Product
                            </button>
                        )}
                        <hr />
                    </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={addProduct}>
                    <i className="fa fa-plus"></i> Add Another Product
                </button>
                <button type="submit" className="btn btn-primary" style={{ marginLeft: '10px' }}>
                    Save Products
                </button>
            </form>
        </div>
    );
};

export default CreateProduct;
