import { addRequest, checkIfProfileExists } from "@/database/firebase";
import { Profile, UserInterface } from "@/types/types";
import { Box, Flex, Grid, Img, Tag, Text } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

interface ProfileProps {
  profile: Profile;
  user: UserInterface | null;
  tab: string;
  setAlert: Dispatch<SetStateAction<string>>;
}

const ProfileCard = ({ profile, user, tab, setAlert }: ProfileProps) => {
  const { userId, game, image, style, interest, intro } = profile;

  const onAddRequest = async () => {
    if (!user?.uid) return;
    const isProfileExists = await checkIfProfileExists(user.uid, game);
    if (isProfileExists) {
      addRequest(user.uid, userId, tab, game);
      const msg = tab === "친구" ? "추가" : tab === "파티" ? "참여" : "가입";
      setAlert(`${tab} ${msg} 요청을 보냈습니다`);
      setTimeout(() => {
        setAlert("");
      }, 5000);
    } else {
      setAlert(`${game} 친구 프로필을 먼저 등록해주세요`);
      setTimeout(() => {
        setAlert("");
      }, 5000);
    }
  };

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
        <i
          className="fa-solid fa-plus"
          style={{ cursor: "pointer" }}
          onClick={onAddRequest}
        ></i>
      </Flex>
    </Grid>
  );
};
export default ProfileCard;
