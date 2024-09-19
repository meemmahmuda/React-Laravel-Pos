import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SalesList = () => {
    const [sales, setSales] = useState([]);

    // Fetch sales data on component mount
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/sales')
            .then(response => setSales(response.data))
            .catch(error => console.error('Error fetching sales:', error));
    }, []);

    // Handle delete sale
    const handleDelete = (id) => {
        if (window.confirm('Are you sure?')) {
            axios.delete(`http://127.0.0.1:8000/api/sales/${id}`)
                .then(() => {
                    setSales(sales.filter(sale => sale.id !== id));
                })
                .catch(error => console.error('Error deleting sale:', error));
        }
    };

    // Handle print invoice
    const handlePrint = (id) => {
        const printWindow = window.open(`http://127.0.0.1:8000/api/sales/invoice/${id}`, '_blank');
        if (printWindow) {
            printWindow.focus();
            printWindow.print();
        }
    };

    return (
        <div className="container">
            <h2 style={{ textAlign: 'center' }}>Sales List</h2>
            <Link to="/sales/create" className="btn btn-primary mb-3">Add New Sale</Link>
            <table className="table table-striped table-hover mt-3">
                <thead>
                    <tr style={{ textAlign: 'center' }}>
                        <th>SL No.</th>
                        <th>Customer Name</th>
                        <th>Address</th>
                        <th>Customer Contact No.</th>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Discount</th>
                        <th>Total Price</th>
                        <th style={{ width: '30%' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map((sale, index) => (
                        <tr key={sale.id}>
                            <td style={{ textAlign: 'center' }}>{index + 1}</td>
                            <td>{sale.customer_name}</td>
                            <td>{sale.address}</td>
                            <td>{sale.phone_no}</td>
                            <td>{sale.product?.name || 'No product available'}</td>
                            <td>{sale.product?.category?.name || 'No category available'}</td>
                            <td>{sale.quantity}</td>
                            <td>{sale.discount}%</td>
                            <td>{sale.total_price}</td>
                            <td style={{ textAlign: 'center' }}>
                                <Link to={`/sales/edit/${sale.id}`} className="btn btn-warning btn-sm">Edit</Link>
                                <button
                                    onClick={() => handleDelete(sale.id)}
                                    className="btn btn-danger btn-sm" style={{ marginLeft: '10px' }}
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => handlePrint(sale.id)}
                                    className="btn btn-info btn-sm" style={{ marginLeft: '10px' }}
                                >
                                    Print Invoice
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SalesList;
