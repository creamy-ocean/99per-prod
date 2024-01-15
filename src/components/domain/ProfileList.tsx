import { useAuthContext } from "@/context/AuthContext";
import { getBlockedUsers, getProfiles } from "@/database/firebase";
import { Filters, Profile } from "@/types/types";
import { changeTabName } from "@/utils/functions";
import {
  Alert,
  AlertIcon,
  Divider,
  Flex,
  Grid,
  Heading,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ProfileCard from "./ProfileCard";
import ProfileFilter from "./ProfileFilter";

const ProfileList = ({ tab }: { tab: string }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filters, setFilters] = useState<Filters>({
    game: [],
    interest: [],
    style: [],
  });
  const [alert, setAlert] = useState<string>("");
  const [blockedUsers, setBlockedUsers] = useState<Array<string>>([]);
  const user = useAuthContext();

  if (!user) return;

  const fetchProfiles = async () => {
    const changedTabName = changeTabName(tab);
    setBlockedUsers(await getBlockedUsers(user.uid));
    const data = await getProfiles(changedTabName);
    setProfiles(data);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const checkFilters = () => {
    for (const filter in filters) {
      if (filters[filter].length != 0) return false;
    }
    return true;
  };

  const isFiltersEmpty = checkFilters();

  const checkIfProfileMatchesFilters = (profile: Profile) => {
    for (const filterName of Object.keys(filters)) {
      if (filters[filterName].length > 0) {
        const found = filters[filterName].every((filterValue) =>
          profile[filterName].includes(filterValue)
        );
        if (found === false) return false;
      }
    }
    return true;
  };

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
      <ProfileFilter tab={tab} filters={filters} setFilters={setFilters} />
      <Divider w="80%" mt="4" mb="8" />
      <Grid gap="2" w="80%">
        {isFiltersEmpty
          ? profiles.map((profile, idx) => {
              if (profile.userId === user?.uid) {
                return;
              } else if (blockedUsers.includes(profile.userId)) {
                return;
              } else {
                return (
                  <ProfileCard
                    key={idx}
                    profile={profile}
                    user={user}
                    tab={tab}
                    setAlert={setAlert}
                  />
                );
              }
            })
          : profiles.map((profile) => {
              const isProfileFiltered = checkIfProfileMatchesFilters(profile);
              if (profile.userId === user?.uid) {
                return;
              } else if (isProfileFiltered) {
                return (
                  <ProfileCard
                    profile={profile}
                    user={user}
                    tab={tab}
                    setAlert={setAlert}
                  />
                );
              } else {
                return;
              }
            })}
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
export default ProfileList;
