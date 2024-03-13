import {
  addRelationship,
  deleteRequest,
  getProfilesFromRequests,
} from "@/database/firebase";
import { Profile, UserInterface } from "@/types/types";
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
import { useLocation, useOutletContext } from "react-router-dom";

const requestTabs = ["보낸 요청", "받은 요청"];
const typeTabs = ["친구", "파티", "길드"];

const MyRequests = () => {
  const { state } = useLocation();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [requestTabIdx, setRequestTabIdx] = useState(0);
  const [typeTabIdx, setTypeTabIdx] = useState(0);
  const [alert, setAlert] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const user = useOutletContext<UserInterface>();

  const fetchProfiles = async () => {
    const changedRequestTabName = changeTabName(requestTabs[requestTabIdx]);
    const changedTypeTabName = changeTabName(typeTabs[typeTabIdx]);
    const data = await getProfilesFromRequests(
      user.uid,
      changedRequestTabName,
      changedTypeTabName
    );
    setProfiles(data.filter((d) => d.tab === typeTabs[typeTabIdx]));
  };

  const approveRequest = (
    requestId: string,
    profileId: string,
    userId: string,
    tab: string,
    game: string
  ) => {
    deleteRequest(requestId);
    addRelationship(profileId, user?.uid, userId, tab, game);
    setProfiles((prev) => prev.filter((p) => p.id !== profileId));
  };

  const rejectRequest = (requestId: string, profileId: string) => {
    deleteRequest(requestId);
    setProfiles((prev) => prev.filter((p) => p.id !== profileId));
  };

  useEffect(() => {
    setLoading(true);
    fetchProfiles();
    setLoading(false);
  }, [requestTabIdx, typeTabIdx]);

  useEffect(() => {
    if (!state) return;
    setRequestTabIdx(() =>
      requestTabs.findIndex(
        (requestTab) => requestTab === state.defaultRequestTab
      )
    );
    setTypeTabIdx(() =>
      typeTabs.findIndex((typeTab) => typeTab === state.defaultTypeTab)
    );
  }, [state]);

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
        내 요청
      </Heading>
      <Divider w="80%" mt="4" mb="8" />
      <Tabs
        variant="soft-rounded"
        colorScheme="blue"
        mb="8"
        align="center"
        index={requestTabIdx}
        onChange={(idx) => setRequestTabIdx(idx)}
      >
        <TabList>
          {requestTabs.map((tabName) => (
            <Tab key={tabName}>{tabName}</Tab>
          ))}
        </TabList>
      </Tabs>
      <Tabs
        variant="soft-rounded"
        colorScheme="blue"
        mb="8"
        align="center"
        index={typeTabIdx}
        onChange={(idx) => setTypeTabIdx(idx)}
      >
        <TabList>
          {typeTabs.map((tabName) => (
            <Tab key={tabName}>{tabName}</Tab>
          ))}
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
                tab={typeTabs[typeTabIdx]}
                isReceived={
                  requestTabs[requestTabIdx] === "받은 요청" ? true : false
                }
                approveRequest={approveRequest}
                rejectRequest={rejectRequest}
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
