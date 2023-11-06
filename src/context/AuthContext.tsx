import { onUserStateChanged } from "@/database/firebase";
import { User } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";

interface UserInterface extends User {
  userState: string | null;
}

const AuthContext = React.createContext<UserInterface | null>(null);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<UserInterface | null>(null);

  useEffect(() => {
    onUserStateChanged((user: UserInterface | null) => {
      setUser(user);
    });
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
