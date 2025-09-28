import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Set the base URL for your backend API
const API_URL = 'http://localhost:5000/api/auth';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'customer', // Default role for the form
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on new input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await axios.post(`${API_URL}/login`, formData);
      
      // Handle Successful Login
      const { token, user } = res.data;
      
      // Save token and user info (We'll use local storage for now)
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      console.log('Login Successful:', user);

      // Redirect based on role
      if (user.role === 'vendor') {
        navigate('/vendor/dashboard');
      } else {
        navigate('/customer/dashboard');
      }

    } catch (err) {
      console.error('Login Failed:', err.response.data);
      // Display error message from the backend
      setError(err.response.data.msg || 'Login failed. Check credentials.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login to Flavour Finders</h2>
      <form onSubmit={handleSubmit} className="col-md-6 mx-auto">
        
        {/* Error Message */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Role Selector */}
        <div className="mb-3">
          <label htmlFor="role" className="form-label">I am logging in as:</label>
          <select 
            className="form-select"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="customer">Customer (Foodie)</option>
            <option value="vendor">Vendor (Shop Owner)</option>
          </select>
        </div>

        {/* Email Input */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password Input */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
      <div className="text-center mt-3">
        <p>New Vendor? <Link to="/signup/vendor">Register Your Shop Here</Link></p>
      </div>
    </div>
  );
};

export default Login;