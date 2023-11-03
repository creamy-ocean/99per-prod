import { Card, Flex, Heading, Image, Text } from "@chakra-ui/react";

const Join = () => {
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
        <Card mt="2rem" w="11.5rem" p="0.7rem 0.5rem" cursor="pointer">
          <Flex alignItems="center">
            <Image ml="2" src="public/assets/google_logo.png" height="1.5rem" />
            <Text variant="google-login" ml="5">
              Google 로그인
            </Text>
          </Flex>
        </Card>
        <Card mt="1rem" cursor="pointer">
          <Image src="public/assets/kakao_login.png" />
        </Card>
        <Card
          mt="1rem"
          w="11.5rem"
          p="0.7rem 0.5rem"
          cursor="pointer"
          backgroundColor="black"
        >
          <Flex alignItems="center">
            <Image ml="2" src="public/assets/x_logo.png" height="1.2rem" />
            <Text color="white" variant="google-login" ml="7">
              X 로그인
            </Text>
          </Flex>
        </Card>
        {/* <Card
          mt="1rem"
          w="15rem"
          p="0.5rem"
          backgroundColor="black"
          cursor="pointer"
        >
          <Flex alignItems="center">
            <Image ml="3" src="public/assets/x_logo.png" height="1.2rem" />
            <Text ml="5" color="white">
              X 계정으로 로그인
            </Text>
          </Flex>
        </Card>
        <Card
          mt="1rem"
          w="15rem"
          p="0.5rem"
          backgroundColor="#FDDC3F"
          cursor="pointer"
        >
          <Flex>
            <Image ml="2" src="public/assets/kakao_login.png" width="1.5rem" />
            <Text ml="4">카카오 계정으로 로그인</Text>
          </Flex>
        </Card>  */}
      </Flex>
    </Flex>
  );
};
export default Join;
