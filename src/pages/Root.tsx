import { Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

const Root = () => {
  return (
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
  );
};
export default Root;
