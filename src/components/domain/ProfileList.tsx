import { useAuthContext } from "@/context/AuthContext";
import { getProfiles } from "@/database/firebase";
import { Filters, Profile } from "@/types/types";
import { changeTabName } from "@/utils/functions";
import { Divider, Flex, Grid, Heading } from "@chakra-ui/react";
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
  const user = useAuthContext();

  const fetchProfiles = async (filters: object) => {
    const changedTabName = changeTabName(tab);
    const data = await getProfiles(changedTabName, filters);
    setProfiles(data);
  };

  useEffect(() => {
    fetchProfiles(filters);
  }, [filters]);

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
        return found;
      }
    }
  };

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
        return found;
      }
    }
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
              } else {
                return <ProfileCard profile={profile} key={idx} />;
              }
            })
          : profiles.map((profile) => {
              const isProfileFiltered = checkIfProfileMatchesFilters(profile);
              if (profile.userId === user?.uid) {
                return;
              } else if (isProfileFiltered) {
                return <ProfileCard profile={profile}></ProfileCard>;
              } else {
                return;
              }
            })}
      </Grid>
    </Flex>
  );
};
export default ProfileList;
