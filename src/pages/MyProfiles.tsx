import useProfilesInfiniteQuery from "@/hooks/useProfilesInfiniteQuery";
import { UserInterface } from "@/types/types";
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
import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { MoonLoader } from "react-spinners";

const MyProfiles = () => {
  const user = useOutletContext<UserInterface>();

  // const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currTab, setCurrTab] = useState<string>("친구");
  const [alert, setAlert] = useState<string>("");

  const bottom = useRef(null);
  // lastProfile과 hasMore를 ref로 관리하는 이유는
  // state로 관리하면 fetchProfiles 호출 전에 값을 업데이트 할 수 없기 때문
  // (state로 관리하면 탭을 변경해도 값이 유지되는 현상 발생)
  // const lastProfile = useRef<DocumentData | null>(null);
  // const hasMore = useRef<boolean>(true);

  const {
    data,
    isError,
    isLoading,
    hasNextPage,
    fetchNextPage,
    removeProfile,
  } = useProfilesInfiniteQuery(true, currTab, user.uid, true);
  // const fetchProfiles = async () => {
  //   try {
  //     const { profilesData, lastVisible } = await getProfiles(
  //       true,
  //       changedTabName,
  //       user.uid,
  //       lastProfile.current
  //     );
  //     if (profilesData && hasMore.current) {
  //       if (profilesData.length < profileLimit) {
  //         hasMore.current = false;
  //       }
  //       setProfiles((prevProfiles) => [...prevProfiles, ...profilesData]);
  //       lastProfile.current = lastVisible;
  //     }
  //   } catch (err) {
  //     setAlert("프로필을 불러오는 중 오류가 발생했습니다");
  //   }
  // };

  const onIntersection = async (
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) => {
    const entry = entries[0];
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      fetchNextPage();
    }
  };

  // useEffect(() => {
  //   // if (profiles.length < 1) return;
  //   const observer = new IntersectionObserver(onIntersection, { threshold: 1 });
  //   if (observer && bottom.current) observer.observe(bottom.current);

  //   return () => {
  //     observer && observer.disconnect();
  //   };
  // }, [data]);

  const changeTab = (e: React.MouseEvent<HTMLButtonElement>) => {
    const eventTarget = e.target as HTMLButtonElement;
    setCurrTab(eventTarget.innerText);
  };

  // const removeProfile = useMutation({
  //   mutationFn: ({ profileId, game }: { profileId: string; game: string }) =>
  //     deleteProfile(profileId, currTab, game, user.uid),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(["myProfiles", currTab]);
  //   },
  // });

  const onDeleteProfile = (profileId: string, game: string) => {
    removeProfile.mutate({ profileId, game });
  };

  useEffect(() => {
    if (isLoading) return;
    const observer = new IntersectionObserver(onIntersection, { threshold: 1 });
    if (observer && bottom.current) observer.observe(bottom.current);

    return () => {
      observer && observer.disconnect();
    };
  }, [data]);

  // useEffect(() => {
  //   // 탭이 바뀌면 마지막 프로필, hasMore 값 초기화
  //   // lastProfile.current = null;
  //   // hasMore.current = true;
  //   // setProfiles([]);
  //   // fetchProfiles();
  // }, [currTab]);

  if (isError) {
    setAlert("프로필 목록을 불러오는 중 오류가 발생했습니다 새로고침 해주세요");
  }

  return (
    <Flex
      backgroundColor="#fff"
      w={{sm: "100%", md: "80%"}}
      maxW="40rem"
      p={{sm:"0", md:'2'}}
      pb="6"
      mt="6"
      mb="6"
      direction="column"
      align="center"
      borderRadius="xl"
    >
      <Heading fontSize="3xl" color="#555" pt="6" pb="4">
        내 프로필
      </Heading>
      <Divider w="80%" mt="4" mb="8" />
      <Tabs variant="soft-rounded" colorScheme="blue" mb="8" align="center">
        <TabList>
          <Tab onClick={changeTab}>친구</Tab>
          <Tab onClick={changeTab}>파티</Tab>
          <Tab onClick={changeTab}>길드</Tab>
        </TabList>
      </Tabs>
      <Grid gap="2" w={{sm:"90%", md:"80%"}}>
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
        {data?.length === 0 ? (
          <Text textAlign="center">등록된 프로필이 없습니다</Text>
        ) : (
          data?.map((profile, idx) => {
            return (
              <ProfileCard
                key={idx}
                profile={profile}
                user={user}
                tab={currTab}
                isOwner={true}
                setAlert={setAlert}
                deleteProfile={onDeleteProfile}
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
      {hasNextPage && <div ref={bottom}></div>}
    </Flex>
  );
};
export default MyProfiles;
