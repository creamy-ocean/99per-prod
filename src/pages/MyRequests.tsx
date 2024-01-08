import { useAuthContext } from "@/context/AuthContext";
import { getProfilesFromRequests } from "@/database/firebase";
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

const MyRequests = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [firstTab, setFirstTab] = useState<string>("보낸 요청");
  const [secondTab, setSecondTab] = useState<string>("친구");
  const [alert, setAlert] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const user = useAuthContext();

  const fetchProfiles = async () => {
    console.log("fetchProfiles");
    const changedFirstTabName = changeTabName(firstTab);
    const changedSecondTabName = changeTabName(secondTab);
    const data = await getProfilesFromRequests(
      user?.uid,
      changedFirstTabName,
      changedSecondTabName
    );
    setProfiles(
      firstTab === "받은 요청" ? data.filter((d) => d.tab === secondTab) : data
    );
  };

  const changeTab = (type: string, e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("changeTab");
    const eventTarget = e.target as HTMLButtonElement;
    type === "requestType"
      ? setFirstTab(eventTarget.innerText)
      : setSecondTab(eventTarget.innerText);
  };

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchProfiles();
    setLoading(false);
  }, [firstTab, secondTab]);

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
        내 요청
      </Heading>
      <Divider w="80%" mt="4" mb="8" />
      <Tabs variant="soft-rounded" colorScheme="blue" mb="8" align="center">
        <TabList>
          <Tab onClick={(e) => changeTab("requestType", e)}>보낸 요청</Tab>
          <Tab onClick={(e) => changeTab("requestType", e)}>받은 요청</Tab>
        </TabList>
      </Tabs>
      <Tabs variant="soft-rounded" colorScheme="blue" mb="8" align="center">
        <TabList>
          <Tab onClick={(e) => changeTab("tabType", e)}>친구</Tab>
          <Tab onClick={(e) => changeTab("tabType", e)}>파티</Tab>
          <Tab onClick={(e) => changeTab("tabType", e)}>길드</Tab>
        </TabList>
      </Tabs>
      <Grid gap="2" w="80%">
        {isArrayEmpty(profiles) ? (
          <Text textAlign="center">요청이 존재하지 않습니다</Text>
        ) : loading ? (
          <></>
        ) : (
          profiles.map((profile, idx) => {
            return (
              <ProfileCard
                key={idx}
                profile={profile}
                user={user}
                tab={secondTab}
                setAlert={setAlert}
                setProfiles={setProfiles}
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
export default MyRequests;
