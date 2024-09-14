import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function CategoryList() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/categories/${id}`);
        setCategories(categories.filter(category => category.id !== id));
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: 'center' }}>Category List</h2>
      <Link to="/categories/create" className="btn btn-primary mb-3">Add New Category</Link>
      <table className="table table-striped table-hover">
        <thead>
          <tr style={{ textAlign: 'center' }}>
            <th>SL No.</th>
            <th style={{ width: '60%' }}>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category.id}>
              <td style={{ textAlign: 'center' }}>{index + 1}</td>
              <td>{category.name}</td>
              <td style={{ textAlign: 'center' }}>
                <Link to={`/categories/edit/${category.id}`} className="btn btn-warning">Edit</Link>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(category.id)}
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
}

export default CategoryList;
