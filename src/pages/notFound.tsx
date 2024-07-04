import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className='d-flex flex-column justify-content-center align-items-center' style={{ minHeight: '80vh' }}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <button className='btn signIn text-light'><Link className='nav-link' to="/">Go to Home</Link></button>
    </div>
  );
};

export default NotFound;
