import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Select,
  Tab,
  TabList,
  Tabs,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";

const NewProfile = () => {
  const [currTab, setCurrTab] = useState<string>("친구");

  const changeTab = (e: React.MouseEvent<HTMLButtonElement>) => {
    const eventTarget = e.target as HTMLButtonElement;
    setCurrTab(eventTarget.innerText);
  };

  return (
    <Flex
      direction="column"
      px="20"
      pt="4"
      my="8"
      backgroundColor="white"
      borderRadius="xl"
      alignItems="center"
    >
      <Heading fontSize="3xl" color="#555" pt="6" pb="10">
        새로운 프로필 만들기
      </Heading>
      <Box>
        <Tabs variant="soft-rounded" colorScheme="blue" mb="4" align="center">
          <TabList>
            <Tab onClick={changeTab}>친구</Tab>
            <Tab onClick={changeTab}>파티</Tab>
            <Tab onClick={changeTab}>길드</Tab>
          </TabList>
        </Tabs>
        <FormControl
          sx={{
            select: { fontSize: "0.9rem" },
            option: {
              fontSize: "0.9rem",
            },
          }}
        >
          <FormLabel fontWeight="bold" color="#555">
            게임
          </FormLabel>
          <Select>
            <option>리그 오브 레전드</option>
            <option>메이플스토리</option>
            <option>배틀그라운드</option>
          </Select>
          <FormHelperText>프로필을 등록할 게임을 선택해주세요</FormHelperText>
        </FormControl>
        <FormControl
          sx={{
            span: {
              fontSize: "0.9rem",
            },
          }}
        >
          <FormLabel mt="8" fontWeight="bold" color="#555">
            관심사
          </FormLabel>
          <CheckboxGroup>
            <HStack spacing="24px">
              <Checkbox value="rank">
                <Text>랭크/티어</Text>
              </Checkbox>
              <Checkbox value="level">
                <Text>레벨/스펙</Text>
              </Checkbox>
              <Checkbox value="deco">
                <Text>코디/꾸미기</Text>
              </Checkbox>
            </HStack>
            <HStack spacing="11px" mt="2">
              <Checkbox value="boss">
                <Text>보스/레이드</Text>
              </Checkbox>
              <Checkbox value="collect">
                <Text>수집/컬렉션</Text>
              </Checkbox>
              <Checkbox value="hunt">
                <Text>사냥/채집</Text>
              </Checkbox>
            </HStack>
          </CheckboxGroup>
          <FormHelperText>
            {currTab === "친구"
              ? "나"
              : currTab === "파티"
              ? "우리 파티"
              : "우리 길드"}
            의 관심사를 선택해주세요
          </FormHelperText>
        </FormControl>
        <FormControl
          sx={{
            span: {
              fontSize: "0.9rem",
            },
          }}
        >
          {currTab === "길드" ? (
            <>
              <FormLabel mt="8" fontWeight="bold" color="#555">
                길드 스타일
              </FormLabel>
              <CheckboxGroup>
                <HStack spacing="24px">
                  <Checkbox value="friendship">
                    <Text>친목</Text>
                  </Checkbox>
                  <Checkbox value="solo">
                    <Text>솔플</Text>
                  </Checkbox>
                  <Checkbox value="voice">
                    <Text>보이스</Text>
                  </Checkbox>
                  <Checkbox value="chat">
                    <Text>채팅만</Text>
                  </Checkbox>
                </HStack>
              </CheckboxGroup>
              <FormHelperText>우리 길드의 스타일을 선택해주세요</FormHelperText>
            </>
          ) : (
            <>
              <FormLabel mt="8" fontWeight="bold" color="#555">
                플레이 스타일
              </FormLabel>
              <CheckboxGroup>
                <HStack spacing="24px">
                  <Checkbox value="attacker">
                    <Text>돌격형</Text>
                  </Checkbox>
                  <Checkbox value="defender">
                    <Text>방어형</Text>
                  </Checkbox>
                  <Checkbox value="serious">
                    <Text>빡겜</Text>
                  </Checkbox>
                  <Checkbox value="casual">
                    <Text>즐겜</Text>
                  </Checkbox>
                </HStack>
                <HStack spacing="24px" mt="2">
                  <Checkbox value="voice">
                    <Text>보이스</Text>
                  </Checkbox>
                  <Checkbox value="chat">
                    <Text>채팅만</Text>
                  </Checkbox>
                  <Checkbox value="interact">
                    <Text>소통</Text>
                  </Checkbox>
                  <Checkbox value="solo">
                    <Text>솔플</Text>
                  </Checkbox>
                </HStack>
              </CheckboxGroup>
              <FormHelperText>
                {currTab === "친구" ? "나" : "우리 파티"}의 플레이 스타일을
                선택해주세요
              </FormHelperText>
            </>
          )}
        </FormControl>
        <FormControl
          sx={{
            textarea: {
              fontSize: "0.9rem",
            },
          }}
        >
          <FormLabel mt="8" fontWeight="bold" color="#555">
            {currTab === "친구" ? "자기" : currTab === "파티" ? "파티" : "길드"}{" "}
            소개
          </FormLabel>
          <Textarea
            placeholder={
              currTab === "친구"
                ? "자기 소개를 입력해주세요"
                : currTab === "파티"
                ? "파티 소개를 입력해주세요"
                : "길드 소개를 입력해주세요"
            }
          />
          <FormHelperText>
            {currTab === "친구"
              ? "나"
              : currTab === "파티"
              ? "우리 파티"
              : "우리 길드"}
            를 예비{" "}
            {currTab === "친구"
              ? "친구"
              : currTab === "파티"
              ? "파티원"
              : "길드원"}
            들에게 소개해보세요
          </FormHelperText>
        </FormControl>
        <Flex justify="end" mt="4">
          <Button size="md">만들기</Button>
        </Flex>
      </Box>
    </Flex>
  );
};
export default NewProfile;
