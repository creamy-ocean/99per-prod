import { onUserStateChanged } from "@/database/firebase";
import { UserInterface } from "@/types/types";
import { Flex } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";

const AuthContext = React.createContext<UserInterface | null>(null);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserInterface | null>(null);

  useEffect(() => {
    onUserStateChanged((user: UserInterface | null) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={user}>
      {loading ? (
        <Flex
          w="100vw"
          h="100vh"
          maxW="100%"
          justify="center"
          align="center"
          backgroundColor="#E6F2FD"
        >
          <SyncLoader
            color={"#7EB0F2"}
            size={20}
            style={{ position: "absolute" }}
          />
        </Flex>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
