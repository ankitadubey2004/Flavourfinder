import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import the page components we are about to create
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import VendorSignup from './pages/VendorSignup.jsx';
import CustomerDashboard from './pages/CustomerDashboard.jsx';
import VendorDashboard from './pages/VendorDashboard.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        {/* We'll add a navigation bar component here later */}
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup/vendor" element={<VendorSignup />} />

          {/* Protected Routes (We'll implement the actual protection logic later) */}
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          
          {/* Fallback route for 404 Not Found (Optional) */}
          {/* <Route path="*" element={<h1>404 Not Found</h1>} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;