import Certify from "@/pages/Certify";
import ErrorPage from "@/pages/ErrorPage";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Root from "@/pages/Root";
import { createBrowserRouter } from "react-router-dom";

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
        element: <Login />,
      },
      {
        path: "/certify",
        element: <Certify />,
      },
    ],
  },
]);

export default router;
