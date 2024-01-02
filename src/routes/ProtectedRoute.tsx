import { useAuthContext } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  page?: string;
}

const ProtectedRoute = ({ children, page }: Props) => {
  const user = useAuthContext();
  const userState = user?.userState;

  if (page === "join") {
    return userState ? (
      user.userState === "joined" ? (
        <Navigate to="/certify" replace={true} />
      ) : (
        <Navigate to="/friends" replace={true} />
      )
    ) : (
      children
    );
  } else if (page === "certify") {
    return userState ? (
      user.userState === "certified" ? (
        <Navigate to="/friends" replace={true} />
      ) : (
        children
      )
    ) : (
      <Navigate to="/" replace={true} />
    );
  } else {
    return userState ? children : <Navigate to="/" replace={true} />;
  }
};

export default ProtectedRoute;
