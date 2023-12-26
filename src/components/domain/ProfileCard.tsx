import {
  addRequest,
  cancelRequest,
  checkIfProfileExists,
  getRequestId,
} from "@/database/firebase";
import { Profile, UserInterface } from "@/types/types";
import { Box, Flex, Grid, Img, Tag, Text } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface ProfileProps {
  profile: Profile;
  user: UserInterface | null;
  tab: string;
  setAlert: Dispatch<SetStateAction<string>>;
  isOwner?: boolean;
  deleteProfile?: (id: string) => void;
}

const ProfileCard = ({
  profile,
  user,
  tab,
  setAlert,
  isOwner,
  deleteProfile,
}: ProfileProps) => {
  if (!user?.uid) return;

  const { id, userId, game, image, style, interest, intro } = profile;
  const [requested, setRequested] = useState<string | null>(null);

  const msg = tab === "친구" ? "추가" : tab === "파티" ? "참여" : "가입";

  const setAlertMsg = (alertMsg: string) => {
    setAlert(alertMsg);
    setTimeout(() => {
      setAlert("");
    }, 5000);
  };

  const checkRequested = async () => {
    const result = await getRequestId(user.uid, userId, tab, game);
    setRequested(result);
  };

  const onAddRequest = async () => {
    const isProfileExists = await checkIfProfileExists(user.uid, game);
    if (isProfileExists) {
      const requestId = await addRequest(user.uid, userId, tab, game);
      setRequested(requestId);
      setAlertMsg(`${tab} ${msg} 요청을 보냈습니다`);
    } else {
      setAlertMsg(`${game} 친구 프로필을 먼저 등록해주세요`);
    }
  };

  const onCancelRequest = async () => {
    if (!requested) return;
    cancelRequest(requested);
    setAlertMsg(`${tab} ${msg} 요청이 취소되었습니다`);
    setRequested(null);
  };

  const onDeleteProfile = () => {
    deleteProfile && deleteProfile(id);
    setAlertMsg("프로필이 삭제되었습니다");
  };

  useEffect(() => {
    checkRequested();
  }, []);

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
      <Flex
        justify="center"
        align="center"
        color="grey"
        sx={{ i: { cursor: "pointer" } }}
      >
        {isOwner ? (
          <>
            <Link to="/newProfile" state={{ profile }}>
              <i
                className="fa-solid fa-pen-to-square"
                style={{ marginRight: "1rem" }}
              ></i>
            </Link>
            <i className="fa-solid fa-trash-can" onClick={onDeleteProfile}></i>
          </>
        ) : requested ? (
          <i className="fa-solid fa-check" onClick={onCancelRequest}></i>
        ) : (
          <i className="fa-solid fa-plus" onClick={onAddRequest}></i>
        )}
      </Flex>
    </Grid>
  );
};
export default ProfileCard;
