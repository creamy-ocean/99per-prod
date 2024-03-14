import { getBlockedUsers, getRelativeProfileIds } from "@/database/firebase";
import { Filters, UserInterface } from "@/types/types";
import { changeTabName } from "@/utils/functions";
import {
  Alert,
  AlertIcon,
  Divider,
  Flex,
  Grid,
  Heading,
  Text,
} from "@chakra-ui/react";
import { DocumentData } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import ProfileFilter from "./ProfileFilter";
import { useOutletContext } from "react-router-dom";
import { MoonLoader } from "react-spinners";
import ProfileCard from "./ProfileCard";
import useProfilesInfiniteQuery from "@/hooks/useProfilesInfiniteQuery";

const ProfileList = ({ tab }: { tab: string }) => {
  const user = useOutletContext<UserInterface>();

  const [filters, setFilters] = useState<Filters>({
    game: [],
    interest: [],
    style: [],
  });
  const [alert, setAlert] = useState<string>("");
  const [blockedUsers, setBlockedUsers] = useState<Array<string>>([]);
  const [relativeProfileIds, setRelativeProfileIds] = useState<Array<string>>(
    []
  );
  const bottom = useRef(null);
  const changedTabName = changeTabName(tab);

  const checkFilters = () => {
    for (const filter in filters) {
      if (filters[filter].length != 0) return false;
    }
    return true;
  };

  const isFiltersEmpty = checkFilters();

  const checkIfDocumentMatchesFilters = (doc: DocumentData) => {
    for (const filterName of Object.keys(filters)) {
      if (filters[filterName].length > 0) {
        const found = filters[filterName].every((filterValue) =>
          doc[filterName].includes(filterValue)
        );
        if (found === false) return false;
      }
    }
    return true;
  };

  const { data, isError, isLoading, hasNextPage, fetchNextPage } =
    useProfilesInfiniteQuery(
      false,
      tab,
      user.uid,
      isFiltersEmpty,
      checkIfDocumentMatchesFilters
    );

  if (isError) {
    setAlert("프로필 목록을 불러오는 중 오류가 발생했습니다 새로고침 해주세요");
  }

  const preset = async () => {
    setBlockedUsers(await getBlockedUsers(user.uid));
    setRelativeProfileIds(
      await getRelativeProfileIds(changedTabName, user.uid)
    );
  };

  const onIntersection = async (
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) => {
    const entry = entries[0];
    if (entry.isIntersecting && hasNextPage) {
      observer.unobserve(entry.target);
      fetchNextPage();
    }
  };

  useEffect(() => {
    preset();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const observer = new IntersectionObserver(onIntersection, { threshold: 1 });
    if (observer && bottom.current) observer.observe(bottom.current);

    return () => {
      observer && observer.disconnect();
    };
  }, [data]);

  return (
    <Flex
      backgroundColor="#fff"
      w={{sm:'100%', md:"80%"}}
      maxW="40rem"
      p="2"
      pb="6"
      mt="6"
      mb="6"
      direction="column"
      align="center"
      borderRadius="xl"
    >
      <Heading fontSize={{sm: '2xl',md:"3xl"}} color="#555" pt="6" pb="4" textAlign='center'>
        나와 잘 맞는 {tab}를 찾아보세요
      </Heading>
      <Divider w="80%" mt="4" mb="8" />
      <ProfileFilter tab={tab} filters={filters} setFilters={setFilters} />
      <Divider w="80%" mt="4" mb="8" />
      {isLoading && (
        <Flex justify="center">
          <MoonLoader
            size={40}
            color="#5096F2"
            style={{
              marginTop: "2rem",
              backgroundColor: "#E6F2FD",
            }}
          />
        </Flex>
      )}
      <Grid gap="2" w="80%">
        {data?.length === 0 ? (
          <Text textAlign="center">등록된 프로필이 없습니다</Text>
        ) : (
          data?.map((profile, idx) => {
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
      {hasNextPage && <div ref={bottom}></div>}
    </Flex>
  );
};
export default ProfileList;
