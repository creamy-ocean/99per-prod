import { useAuthContext } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  certRequired?: boolean;
}

const ProtectedRoute = ({ children, certRequired }: Props) => {
  const user = useAuthContext();
  const userState = user?.userState;

  if (certRequired) {
    if (!user) {
      console.log("No user found");
      return children;
    } else {
      return userState ? (
        user.userState === "joined" ? (
          <Navigate to="/certify" replace={true} />
        ) : (
          <Navigate to="/" replace={true} />
        )
      ) : (
        children
      );
    }
  } else {
    console.log("No certRequired");
    return user ? <Navigate to="/" replace={true} /> : children;
  }
};

export default ProtectedRoute;
