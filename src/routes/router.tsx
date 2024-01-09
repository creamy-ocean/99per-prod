import Certify from "@/pages/Certify";
import ErrorPage from "@/pages/ErrorPage";
import Friends from "@/pages/Friends";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import MyFriends from "@/pages/MyFriends";
import MyProfiles from "@/pages/MyProfiles";
import MyRequests from "@/pages/MyRequests";
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
      { path: "/certify", element: <Certify /> },
      { path: "/friends", element: <Friends /> },
      { path: "/guilds", element: <Guilds /> },
      { path: "/parties", element: <Parties /> },
      { path: "/newProfile", element: <NewProfile /> },
      { path: "/myProfiles", element: <MyProfiles /> },
      { path: "/myRequests", element: <MyRequests /> },
      { path: "/myFriends", element: <MyFriends /> },
    ],
  },
]);

export default router;
