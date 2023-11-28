import ErrorPage from "@/pages/ErrorPage";
import Friends from "@/pages/Friends";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import NewProfile from "@/pages/NewProfile";
import Parties from "@/pages/Parties";
import Root from "@/pages/Root";
import Guilds from "@/pages/guilds";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/join",
        element: (
          <ProtectedRoute certRequired>
            <Login />
          </ProtectedRoute>
        ),
      },
      {
        path: "/friends",
        element: (
          <ProtectedRoute>
            <Friends />
          </ProtectedRoute>
        ),
      },
      {
        path: "/guilds",
        element: (
          <ProtectedRoute>
            <Guilds />
          </ProtectedRoute>
        ),
      },
      {
        path: "/parties",
        element: (
          <ProtectedRoute>
            <Parties />
          </ProtectedRoute>
        ),
      },
      {
        path: "/newProfile",
        element: (
          <ProtectedRoute>
            <NewProfile />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
