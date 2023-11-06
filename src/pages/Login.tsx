import { login } from "@/database/firebase";
import { Card, Flex, Heading, Image, Text } from "@chakra-ui/react";

const Login = () => {
  return (
    <Flex
      justify="center"
      alignItems="center"
      h="100vh"
      bgGradient="linear(brand.100 0%, brand.500 100%)"
    >
      <Flex
        direction="column"
        justify="center"
        alignItems="center"
        w="30rem"
        h="25rem"
        backgroundColor="#E6F2FD"
        borderRadius="3xl"
        boxShadow="2xl"
      >
        <Heading size="xl">로그인</Heading>
        <Text fontSize="lg" mt="1rem">
          다음 계정으로 로그인 하세요
        </Text>
        <Card
          mt="2rem"
          w="11.5rem"
          p="0.7rem 0.5rem"
          cursor="pointer"
          onClick={() => login("google")}
        >
          <Flex alignItems="center">
            <Image ml="2" src="public/assets/google_logo.png" height="1.5rem" />
            <Text variant="google-login" ml="5">
              Google 로그인
            </Text>
          </Flex>
        </Card>
        {/* <Card mt="1rem" cursor="pointer">
          <Image src="public/assets/kakao_login.png" />
        </Card> */}
        <Card
          mt="1rem"
          w="11.5rem"
          p="0.7rem 0.5rem"
          cursor="pointer"
          backgroundColor="black"
          onClick={() => login("twitter")}
        >
          <Flex alignItems="center">
            <Image ml="2" src="public/assets/x_logo.png" height="1.2rem" />
            <Text color="white" variant="google-login" ml="7">
              X 로그인
            </Text>
          </Flex>
        </Card>
      </Flex>
    </Flex>
  );
};
export default Login;
