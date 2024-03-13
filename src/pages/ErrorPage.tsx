import { Flex, Heading } from "@chakra-ui/react";
import Lottie from "lottie-react";
import errorAnimation from "@/animations/error_animation.json";

const ErrorPage = () => {
  return (
    <Flex flexDir="column" justify="center" h="100vh" bg="brand.100">
      <Heading textAlign="center" color="#444">
        오류가 발생했습니다
        <br />
        다시 시도해주세요
      </Heading>
      <Flex justify="center">
        <Lottie animationData={errorAnimation} style={{ maxWidth: "40rem" }} />
      </Flex>
    </Flex>
  );
};
export default ErrorPage;
