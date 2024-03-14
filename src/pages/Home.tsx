import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { IoArrowForwardOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import Typewriter from "typewriter-effect";
import Lottie from "lottie-react";
import homeAnimation from "@/animations/home_animation.json";

const Home = () => {
  const [isLargerThan320] = useMediaQuery("(min-width: 320px)");
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  return (
    <Flex
      h="100%"
      w="80vw"
      justify={{ sm: "center", md: "space-evenly" }}
      flexDir={{ sm: "column", md: "row" }}
    >
      <Flex
        direction="column"
        justify="center"
        alignItems="start"
        pl={{ sm: "2" }}
      >
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
                  .typeString("배그 삼쿼드")
                  .pauseFor(1500)
                  .deleteAll()
                  .typeString("옵치 6인팟")
                  .pauseFor(1500)
                  .deleteAll()
                  .typeString("넷맘 4인팟")
                  .pauseFor(1500)
                  .deleteAll()
                  .start();
              }}
              options={{ loop: true }}
            />
          </Box>
          <Text
            fontSize={{ sm: "4xl", md: "5xl" }}
            display="inline-block"
            position="absolute"
            top={{ sm: "-1.5", md: "-2" }}
            right={{ sm: "20", md: "3" }}
            letterSpacing="1px"
          >
            '9'해요
          </Text>
        </Heading>
        <Text variant="desc" fontSize="2xl" mt="8">
          나와 딱 맞는 친구를 찾아보세요
        </Text>
        <Link to="join">
          <Button rightIcon={<IoArrowForwardOutline />} mt="8">
            시작하기
          </Button>
        </Link>
      </Flex>
      <Flex direction="column" justify="center">
        <Lottie
          animationData={homeAnimation}
          style={
            isLargerThan768
              ? { maxWidth: "40rem" }
              : isLargerThan320
                ? { maxWidth: "25rem" }
                : { maxWidth: "15rem" }
          }
        />
      </Flex>
    </Flex>
  );
};
export default Home;
