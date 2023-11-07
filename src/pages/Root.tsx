import { useAuthContext } from "@/context/AuthContext";
import { Flex } from "@chakra-ui/react";
import Header from "@components/common/Header";
import { Outlet } from "react-router-dom";

const Root = () => {
  const user = useAuthContext();
  return (
    <>
      {user?.userState === "certified" ? (
        <>
          <Header />
          <Outlet />
        </>
      ) : (
        <>
          <Flex
            justify="center"
            alignItems="center"
            h="100vh"
            bgGradient="linear(brand.100 0%, brand.500 100%)"
          >
            <Outlet />
          </Flex>
        </>
      )}
    </>
  );
};
export default Root;
