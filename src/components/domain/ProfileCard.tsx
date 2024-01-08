import {
  addRequest,
  cancelRequest,
  getProfileId,
  getRequestId,
} from "@/database/firebase";
import { Profile, UserInterface } from "@/types/types";
import { Box, Flex, Grid, Img, Tag, Text, Tooltip } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface ProfileProps {
  profile: Profile;
  user: UserInterface | null;
  tab: string;
  setAlert: Dispatch<SetStateAction<string>>;
  isOwner?: boolean;
  isReceived?: boolean;
  approveRequest?: (requestId: string, profileId: string, tab: string) => void;
  rejectRequest?: (requestId: string, profileId: string) => void;
  deleteProfile?: (id: string) => void;
  setProfiles?: Dispatch<SetStateAction<Profile[]>>;
}

const ProfileCard = ({
  profile,
  user,
  tab,
  setAlert,
  isOwner,
  isReceived,
  approveRequest,
  rejectRequest,
  deleteProfile,
  setProfiles,
}: ProfileProps) => {
  if (!user?.uid) return;

  const { id, userId, game, image, style, interest, intro } = profile;
  const [requestId, setRequestId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const msg = tab === "친구" ? "추가" : tab === "파티" ? "참여" : "가입";

  const setAlertMsg = (alertMsg: string) => {
    setAlert(alertMsg);
    setTimeout(() => {
      setAlert("");
    }, 5000);
  };

  const checkRequestId = async () => {
    const result = await getRequestId(user.uid, userId, tab, game);
    setRequestId(result);
  };

  const onAddRequest = async () => {
    const profileId = await getProfileId(user.uid, game);
    if (profileId) {
      const requestId = await addRequest(
        profileId,
        user.uid,
        userId,
        tab,
        game
      );
      setRequestId(requestId);
      setAlertMsg(`${tab} ${msg} 요청을 보냈습니다`);
    } else {
      setAlertMsg(`${game} 친구 프로필을 먼저 등록해주세요`);
    }
  };

  const onCancelRequest = async () => {
    if (!requestId) return;
    cancelRequest(requestId);
    setAlertMsg(`${tab} ${msg} 요청이 취소되었습니다`);
    setRequestId(null);
    setProfiles &&
      setProfiles((prev) => {
        return prev.filter((p) => {
          p.id !== profile.id;
        });
      });
  };

  const onDeleteProfile = () => {
    deleteProfile && deleteProfile(id);
    setAlertMsg("프로필이 삭제되었습니다");
  };

  const onApproveRequest = async () => {
    const _requestId = await getRequestId(userId, user.uid, tab, game);
    _requestId && approveRequest && approveRequest(_requestId, id, tab);
    setAlertMsg(`${tab} ${msg} 요청을 수락했습니다`);
  };

  const onRejectRequest = async () => {
    const _requestId = await getRequestId(userId, user.uid, tab, game);
    _requestId && rejectRequest && rejectRequest(_requestId, id);
    setAlertMsg(`${tab} ${msg} 요청을 거절했습니다`);
  };

  useEffect(() => {
    setLoading(true);
    checkRequestId();
    setLoading(false);
  }, [profile]);

  return (
    <>
      {loading ? (
        <></>
      ) : (
        <Grid
          templateColumns="1fr 5fr 0.8fr"
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
            color="#999"
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
                <i
                  className="fa-solid fa-trash-can"
                  onClick={onDeleteProfile}
                ></i>
              </>
            ) : isReceived ? (
              <Box
                sx={{
                  i: {
                    color: "#7EB0F2",
                    fontSize: "1.2em",
                    marginRight: "0.3rem",
                  },
                }}
              >
                <Tooltip label="요청 수락" bg="#5096F2" placement="top">
                  <i
                    className="fa-solid fa-circle-check"
                    onClick={onApproveRequest}
                  ></i>
                </Tooltip>
                <Tooltip label="요청 거절" bg="#5096F2" placement="top">
                  <i
                    className="fa-solid fa-circle-xmark"
                    onClick={onRejectRequest}
                  ></i>
                </Tooltip>
              </Box>
            ) : requestId ? (
              <i
                className="fa-solid fa-user-minus"
                style={{ color: "#7EB0F2" }}
                onClick={onCancelRequest}
              ></i>
            ) : (
              <i className="fa-solid fa-user-plus" onClick={onAddRequest}></i>
            )}
          </Flex>
        </Grid>
      )}
    </>
  );
};
export default ProfileCard;
