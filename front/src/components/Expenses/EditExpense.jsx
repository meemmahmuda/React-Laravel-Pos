// src/components/EditExpense.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditExpense = () => {
  const { id } = useParams(); // Get the expense ID from the URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    salaries_wages: '',
    rent: '',
    utilities: '',
    other_expenses: '',
    transportation_cost: '',
  });
  const [errors, setErrors] = useState({});

  // Fetch expense data when component mounts
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/expenses/${id}`)
      .then((response) => {
        setFormData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching expense:", error);
      });
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission for updating the expense
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://127.0.0.1:8000/api/expenses/${id}`, formData)
      .then((response) => {
        alert(response.data.message); // Show success message
        navigate('/expenses'); // Redirect to the expense list
      })
      .catch((error) => {
        if (error.response && error.response.data.errors) {
          setErrors(error.response.data.errors); // Set validation errors
        }
      });
  };

  return (
    <div className="container">
      <h2>Edit Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="salaries_wages">Salaries and Wages</label>
          <input
            type="number"
            name="salaries_wages"
            value={formData.salaries_wages}
            onChange={handleChange}
            className="form-control"
            required
          />
          {errors.salaries_wages && <span className="text-danger">{errors.salaries_wages[0]}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="rent">Rent</label>
          <input
            type="number"
            name="rent"
            value={formData.rent}
            onChange={handleChange}
            className="form-control"
            required
          />
          {errors.rent && <span className="text-danger">{errors.rent[0]}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="utilities">Utilities</label>
          <input
            type="number"
            name="utilities"
            value={formData.utilities}
            onChange={handleChange}
            className="form-control"
            required
          />
          {errors.utilities && <span className="text-danger">{errors.utilities[0]}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="other_expenses">Other Expenses</label>
          <input
            type="number"
            name="other_expenses"
            value={formData.other_expenses}
            onChange={handleChange}
            className="form-control"
            required
          />
          {errors.other_expenses && <span className="text-danger">{errors.other_expenses[0]}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="transportation_cost">Transportation Cost</label>
          <input
            type="number"
            name="transportation_cost"
            value={formData.transportation_cost}
            onChange={handleChange}
            className="form-control"
            required
          />
          {errors.transportation_cost && <span className="text-danger">{errors.transportation_cost[0]}</span>}
        </div>

        <button type="submit" className="btn btn-primary">Update Expense</button>
      </form>
    </div>
  );
};

export default EditExpense;
