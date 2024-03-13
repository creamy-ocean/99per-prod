import {
  addRequest,
  cancelRequest,
  getProfileId,
  getRequestId,
} from "@/database/firebase";
import { Profile, UserInterface } from "@/types/types";
import {
  Box,
  Button,
  Flex,
  Grid,
  Img,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Link } from "react-router-dom";

interface ProfileProps {
  profile: Profile;
  user: UserInterface;
  tab: string;
  setAlert: Dispatch<SetStateAction<string>>;
  isOwner?: boolean;
  isReceived?: boolean;
  isFriend?: boolean;
  isRelative?: boolean;
  approveRequest?: (
    requestId: string,
    profileId: string,
    friendUserId: string,
    tab: string,
    game: string
  ) => void;
  rejectRequest?: (requestId: string, profileId: string) => void;
  deleteProfile?: (id: string, game: string) => void;
  blockUser?: (
    tab: string,
    userId: string,
    bannedUserProfileId: string,
    bannedUserId: string
  ) => void;
  setProfiles?: Dispatch<SetStateAction<Profile[]>>;
}

const ProfileCard = ({
  profile,
  user,
  tab,
  setAlert,
  isOwner,
  isReceived,
  isFriend,
  isRelative,
  approveRequest,
  rejectRequest,
  deleteProfile,
  blockUser,
  setProfiles,
}: ProfileProps) => {
  const { id, userId, game, image, style, interest, intro } = profile;
  const [requestId, setRequestId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const msg = tab === "친구" ? "추가" : tab === "파티" ? "참여" : "가입";

  const { isOpen, onOpen, onClose } = useDisclosure();

  const setAlertMsg = (alertMsg: string) => {
    setAlert(alertMsg);
    setTimeout(() => {
      setAlert("");
    }, 5000);
  };

  const checkRequestId = async () => {
    const result = await getRequestId(user.uid, userId, tab, game);
    setRequestId(result);
    return result;
  };

  const onAddRequest = async () => {
    const _requestId = await checkRequestId();
    if (_requestId) {
      setAlertMsg(`이미 ${tab} ${msg} 요청을 보냈습니다`);
      return;
    }
    const senderUserProfileId = await getProfileId("friends", user.uid, game);
    if (senderUserProfileId) {
      const requestId = await addRequest(
        id,
        senderUserProfileId,
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
        return prev.filter((p) => p.id !== profile.id);
      });
  };

  const onDeleteProfile = () => {
    deleteProfile && deleteProfile(id, game);
    setAlertMsg("프로필이 삭제되었습니다");
    onClose();
  };

  const onApproveRequest = async () => {
    const _requestId = await getRequestId(userId, user.uid, tab, game);
    _requestId &&
      approveRequest &&
      approveRequest(_requestId, id, userId, tab, game);
    setAlertMsg(`${tab} ${msg} 요청을 수락했습니다`);
  };

  const onRejectRequest = async () => {
    const _requestId = await getRequestId(userId, user.uid, tab, game);
    _requestId && rejectRequest && rejectRequest(_requestId, id);
    setAlertMsg(`${tab} ${msg} 요청을 거절했습니다`);
  };

  const onBanUser = async () => {
    blockUser && blockUser(tab, user.uid, id, userId);
    setAlertMsg("해당 유저를 차단했습니다");
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
        <>
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
                  h="100%"
                  borderRadius="full"
                  alt="프로필 목록에 있는 유저의 프로필 사진"
                />
              ) : (
                <Box>'_'</Box>
              )}
            </Flex>
            <Box fontSize="0.9rem" ml="2">
              <Box>
                <Tag bgColor="#E6F2FD">{game}</Tag>
              </Box>
              {style.map((s: string, idx: number) => {
                return (
                  <Tag key={idx} colorScheme="blue" mr="1" mt="1">
                    {s}
                  </Tag>
                );
              })}
              {interest.map((i: string, idx: number) => {
                return (
                  <Tag key={idx} colorScheme="blue" mr="1" mt="1">
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
              {isRelative ? (
                <i
                  className="fa-solid fa-user-group"
                  style={{ cursor: "default" }}
                ></i>
              ) : isOwner ? (
                <>
                  <Link to="/newProfile" state={{ profile }}>
                    <i
                      className="fa-solid fa-pen-to-square"
                      style={{ marginRight: "1rem" }}
                    ></i>
                  </Link>
                  <i className="fa-solid fa-trash-can" onClick={onOpen}></i>
                  <Modal
                    closeOnOverlayClick={false}
                    isOpen={isOpen}
                    onClose={onClose}
                    isCentered
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>프로필을 삭제하시겠습니까?</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody pb={6}>
                        {`프로필 삭제 시 해당 프로필로 요청한/요청받은 친구, 파티, 길드
                        신청이 모두 취소${
                          tab === "친구"
                            ? `되며, 해당 프로필과 관련된 친구, 파티,
                          길드가 모두 삭제됩니다`
                            : "됩니다"
                        }`}
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          colorScheme="red"
                          mr={3}
                          onClick={onDeleteProfile}
                        >
                          삭제
                        </Button>
                        <Button onClick={onClose}>취소</Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </>
              ) : isFriend ? (
                <Tooltip
                  maxW="11rem"
                  label="차단하면 해당 유저에게 내가 보이지 않고 나에게 해당 유저가 보이지 않아요"
                  bg="#FF8A8D"
                  placement="top"
                >
                  <i
                    style={{ color: "#FF8A8D" }}
                    className="fa-solid fa-ban"
                    onClick={onBanUser}
                  ></i>
                </Tooltip>
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
          {isFriend && (
            <Flex
              fontSize="0.9rem"
              backgroundColor="#EDF2F7"
              p="1"
              justify="center"
              align="center"
              sx={{
                color: "#555",
                fontWeight: "bold",
              }}
            >
              {profile.contact}
              <CopyToClipboard
                onCopy={() => {
                  setAlertMsg("연락처를 복사했습니다");
                }}
                text={profile.contact}
              >
                <i
                  style={{ marginLeft: "0.5rem", cursor: "pointer" }}
                  className="fa-solid fa-copy"
                ></i>
              </CopyToClipboard>
            </Flex>
          )}
        </>
      )}
    </>
  );
};
export default ProfileCard;
