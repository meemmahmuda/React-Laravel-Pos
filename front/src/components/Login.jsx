import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/api/login', { email, password })
      .then(response => {
        if (response.data.success) {
          localStorage.setItem('token', response.data.token); 
          navigate('/dashboard');
        }
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };
  

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light" style={{ 
        background: 'linear-gradient(135deg, #9B59B6, #87CEFA)', 
        height: '100vh' 
      }}>
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title mb-4"  style={{ 
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' , textAlign: 'center'
              }}>Pos Login</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email:</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password:</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">Log in</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
