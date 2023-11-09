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
  Text,
  Textarea,
} from "@chakra-ui/react";

const NewProfile = () => {
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
      <Heading fontSize="3xl" color="#555" pt="10" pb="14">
        새로운 프로필 만들기
      </Heading>
      <Box>
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
          <FormHelperText>나의 관심사를 선택해주세요</FormHelperText>
        </FormControl>
        <FormControl
          sx={{
            span: {
              fontSize: "0.9rem",
            },
          }}
        >
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
          <FormHelperText>나의 플레이 스타일을 선택해주세요</FormHelperText>
        </FormControl>
        <FormControl
          sx={{
            textarea: {
              fontSize: "0.9rem",
            },
          }}
        >
          <FormLabel mt="8" fontWeight="bold" color="#555">
            자기소개
          </FormLabel>
          <Textarea placeholder="자기소개를 입력해주세요" />
          <FormHelperText>나를 예비 친구들에게 소개해보세요</FormHelperText>
        </FormControl>
        <Flex justify="end" mt="4">
          <Button size="md">만들기</Button>
        </Flex>
      </Box>
    </Flex>
  );
};
export default NewProfile;
