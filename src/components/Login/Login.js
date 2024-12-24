import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/login', { email, password });
      setMessage(response.data.message);
      localStorage.setItem("email", email);
      window.location.href="/";
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Server error');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h2 className="text-center">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                className="form-control"
                value={username}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mt-3">Login</button>
          </form>
          <Typography className='justify-content-center mt-3'>Don't have an account? <Link to="/signup" className="menu-links" style={{color:'#0062AF'}}>SignUp</Link></Typography>
          {message && <div className="alert mt-3 text-center">{message}</div>}
        </div>
      </div>
    </div>
  );
}

export default Login;
