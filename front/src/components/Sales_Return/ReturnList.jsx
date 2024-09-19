import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ReturnList = () => {
    const [salesReturns, setSalesReturns] = useState([]);

    useEffect(() => {
        const fetchSalesReturns = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/sales_returns');
                setSalesReturns(response.data);
            } catch (error) {
                console.error('Error fetching sales returns:', error);
            }
        };

        fetchSalesReturns();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this sales return?')) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/sales_returns/${id}`);
                setSalesReturns(salesReturns.filter((returnItem) => returnItem.id !== id));
            } catch (error) {
                console.error('Error deleting sales return:', error);
            }
        }
    };

    return (
        <div className="container">
            <h2 style={{ textAlign: 'center' }}>Sales Return List</h2>
            <Link to="/sales_returns/create" className="btn btn-primary">Add Sales Return</Link>
            <table className="table table-bordered mt-3">
                <thead>
                    <tr style={{ textAlign: 'center' }}>
                        <th>Sale ID</th>
                        <th>Product Name</th>
                        <th>Quantity Returned</th>
                        <th>Total Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {salesReturns.map((returnItem) => (
                        <tr key={returnItem.id}>
                            <td style={{ textAlign: 'center' }}>{returnItem.sale.id}</td>
                            <td>{returnItem.sale.product.name}</td>
                            <td style={{ textAlign: 'center' }}>{returnItem.quantity}</td>
                            <td>{returnItem.total_price}</td>
                            <td style={{ textAlign: 'center' }}>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(returnItem.id)}
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

export default ReturnList;
