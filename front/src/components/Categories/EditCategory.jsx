import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditCategory = () => {
  const { id } = useParams(); // Get the category ID from the URL
  const [name, setName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/categories/${id}`);
        setName(response.data.name);
      } catch (error) {
        setErrorMessage('Error fetching category data.');
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchCategory();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://127.0.0.1:8000/api/categories/${id}`, { name });
      setSuccessMessage('Category updated successfully.');
      navigate('/categories'); // Redirect to the index page
    } catch (error) {
      setErrorMessage('Error updating category.');
    }
  };


  return (
    <div className="container">
      <h2>Edit Category</h2>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success">Update</button>
      </form>
    </div>
  );
};

export default EditCategory;
