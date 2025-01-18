import { Outlet, useParams } from "react-router-dom";
import Navbar from "./navbar";
import WebPlayback from "./webPlayback";
import { useAuth } from "../providers/authProvider";

const Layout = () => {
  const { token } = useAuth();

  return (
    <>
      <Navbar />
      <main className="px-md-5">
        <div className="container-fluid">
          <Outlet />
        </div>
      </main>
      {token ? <WebPlayback token={token}></WebPlayback> : <></>}
    </>
  );
};

export default Layout;
