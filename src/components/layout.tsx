import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import WebPlayback from "./webPlayback";
import { useAuth } from "../providers/authProvider";

const Layout = () => {
  const { token } = useAuth();
  return (
    <>
      <Navbar />
      <main className={`py-5 px-5 pb-5`}>
        <Outlet />
      </main>
      {token ? <WebPlayback token={token}></WebPlayback> : <></>}
    </>
  );
};

export default Layout;
