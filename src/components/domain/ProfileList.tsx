import { useAuthContext } from "@/context/AuthContext";
import {
  getBlockedUsers,
  getProfiles,
  getRelativeProfileIds,
} from "@/database/firebase";
import { Filters, Profile } from "@/types/types";
import { changeTabName, isArrayEmpty } from "@/utils/functions";
import {
  Alert,
  AlertIcon,
  Divider,
  Flex,
  Grid,
  Heading,
  Text,
} from "@chakra-ui/react";
import { Timestamp } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import ProfileCard from "./ProfileCard";
import ProfileFilter from "./ProfileFilter";

const ProfileList = ({ tab }: { tab: string }) => {
  const user = useAuthContext();

  if (!user) return;

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filters, setFilters] = useState<Filters>({
    game: [],
    interest: [],
    style: [],
  });
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [alert, setAlert] = useState<string>("");
  const [blockedUsers, setBlockedUsers] = useState<Array<string>>([]);
  const [relativeProfileIds, setRelativeProfileIds] = useState<Array<string>>(
    []
  );
  const [hasMore, setHasMore] = useState(true);

  const profileLimit = 6;
  const bottom = useRef(null);
  const changedTabName = changeTabName(tab);
  const lastProfileCreatedAt =
    profiles.length > 0 ? profiles[profiles.length - 1].createdAt : null;

  const onIntersection = async (
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) => {
    const entry = entries[0];
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      fetchProfiles();
    }
  };

  const fetchProfiles = async () => {
    console.log(lastProfileCreatedAt);
    try {
      const profilesData = await getProfiles(
        false,
        changedTabName,
        user.uid,
        lastProfileCreatedAt as Timestamp
      );
      profilesData.length < profileLimit && setHasMore(false);
      setProfiles((prevProfiles) => [...prevProfiles, ...profilesData]);
    } catch (err) {
      console.log(err);
      setAlert("프로필을 불러오는 중 오류가 발생했습니다");
    }
  };

  const preset = async () => {
    setBlockedUsers(await getBlockedUsers(user.uid));
    setRelativeProfileIds(
      await getRelativeProfileIds(changedTabName, user.uid)
    );
    fetchProfiles();
  };

  useEffect(() => {
    preset();
  }, []);

  useEffect(() => {
    if (profiles.length < 1) return;
    const observer = new IntersectionObserver(onIntersection, { threshold: 1 });
    if (observer && bottom.current) observer.observe(bottom.current);

    return () => {
      observer && observer.disconnect();
    };
  }, [profiles]);

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
        const found = filters[filterName].every((filterValue) => {
          profile[filterName].includes(filterValue);
        });
        if (found === false) return false;
      }
    }
    return true;
  };

  useEffect(() => {
    setFilteredProfiles(profiles.filter(checkIfProfileMatchesFilters));
  }, [filters]);

  return (
    <Flex
      backgroundColor="#fff"
      w="80%"
      maxW="40rem"
      p="2"
      pb="6"
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
        {isFiltersEmpty ? (
          isArrayEmpty(profiles) ? (
            <Text textAlign="center">프로필이 없습니다</Text>
          ) : (
            profiles.map((profile, idx) => {
              if (blockedUsers.includes(profile.userId)) {
                return;
              } else {
                return (
                  <ProfileCard
                    key={idx}
                    profile={profile}
                    user={user}
                    tab={tab}
                    isRelative={relativeProfileIds.includes(profile.id)}
                    setAlert={setAlert}
                  />
                );
              }
            })
          )
        ) : isArrayEmpty(filteredProfiles) ? (
          <Text textAlign="center">해당하는 프로필이 없습니다</Text>
        ) : (
          filteredProfiles.map((profile, idx) => {
            return (
              <ProfileCard
                key={idx}
                profile={profile}
                user={user}
                tab={tab}
                setAlert={setAlert}
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
      {hasMore && <div ref={bottom}></div>}
    </Flex>
  );
};
export default ProfileList;
