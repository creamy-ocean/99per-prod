import { useAuthContext } from "@/context/AuthContext";
import {
  blockUser,
  deleteProfile,
  getProfilesFromRelationships,
} from "@/database/firebase";
import { Profile } from "@/types/types";
import { changeTabName, isArrayEmpty } from "@/utils/functions";
import {
  Alert,
  AlertIcon,
  Divider,
  Flex,
  Grid,
  Heading,
  Tab,
  TabList,
  Tabs,
  Text,
} from "@chakra-ui/react";
import ProfileCard from "@components/domain/ProfileCard";
import { useEffect, useState } from "react";

const MyFriends = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currTab, setCurrTab] = useState<string>("친구");
  const [alert, setAlert] = useState<string>("");
  const user = useAuthContext();

  if (!user) return;

  const fetchProfiles = async () => {
    const changedTabName = changeTabName(currTab);
    const data = await getProfilesFromRelationships(
      changedTabName,
      "relationships",
      user.uid
    );
    setProfiles(data);
  };

  const changeTab = (e: React.MouseEvent<HTMLButtonElement>) => {
    const eventTarget = e.target as HTMLButtonElement;
    setCurrTab(eventTarget.innerText);
  };

  const onDeleteProfile = (profileId: string, game: string) => {
    deleteProfile(profileId, currTab, game, user?.uid);
    setProfiles(
      profiles.filter((profile) => {
        return profile.id !== profileId;
      })
    );
  };

  const onBlockUser = async (
    tab: string,
    userId: string,
    blockedUserProfileId: string,
    blockedUserId: string
  ) => {
    await blockUser(
      changeTabName(tab),
      userId,
      blockedUserProfileId,
      blockedUserId
    );
    setProfiles(
      profiles.filter((profile) => profile.id !== blockedUserProfileId)
    );
  };

  useEffect(() => {
    fetchProfiles();
  }, [currTab]);

  return (
    <Flex
      backgroundColor="#fff"
      w="80%"
      maxW="40rem"
      p="2"
      mt="6"
      mb="6"
      pb="6"
      direction="column"
      align="center"
      borderRadius="xl"
    >
      <Heading fontSize="3xl" color="#555" pt="6" pb="4">
        내 친구/파티/길드
      </Heading>
      <Divider w="80%" mt="4" mb="8" />
      <Tabs variant="soft-rounded" colorScheme="blue" mb="8" align="center">
        <TabList>
          <Tab onClick={changeTab}>친구</Tab>
          <Tab onClick={changeTab}>파티</Tab>
          <Tab onClick={changeTab}>길드</Tab>
        </TabList>
      </Tabs>
      <Grid gap="2" w="80%">
        {isArrayEmpty(profiles) ? (
          <Text textAlign="center">프로필이 존재하지 않습니다</Text>
        ) : (
          profiles.map((profile, idx) => {
            return (
              <ProfileCard
                key={idx}
                profile={profile}
                user={user}
                tab={currTab}
                setAlert={setAlert}
                isFriend={true}
                deleteProfile={onDeleteProfile}
                blockUser={onBlockUser}
              />
            );
          })
        )}
      </Grid>
      {alert && (
        <Alert
          status="info"
          mt="6"
          borderRadius="lg"
          color="brand.500"
          fontWeight="bold"
          style={{
            width: "50%",
            maxWidth: "30rem",
            position: "fixed",
            bottom: "5%",
          }}
        >
          <AlertIcon />
          {alert}
        </Alert>
      )}
    </Flex>
  );
};
export default MyFriends;
