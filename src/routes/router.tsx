import ErrorPage from "@/pages/ErrorPage";
import Home from "@/pages/Home";
import Join from "@/pages/Join";
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
        element: <Join />,
      },
    ],
  },
]);

export default router;
