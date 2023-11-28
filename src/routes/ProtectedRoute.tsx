import { useAuthContext } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  certRequired?: boolean;
}

const ProtectedRoute = ({ children, certRequired }: Props) => {
  const user = useAuthContext();

  console.log(user);

  if (certRequired) {
    if (!user) {
      return children;
    } else {
      return <Navigate to="/friends" replace={true} />;
    }
  } else {
    return children;
  }
};

export default ProtectedRoute;
