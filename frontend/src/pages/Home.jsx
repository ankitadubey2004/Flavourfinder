import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container text-center mt-5">
      <h1>Welcome to Flavour Finders!</h1>
      <p className="lead">Discover the best street food near you or register your amazing shop.</p>
      <div className="d-grid gap-2 col-6 mx-auto mt-4">
        <Link to="/login" className="btn btn-primary btn-lg">Customer Login</Link>
        <Link to="/signup/vendor" className="btn btn-success btn-lg">Become a Vendor</Link>
      </div>
    </div>
  );
};

export default Home;