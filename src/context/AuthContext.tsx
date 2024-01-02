import { onUserStateChanged } from "@/database/firebase";
import { UserInterface } from "@/types/types";
import { Flex, Heading } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";

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
          justify="center"
          align="center"
          backgroundColor="#E6F2FD"
        >
          <Heading color="#666">로딩 중...</Heading>
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
