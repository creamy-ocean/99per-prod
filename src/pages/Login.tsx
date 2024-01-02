import { anonymousLogin, login } from "@/database/firebase";
import { Card, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { useState } from "react";

const Login = () => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
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
      {loading ? (
        <Heading textAlign="center">로딩 중...</Heading>
      ) : (
        <>
          <Heading size="xl">로그인</Heading>
          <Text fontSize="lg" mt="1rem">
            다음 계정으로 로그인 하세요
          </Text>
          <Card
            mt="2rem"
            w="11.5rem"
            p="0.7rem 0.5rem"
            cursor="pointer"
            onClick={() => {
              setLoading(true);
              login("google", () => setLoading(false));
            }}
          >
            <Flex alignItems="center">
              <Image ml="2" src="/assets/google_logo.png" height="1.5rem" />
              <Text variant="google-login" ml="5">
                Google 로그인
              </Text>
            </Flex>
          </Card>
          <Card
            mt="1rem"
            w="11.5rem"
            p="0.7rem 0.5rem"
            cursor="pointer"
            backgroundColor="black"
            onClick={() => {
              setLoading(true);
              login("twitter", () => setLoading(false));
            }}
          >
            <Flex alignItems="center">
              <Image ml="2" src="/assets/x_logo.png" height="1.2rem" />
              <Text color="white" variant="google-login" ml="7">
                X 로그인
              </Text>
            </Flex>
          </Card>
          <Card
            mt="1rem"
            w="11.5rem"
            p="0.7rem 0.5rem"
            cursor="pointer"
            background="brand.500"
            onClick={() => {
              setLoading(true);
              anonymousLogin(() => setLoading(false));
            }}
          >
            <Flex alignItems="center" justify="center">
              <Text color="white" variant="google-login">
                익명 로그인
              </Text>
            </Flex>
          </Card>
        </>
      )}
    </Flex>
  );
};
export default Login;
