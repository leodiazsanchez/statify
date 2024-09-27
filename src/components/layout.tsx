import { useEffect } from "react";
import Navbar from "./navbar";

const Layout = ({ accessToken, children, trackPlaying }) => {
  
  useEffect(() => {
    console.log('trackPlaying has changed:', trackPlaying);
    // You can perform any other side effects here when trackPlaying changes
  }, [trackPlaying]); // Dependency array to rerun the effect whenever trackPlaying changes
  
  return (
    <>
      <Navbar accessToken={accessToken}/>
      <main className={`py-5 px-5 pb-5 ${trackPlaying ? 'active-track' : 'inactive-track'}`}>{children}</main>
      {/*!accessToken && <Footer />*/}
    </>
  );
};

export default Layout;
