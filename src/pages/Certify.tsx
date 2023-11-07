import { Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Certify = () => {
  return (
    <Flex
      direction="column"
      alignItems="center"
      backgroundColor="#E6F2FD"
      borderRadius="3xl"
      boxShadow="2xl"
      px="20"
      py="4"
    >
      <Heading mt="12">여성 인증</Heading>
      <Text mt="4">99%는 여성만 이용 가능한 서비스로,</Text>
      <Text>여성 인증 후 이용 가능합니다</Text>
      <Text mb="8">(인증 완료까지 최대 24시간 소요)</Text>
      <Divider />
      <Text p="8" color="brand.500" decoration="underline">
        <Link to="https://forms.gle/dwNojWQJbd312Lqp8">
          ✨ 여성 인증 링크 ✨
        </Link>
      </Text>
    </Flex>
  );
};
export default Certify;
