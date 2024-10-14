import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "../pages/home";
import NotFound from "../pages/notFound";
import Artists from "../pages/artists";
import Tracks from "../pages/tracks";
import Recommendations from "../pages/recommendations";
import Charts from "../pages/charts";
import Layout from "../components/layout"; // Import the layout component

const Routes = () => {
  const routes = [
    {
      path: "/",
      element: <Layout />, // Wrap in Layout
      children: [
        { path: "/", element: <Home /> },
        { path: "*", element: <NotFound /> },
        { path: "/not-authorized", element: <p>No auth</p> },
        { path: "artists", element: <Artists /> },
        { path: "tracks", element: <Tracks /> },
        { path: "recommendations", element: <Recommendations /> },
        { path: "charts/:page", element: <Charts /> },
      ],
    },
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([...routes]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;
