import { useAuthContext } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  page?: string;
}

const ProtectedRoute = ({ children, page }: Props) => {
  const user = useAuthContext();
  const userState = user?.userState;

  switch (page) {
    case "join":
      return userState ? (
        user.userState === "joined" ? (
          <Navigate to="/certify" replace={true} />
        ) : (
          <Navigate to="/friends" replace={true} />
        )
      ) : (
        children
      );
    case "certify":
      return userState ? (
        user.userState === "certified" ? (
          <Navigate to="/friends" replace={true} />
        ) : (
          children
        )
      ) : (
        <Navigate to="/" replace={true} />
      );
    case "home":
      return userState === "certified" ? (
        <Navigate to="/friends" replace={true} />
      ) : (
        children
      );
    default:
      return userState ? children : <Navigate to="/" replace={true} />;
  }
};

export default ProtectedRoute;
