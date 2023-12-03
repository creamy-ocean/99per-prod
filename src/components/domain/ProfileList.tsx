import { getProfiles } from "@/database/firebase";
import { Profile } from "@/types/types";
import { changeTabName } from "@/utils/utilFunctions";
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

const ProfileList = ({ tab }: { tab: string }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const fetchProfiles = async () => {
    const changedTabName = changeTabName(tab);
    const data = await getProfiles(changedTabName);
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
        나와 잘 맞는 {tab}를 찾아보세요
      </Heading>
      <Divider w="80%" mt="4" mb="8" />
      <Grid gap="2" w="80%">
        {profiles.map(({ style, interest, image, intro }, idx) => {
          return (
            <Grid
              templateColumns="1fr 5fr 0.5fr"
              border="1px solid #fff"
              borderRadius="base"
              p="2"
              gap="2"
              key={idx}
            >
              <Flex justify="center" align="center" pos="relative">
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
              <Box fontSize="0.9rem" ml="2">
                {style.map((s, idx) => {
                  return (
                    <Tag key={idx} colorScheme="blue" mr="1" mt="0.5">
                      {s}
                    </Tag>
                  );
                })}
                {interest.map((i, idx) => {
                  return (
                    <Tag key={idx} colorScheme="blue" mr="1" mt="0.5">
                      {i}
                    </Tag>
                  );
                })}
                <Text mt="0.5">{intro}</Text>
              </Box>
              <Flex justify="center" align="center" color="grey">
                <i
                  className="fa-solid fa-plus"
                  style={{ cursor: "pointer" }}
                ></i>
              </Flex>
            </Grid>
          );
        })}
      </Grid>
    </Flex>
  );
};
export default ProfileList;
