import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Lin } from 'react-router-dom';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/expenses', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setExpenses(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching expenses.');
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) 
    try {
      await axios.delete(`http://127.0.0.1:8000/api/expenses/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setExpenses(expenses.filter(expense => expense.id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <h2 style={{ textAlign: 'center' }}>Expense List</h2>
      <Link to="/expenses/create" className="btn btn-primary mb-3">Add New Expense</Link>

      <table className="table table-striped table-hover">
        <thead>
          <tr style={{ textAlign: 'center' }}>
            <th>SL No.</th>
            <th>Salaries and Wages</th>
            <th>Rent</th>
            <th>Utilities</th>
            <th>Other Expenses</th>
            <th>Transportation Cost</th>
            <th>Total Expense</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <tr key={expense.id}>
              <td style={{ textAlign: 'center' }}>{index + 1}</td>
              <td>{expense.salaries_wages}</td>
              <td>{expense.rent}</td>
              <td>{expense.utilities}</td>
              <td>{expense.other_expenses}</td>
              <td>{expense.transportation_cost}</td>
              <td>{expense.total_expense}</td>
              <td style={{ textAlign: 'center' }}>
                <Link to={`/expenses/edit/${expense.id}`} className="btn btn-warning">Edit</Link>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="btn btn-danger ml-2"
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

export default ExpenseList;
