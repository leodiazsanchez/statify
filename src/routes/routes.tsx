import { useRoutes } from "react-router-dom";
import Home from "../pages/home";
import NotFound from "../pages/notFound";
import Artists from "../pages/artists";
import Tracks from "../pages/tracks";
import Recommendations from "../pages/recommendations";
import Layout from "../components/layout";
import Genres from "../pages/genres";
import PrivateRoute from "./privateRoute";

const RoutesComponent = () => {
  const routes = [
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "*", element: <NotFound /> },
        {
          path: "artists",
          element: <PrivateRoute element={<Artists />} />, // Wrap in PrivateRoute
        },
        {
          path: "tracks",
          element: <PrivateRoute element={<Tracks />} />, // Wrap in PrivateRoute
        },
        {
          path: "recommendations",
          element: <PrivateRoute element={<Recommendations />} />, // Wrap in PrivateRoute
        },
        {
          path: "genres",
          element: <PrivateRoute element={<Genres />} />, // Wrap in PrivateRoute
        },
      ],
    },
  ];

  const element = useRoutes(routes); // Use the routes configuration with useRoutes

  return element; // This will render the matched route
};

export default RoutesComponent;
