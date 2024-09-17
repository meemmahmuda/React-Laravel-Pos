// src/components/ExpenseForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateExpense = () => {
  const [formData, setFormData] = useState({
    salaries_wages: '',
    rent: '',
    utilities: '',
    other_expenses: '',
    transportation_cost: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/api/expenses', formData)
      .then(response => {
        alert(response.data.message); // Show success message
        navigate('/expenses'); // Redirect to expenses list
      })
      .catch(error => {
        if (error.response && error.response.data.errors) {
          setErrors(error.response.data.errors); // Set validation errors
        }
      });
  };

  return (
    <div className="container">
      <h2>Add New Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="salaries_wages">Salaries and Wages</label>
          <input
            type="number"
            name="salaries_wages"
            className="form-control"
            value={formData.salaries_wages}
            onChange={handleChange}
            required
          />
          {errors.salaries_wages && <span className="text-danger">{errors.salaries_wages[0]}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="rent">Rent</label>
          <input
            type="number"
            name="rent"
            className="form-control"
            value={formData.rent}
            onChange={handleChange}
            required
          />
          {errors.rent && <span className="text-danger">{errors.rent[0]}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="utilities">Utilities</label>
          <input
            type="number"
            name="utilities"
            className="form-control"
            value={formData.utilities}
            onChange={handleChange}
            required
          />
          {errors.utilities && <span className="text-danger">{errors.utilities[0]}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="other_expenses">Other Expenses</label>
          <input
            type="number"
            name="other_expenses"
            className="form-control"
            value={formData.other_expenses}
            onChange={handleChange}
            required
          />
          {errors.other_expenses && <span className="text-danger">{errors.other_expenses[0]}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="transportation_cost">Transportation Cost</label>
          <input
            type="number"
            name="transportation_cost"
            className="form-control"
            value={formData.transportation_cost}
            onChange={handleChange}
            required
          />
          {errors.transportation_cost && <span className="text-danger">{errors.transportation_cost[0]}</span>}
        </div>

        <button type="submit" className="btn btn-primary">Save Expense</button>
      </form>
    </div>
  );
};

export default CreateExpense;
