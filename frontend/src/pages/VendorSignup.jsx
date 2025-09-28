import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

// Set the base URL for your backend API
const API_URL = 'http://localhost:5000/api/auth';

const VendorSignup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    shopName: '',
    contactNumber: '',
    specialtyDish: '',
    address: '',
    latitude: '',  // Used for user input, then formatted for backend
    longitude: '', // Used for user input, then formatted for backend
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); 
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Validate Coordinates
    const lon = parseFloat(formData.longitude);
    const lat = parseFloat(formData.latitude);
    
    if (isNaN(lon) || isNaN(lat)) {
      return setError('Latitude and Longitude must be valid numbers.');
    }

    try {
      // 2. Prepare data for the Backend API (matching the Vendor model)
      const dataToSend = {
        email: formData.email,
        password: formData.password,
        shopName: formData.shopName,
        contactNumber: formData.contactNumber,
        specialtyDish: formData.specialtyDish,
        address: formData.address,
        // Backend expects [Longitude, Latitude] for GeoJSON 'Point'
        location: {
            type: 'Point',
            coordinates: [lon, lat], 
        },
      };

      const res = await axios.post(`${API_URL}/vendor/signup`, dataToSend);
      
      // 3. Handle Successful Signup
      const { token, user } = res.data;
      
      // Save token and redirect
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setSuccessMsg('Registration successful! Redirecting to your dashboard...');
      
      // Redirect to vendor dashboard after a short delay
      setTimeout(() => navigate('/vendor/dashboard'), 1500);

    } catch (err) {
      console.error('Vendor Signup Failed:', err.response.data);
      setError(err.response.data.msg || 'Registration failed. Please check your inputs.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register Your Street Food Shop 🍜</h2>
      <p className="lead">Join Flavour Finders and boost your visibility!</p>
      
      <form onSubmit={handleSubmit} className="col-lg-8 mx-auto">
        
        {/* Error/Success Messages */}
        {error && <div className="alert alert-danger">{error}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        {/* Shop Info Section */}
        <h5 className="mt-4">Shop Details</h5>
        <div className="row">
          <div className="mb-3 col-md-6">
            <label htmlFor="shopName" className="form-label">Shop Name</label>
            <input type="text" className="form-control" id="shopName" name="shopName" value={formData.shopName} onChange={handleChange} required />
          </div>
          <div className="mb-3 col-md-6">
            <label htmlFor="specialtyDish" className="form-label">Specialty Dish (e.g., Momos)</label>
            <input type="text" className="form-control" id="specialtyDish" name="specialtyDish" value={formData.specialtyDish} onChange={handleChange} required />
          </div>
        </div>
        
        <div className="mb-3">
          <label htmlFor="address" className="form-label">Full Street Address</label>
          <input type="text" className="form-control" id="address" name="address" value={formData.address} onChange={handleChange} required />
        </div>

        {/* Location Section */}
        <h5 className="mt-4">Location Coordinates (Crucial for Map Discovery)</h5>
        <p className="text-muted small">You can find your location coordinates using Google Maps by right-clicking your spot.</p>
        <div className="row">
          <div className="mb-3 col-md-6">
            <label htmlFor="latitude" className="form-label">Latitude</label>
            <input type="text" className="form-control" id="latitude" name="latitude" value={formData.latitude} onChange={handleChange} required />
          </div>
          <div className="mb-3 col-md-6">
            <label htmlFor="longitude" className="form-label">Longitude</label>
            <input type="text" className="form-control" id="longitude" name="longitude" value={formData.longitude} onChange={handleChange} required />
          </div>
        </div>

        {/* Login Credentials Section */}
        <h5 className="mt-4">Login Credentials</h5>
        <div className="row">
          <div className="mb-3 col-md-6">
            <label htmlFor="email" className="form-label">Email Address (for login)</label>
            <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="mb-3 col-md-6">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
        </div>
        
        <div className="mb-3">
            <label htmlFor="contactNumber" className="form-label">Contact Number</label>
            <input type="tel" className="form-control" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
        </div>

        <button type="submit" className="btn btn-success btn-lg w-100 mt-4">Register Shop & Create Account</button>
      </form>
      
      <div className="text-center mt-3">
        <p>Already registered? <Link to="/login">Go to Login</Link></p>
      </div>
    </div>
  );
};

export default VendorSignup;