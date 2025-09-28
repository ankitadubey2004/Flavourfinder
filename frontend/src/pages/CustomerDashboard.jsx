import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/customers/vendors';

const CustomerDashboard = () => {
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State to hold the dish being searched

  // Function to fetch vendors from the backend
  const fetchVendors = async (dish = '') => {
    setLoading(true);
    setError('');
    
    // Construct the API URL with the search query parameter
    const url = dish ? `${API_URL}?dish=${dish}` : API_URL;

    try {
      const res = await axios.get(url);
      setVendors(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Vendor Fetch Failed:', err.response || err);
      // Handle the case where the backend returns 'No open vendors found' (status 200, but empty data or message)
      if (err.response && err.response.status === 200 && err.response.data.msg) {
          setVendors([]);
          setError(err.response.data.msg);
      } else {
          setError('Failed to fetch vendors. Server might be down.');
      }
      setLoading(false);
      setVendors([]); // Clear any old list on error
    }
  };

  // Fetch all open vendors when the component first loads
  useEffect(() => {
    fetchVendors();
  }, []);

  // Handle the search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchTerm); // Set the term to display
    fetchVendors(searchTerm); // Trigger fetch with the current search term
  };

  return (
    <div className="container mt-5">
      <h2>Flavour Finder Discovery ✨</h2>
      <p className="lead">Find the best open street food vendors near you!</p>

      {/* --- Search Bar --- */}
      <form onSubmit={handleSearchSubmit} className="d-flex mb-4">
        <input
          type="text"
          className="form-control form-control-lg me-2"
          placeholder="Search by dish name (e.g., Momos, Chaat, Biryani)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>
      
      {/* --- Status & Error Messages --- */}
      {loading && <div className="alert alert-info">Loading best vendors...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      {/* Displaying Search Query */}
      {searchQuery && vendors.length > 0 && (
          <h4 className='mt-4'>Showing results for: "{searchQuery}"</h4>
      )}

      {/* --- Vendor List --- */}
      <div className="row mt-4">
        {vendors.length > 0 ? (
          vendors.map((vendor) => (
            <div key={vendor._id} className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-success">{vendor.shopName}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">Specialty: {vendor.specialtyDish}</h6>
                  <p className="card-text mb-1">📍 {vendor.address}</p>
                  <p className="card-text">📞 {vendor.contactNumber}</p>
                  
                  {/* Future: Add link to Reviews page */}
                  <a href="#" className="card-link">See Reviews</a>
                </div>
              </div>
            </div>
          ))
        ) : (
          !loading && !error && 
          <div className="col">
              <p className="text-center text-muted">No vendors found. Try searching for a different dish or check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;