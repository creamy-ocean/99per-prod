import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";
import Typewriter from "typewriter-effect";

const Home = () => {
  return (
    <Flex
      h="100vh"
      justify="center"
      bgGradient="linear(brand.100 0%, brand.500 100%)"
    >
      <Flex h="100%" w="80vw" justify="space-evenly">
        <Flex direction="column" justify="center" alignItems="start">
          <Heading variant="logo" size="3xl" mb="4rem">
            99%
          </Heading>
          <Heading variant="typewriter" w="20.8rem" position="relative">
            <Box display="inline-block">
              <Typewriter
                onInit={(typewriter) => {
                  typewriter
                    .typeString(`다이아 봇듀`)
                    .pauseFor(1500)
                    .deleteAll()
                    .typeString("검마 먹자팟")
                    .pauseFor(1500)
                    .deleteAll()
                    .typeString("배그 삼쿼드")
                    .pauseFor(1500)
                    .deleteAll()
                    .typeString("옵치 6인팟")
                    .pauseFor(1500)
                    .deleteAll()
                    .start();
                }}
                options={{ loop: true }}
              />
            </Box>
            <Text
              fontSize="5xl"
              display="inline-block"
              position="absolute"
              top="-2"
              right="0"
            >
              '9'해요
            </Text>
          </Heading>
          <Text variant="desc" fontSize="2xl" mt="8">
            나와 딱 맞는 친구를 찾아보세요
          </Text>
        </Flex>
        <Flex direction="column" justify="center">
          <Image
            src="src/assets/iPhone_mockup.png"
            alt="99프로 사용 예시 이미지"
            w="36.5rem"
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
export default Home;
