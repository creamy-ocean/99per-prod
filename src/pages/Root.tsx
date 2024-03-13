import { useAuthContext } from "@/context/AuthContext";
import { Flex } from "@chakra-ui/react";
import Header from "@components/common/Header";
import { Outlet } from "react-router-dom";
import ErrorPage from "./ErrorPage";

const Root = () => {
  const user = useAuthContext();

  if (!user) return <ErrorPage />;

  return (
    <>
      {user.userState === "certified" ? (
        <Flex direction="column" h="100vh">
          <Header user={user} />
          <Flex flex="1" backgroundColor="#E6F2FD" justify="center">
            <Outlet context={{ ...user }} />
          </Flex>
        </Flex>
      ) : (
        <>
          <Flex
            justify="center"
            alignItems="center"
            h="100vh"
            bgGradient="linear(brand.100 0%, brand.500 100%)"
          >
            <Outlet context={{ ...user }} />
          </Flex>
        </>
      )}
    </>
  );
};
export default Root;
