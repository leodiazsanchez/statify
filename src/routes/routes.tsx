import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../providers/authProvider";
import { ProtectedRoute } from "./protectedRoute";
import Home from "../pages/home";
import NotFound from "../pages/notFound";
import Artists from "../pages/artists";
import Tracks from "../pages/tracks";
import Recommendations from "../pages/recommendations";
import Charts from "../pages/charts";
import Layout from "../components/layout"; // Import the layout component

const Routes = () => {
  const { token } = useAuth();

  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: "/",
      element: <Layout />, // Wrap in Layout
      children: [
        { path: "/", element: <Home /> },
        { path: "*", element: <NotFound /> },
        { path: "/not-authorized", element: <p>No auth</p> },
      ],
    },
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />, // ProtectedRoute handles auth check
      children: [
        {
          path: "/",
          element: <Layout />, // Wrap in Layout
          children: [
            { path: "artists", element: <Artists /> },
            { path: "tracks", element: <Tracks /> },
            { path: "recommendations", element: <Recommendations /> },
            { path: "charts/:page", element: <Charts /> },
          ],
        },
      ],
    },
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...(token ? routesForAuthenticatedOnly : []),
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;
