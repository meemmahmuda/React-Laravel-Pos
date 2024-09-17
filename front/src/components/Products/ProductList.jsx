import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('There was an error fetching the products!', error);
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/api/products/${id}`);
            setSuccessMessage('Product deleted successfully.');
            fetchProducts(); // Refresh product list after deletion
        } catch (error) {
            setErrorMessage('There was an error deleting the product.');
        }
    };

    return (
        <div className="container">
            <Link to="/products/create" className="btn btn-primary mb-3">Add New Product</Link>

            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <table className="table table-bordered mt-3">
                <thead>
                    <tr style={{ textAlign: 'center' }}>
                        <th>SL No.</th>
                        <th>Name</th>
                        <th>Code</th>
                        <th>Supplier</th>
                        <th>Category</th>
                        <th>Purchase Price</th>
                        <th>Selling Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={product.id} className={product.stock <= 10 ? 'table-danger' : ''}>
                            <td style={{ textAlign: 'center' }}>{index + 1}</td>
                            <td>{product.name}</td>
                            <td>{product.code}</td>
                            <td>{product.supplier?.name || 'N/A'}</td>
                            <td>{product.category?.name || 'N/A'}</td>
                            <td>{product.purchase_price}</td>
                            <td>{product.selling_price}</td>
                            <td>{product.stock || 'N/A'}</td>
                            <td style={{ textAlign: 'center' }}>
                                <Link to={`/products/edit/${product.id}`} className="btn btn-warning btn-sm">Edit</Link>
                                <button
                                    onClick={() => deleteProduct(product.id)}
                                    className="btn btn-danger btn-sm"
                                    style={{ marginLeft: '10px' }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList;
