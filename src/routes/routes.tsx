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
          element: <PrivateRoute element={<Artists />} />,
        },
        {
          path: "tracks",
          element: <PrivateRoute element={<Tracks />} />,
        },
        {
          path: "recommendations",
          element: <PrivateRoute element={<Recommendations />} />,
        },
        {
          path: "genres",
          element: <PrivateRoute element={<Genres />} />,
        },
      ],
    },
  ];

  const element = useRoutes(routes);

  return element;
};

export default RoutesComponent;
