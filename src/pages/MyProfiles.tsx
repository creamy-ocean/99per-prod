import { useAuthContext } from "@/context/AuthContext";
import { deleteProfile, getProfiles } from "@/database/firebase";
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
import { Timestamp } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

const MyProfiles = () => {
  const user = useAuthContext();

  if (!user) return;

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currTab, setCurrTab] = useState<string>("친구");
  const [alert, setAlert] = useState<string>("");
  // const [lastProfileCreatedAt, setLastProfileCreatedAt] =
  //   useState<Timestamp | null>(null);
  // const [hasMore, setHasMore] = useState(true);

  const profileLimit = 6;
  const bottom = useRef(null);
  // lastProfileCreatedAt을 ref로 사용한 이유는
  // state로 관리하면 fetchProfiles 호출 전에 값을 업데이트 할 수 없기 때문
  const lastProfileCreatedAt = useRef<Timestamp | null>(null);
  const hasMore = useRef<boolean>(true);
  const changedTabName = changeTabName(currTab);

  const onIntersection = async (
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) => {
    const entry = entries[0];
    if (entry.isIntersecting) {
      console.log("isIntersecting");
      observer.unobserve(entry.target);
      fetchProfiles();
    }
  };

  const fetchProfiles = async () => {
    console.log("fetching");
    console.log(lastProfileCreatedAt);
    try {
      const profilesData = await getProfiles(
        true,
        changedTabName,
        user.uid,
        lastProfileCreatedAt.current
      );
      console.log("가져온 데이터 길이: ", profilesData.length);
      if (profilesData && hasMore.current) {
        if (profilesData.length < profileLimit) {
          hasMore.current = false;
        }
        setProfiles((prevProfiles) => [...prevProfiles, ...profilesData]);
        lastProfileCreatedAt.current =
          profilesData.length > 0
            ? profilesData[profilesData.length - 1].createdAt
            : null;
        console.log(profilesData[profilesData.length - 1]);
      }
    } catch (err) {
      console.log(err);
      setAlert("프로필을 불러오는 중 오류가 발생했습니다");
    }
  };

  useEffect(() => {
    if (profiles.length < 1) return;
    console.log("profiles useEffect");
    const observer = new IntersectionObserver(onIntersection, { threshold: 1 });
    if (observer && bottom.current) observer.observe(bottom.current);

    return () => {
      observer && observer.disconnect();
    };
  }, [profiles]);

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

  useEffect(() => {
    console.log("currTab useEffect");
    // 탭이 바뀌면 마지막 프로필, hasMore 값 초기화
    lastProfileCreatedAt.current = null;
    hasMore.current = true;
    setProfiles([]);
    fetchProfiles();
    // 프로필을 가져온 뒤 프로필 목록에서 마지막 프로필 참조
  }, [currTab]);

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
                isOwner={true}
                setAlert={setAlert}
                deleteProfile={onDeleteProfile}
              />
            );
          })
        )}
        {hasMore.current && <div ref={bottom}></div>}
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
export default MyProfiles;
