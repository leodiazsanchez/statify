
import React from 'react';
import Navbar from './navbar';
import Footer from './footer';

const Layout = ({ accessToken, children }) => {
  return (
    <div>
      <Navbar accessToken={accessToken}/>
      <main className="mx-5 my-5">
        {children}
      </main>
      <Footer/>
    </div>
  );
};

export default Layout;
