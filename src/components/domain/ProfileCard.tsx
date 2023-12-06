import { Profile } from "@/types/types";
import { Box, Flex, Grid, Img, Tag, Text } from "@chakra-ui/react";

interface ProfileProps {
  profile: Profile;
}

const ProfileCard = ({ profile }: ProfileProps) => {
  const { image, style, interest, intro } = profile;

  return (
    <Grid
      templateColumns="1fr 5fr 0.5fr"
      border="1px solid #fff"
      borderRadius="base"
      p="2"
      gap="2"
    >
      <Flex justify="center" align="center" pos="relative">
        {image ? (
          <Img
            src={image}
            maxW="4rem"
            maxH="4rem"
            borderRadius="full"
            alt="프로필 목록에 있는 유저의 프로필 사진"
          />
        ) : (
          <Box>'_'</Box>
        )}
      </Flex>
      <Box fontSize="0.9rem" ml="2">
        {style.map((s: string, idx: number) => {
          return (
            <Tag key={idx} colorScheme="blue" mr="1" mt="0.5">
              {s}
            </Tag>
          );
        })}
        {interest.map((i: string, idx: number) => {
          return (
            <Tag key={idx} colorScheme="blue" mr="1" mt="0.5">
              {i}
            </Tag>
          );
        })}
        <Text mt="0.5">{intro}</Text>
      </Box>
      <Flex justify="center" align="center" color="grey">
        <i className="fa-solid fa-plus" style={{ cursor: "pointer" }}></i>
      </Flex>
    </Grid>
  );
};
export default ProfileCard;
