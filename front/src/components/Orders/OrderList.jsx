import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    // Fetch orders from the backend
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    // Handle delete order
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/orders/${id}`);
                setOrders(orders.filter(order => order.id !== id));
            } catch (error) {
                console.error('Error deleting order:', error);
            }
        }
    };

    return (
        <div className="container">
            <h2 style={{ textAlign: 'center' }}>Order List</h2>
            <Link to="/orders/create" className="btn btn-primary mb-3">Add New Order</Link>
            <table className="table table-striped table-hover">
                <thead>
                    <tr style={{ textAlign: 'center' }}>
                        <th>SL No.</th>
                        <th>Product</th>
                        <th>Supplier</th>
                        <th>Quantity</th>
                        <th>Purchase Price</th>
                        <th>Total Price</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                        <tr key={order.id}>
                            <td style={{ textAlign: 'center' }}>{'Order No ' + (index + 1)}</td>
                            <td>{order.product.name}</td>
                            <td>{order.supplier.name}</td>
                            <td>{order.quantity}</td>
                            <td>{order.purchase_price}</td>
                            <td>{order.total_price}</td>
                            <td style={{ textAlign: 'center' }}>
                                <Link to={`/orders/edit/${order.id}`} className="btn btn-warning">Edit</Link>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(order.id)}
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

export default OrderList;
