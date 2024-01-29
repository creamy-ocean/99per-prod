import Certify from "@/pages/Certify";
import ErrorPage from "@/pages/ErrorPage";
import Friends from "@/pages/Friends";
import Guilds from "@/pages/Guilds";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import MyFriends from "@/pages/MyFriends";
import MyProfiles from "@/pages/MyProfiles";
import MyRequests from "@/pages/MyRequests";
import NewProfile from "@/pages/NewProfile";
import Parties from "@/pages/Parties";
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
        element: (
          <ProtectedRoute page={"home"}>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/join",
        element: (
          <ProtectedRoute page={"join"}>
            <Login />
          </ProtectedRoute>
        ),
      },
      {
        path: "/certify",
        element: (
          <ProtectedRoute page={"certify"}>
            <Certify />
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
      {
        path: "/myProfiles",
        element: (
          <ProtectedRoute>
            <MyProfiles />
          </ProtectedRoute>
        ),
      },
      {
        path: "/myRequests",
        element: (
          <ProtectedRoute>
            <MyRequests />
          </ProtectedRoute>
        ),
      },
      {
        path: "/myFriends",
        element: (
          <ProtectedRoute>
            <MyFriends />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
