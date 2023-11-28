import { getProfiles } from "@/database/firebase";
import { Profile } from "@/types/types";
import {
  Box,
  Divider,
  Flex,
  Grid,
  Heading,
  Img,
  Tag,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const Friends = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const fetchProfiles = async () => {
    const data = await getProfiles("friends");
    setProfiles(data);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <Flex
      backgroundColor="#fff"
      w="80%"
      maxW="40rem"
      p="2"
      mt="6"
      mb="6"
      direction="column"
      align="center"
      borderRadius="xl"
    >
      <Heading fontSize="3xl" color="#555" pt="6" pb="4">
        나와 잘 맞는 친구를 찾아보세요
      </Heading>
      <Divider w="80%" mt="4" mb="8" />
      <Grid gap="2" w="70%">
        {profiles.map(({ style, interest, image, intro, contact }, idx) => {
          return (
            <Grid
              templateColumns="1fr 4fr"
              border="1px solid #fff"
              borderRadius="base"
              p="2"
              gap="2"
              key={idx}
            >
              <Flex justify="center" align="center" pos="relative">
                {/* <Text
                  pos="absolute"
                  top="-0.5rem"
                  left="-1rem"
                  color="brand.50"
                  fontWeight="bold"
                  fontSize="1.5rem"
                >
                  #{idx + 1}
                </Text> */}
                {image ? (
                  <Img
                    src={image}
                    maxW="4rem"
                    maxH="4rem"
                    borderRadius="full"
                  />
                ) : (
                  <Box>'_'</Box>
                )}
              </Flex>
              <Box fontSize="0.9rem">
                <Tag colorScheme="blue">{style}</Tag>
                <Tag colorScheme="blue" ml="1">
                  {interest}
                </Tag>
                <Text>{intro}</Text>
                <Text textAlign="right" fontWeight="bold">
                  {contact}
                </Text>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Flex>
  );
};
export default Friends;
