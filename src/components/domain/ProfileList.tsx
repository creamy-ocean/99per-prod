import { useAuthContext } from "@/context/AuthContext";
import { getProfiles } from "@/database/firebase";
import { Profile } from "@/types/types";
import { changeTabName } from "@/utils/functions";
import { Divider, Flex, Grid, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ProfileCard from "./ProfileCard";

const ProfileList = ({ tab }: { tab: string }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const user = useAuthContext();

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
        {profiles.map((profile) => {
          if (profile.userId === user?.uid) {
            return;
          } else {
            return <ProfileCard profile={profile} key={profile.userId} />;
          }
        })}
      </Grid>
    </Flex>
  );
};
export default ProfileList;
