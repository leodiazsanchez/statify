import Navbar from "./navbar";
import Footer from "./footer";

const Layout = ({ accessToken, children }) => {

  return (
    <div>
      <Navbar accessToken={accessToken} />
      <main className="my-5 mx-5 pb-5">{children}</main>
      {/*!accessToken && <Footer />*/}
    </div>
  );
};

export default Layout;
