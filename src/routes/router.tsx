import Certify from "@/pages/Certify";
import ErrorPage from "@/pages/ErrorPage";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Root from "@/pages/Root";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/join",
        element: (
          <ProtectedRoute certRequired>
            <Login />
          </ProtectedRoute>
        ),
      },
      {
        path: "/certify",
        element: <Certify />,
      },
    ],
  },
]);

export default router;
