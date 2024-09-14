// src/components/Suppliers/SupplierList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/suppliers', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setSuppliers(response.data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/suppliers/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setSuppliers(suppliers.filter(supplier => supplier.id !== id));
      } catch (error) {
        console.error('Error deleting supplier:', error);
      }
    }
  };


  return (
    <div className="container">
      <h2 style={{ textAlign: 'center' }}>Supplier List</h2>
      <Link to="/suppliers/create" className="btn btn-primary mb-3">Add New Supplier</Link>
      <table className="table table-striped table-hover">
        <thead>
          <tr style={{ textAlign: 'center' }}>
            <th>SL No.</th>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier, index) => (
            <tr key={supplier.id}>
              <td style={{ textAlign: 'center' }}>{index + 1}</td>
              <td>{supplier.name}</td>
              <td>{supplier.address}</td>
              <td>{supplier.phone}</td>
              <td style={{ textAlign: 'center' }}>
                <Link to={`/suppliers/edit/${supplier.id}`} className="btn btn-warning">Edit</Link>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(supplier.id)} style={{ marginLeft: '10px' }}
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

export default SupplierList;
