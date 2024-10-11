import { Outlet } from "react-router-dom";
import Navbar from "./navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className={`py-5 px-5 pb-5`}>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
