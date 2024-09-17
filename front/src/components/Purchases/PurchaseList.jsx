import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PurchasesList = () => {
    const [purchases, setPurchases] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/purchases')
            .then(response => setPurchases(response.data))
            .catch(error => console.error('Error fetching purchases:', error));
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure?')) {
            axios.delete(`http://127.0.0.1:8000/api/purchases/${id}`)
                .then(() => {
                    setPurchases(purchases.filter(purchase => purchase.id !== id));
                })
                .catch(error => console.error('Error deleting purchase:', error));
        }
    };

    return (
        <div className="container">
            <Link to="/purchases/create" className="btn btn-primary">Add New Purchase</Link>
            <table className="table table-bordered mt-3">
                <thead>
                    <tr style={{ textAlign: 'center' }}>
                        <th>SL No.</th>
                        <th>Order No</th>
                        <th>Product Name</th>
                        <th>Supplier Name</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {purchases.map((purchase, index) => (
                        <tr key={purchase.id}>
                            <td style={{ textAlign: 'center' }}>{index + 1}</td>
                            <td>{`Order No ${purchase.order.id}`}</td>
                            <td>{purchase.order.product.name}</td>
                            <td>{purchase.order.supplier.name}</td>
                            <td>{purchase.quantity}</td>
                            <td>{purchase.total_price}</td>
                            <td>
                                <Link to={`/purchases/edit/${purchase.id}`} className="btn btn-warning">Edit</Link>
                                <button
                                    onClick={() => handleDelete(purchase.id)}
                                    className="btn btn-danger" style={{ marginLeft: '10px' }}
                                >
                                    Delete
                                </button>
                                <a href={`http://127.0.0.1:8000/api/purchases/invoice/${purchase.id}`} target="_blank" className="btn btn-info" style={{ marginLeft: '10px' }}>Print Invoice</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PurchasesList;
