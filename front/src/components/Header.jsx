import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Retrieve the token from local storage
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found');
      return;
    }

    axios.post('http://127.0.0.1:8000/api/logout', {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(() => {
      localStorage.removeItem('token'); // Remove token from local storage
      navigate('/'); // Redirect to login or home page
      window.location.reload(); // Reload the page to ensure logout from all tabs
    })
    .catch(error => {
      console.error('There was an error logging out!', error.response ? error.response.data : error.message);
    });
  };

  return (
    <header className="bg-light p-3">
      <div className="container d-flex justify-content-between align-items-center">
        <h1>Dashboard</h1>
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Admin
          </button>
          <ul className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
            <li><button className="dropdown-item" onClick={() => navigate('/profile')}>Profile</button></li>
            <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
