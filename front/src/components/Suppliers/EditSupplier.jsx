// src/components/Suppliers/EditSupplier.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditSupplier = () => {
  const [supplier, setSupplier] = useState(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams(); // Get the supplier ID from the URL

  useEffect(() => {
    // Fetch the supplier data when the component mounts
    const fetchSupplier = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/suppliers/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const { data } = response;
        setSupplier(data);
        setName(data.name);
        setAddress(data.address);
        setPhone(data.phone);
      } catch (error) {
        console.error('Error fetching supplier:', error);
      }
    };

    fetchSupplier();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/api/suppliers/${id}`, { name, address, phone }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      navigate('/suppliers');
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error('Error updating supplier:', error);
      }
    }
  };


  return (
    <div className="container">
      <h2>Edit Supplier</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && <div className="text-danger">{errors.name[0]}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <textarea
            id="address"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></textarea>
          {errors.address && <div className="text-danger">{errors.address[0]}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            type="number"
            id="phone"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          {errors.phone && <div className="text-danger">{errors.phone[0]}</div>}
        </div>

        <button type="submit" className="btn btn-success">Update Supplier</button>
      </form>
    </div>
  );
};

export default EditSupplier;
