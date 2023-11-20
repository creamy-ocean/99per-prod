import { useAuthContext } from "@/context/AuthContext";
import { addProfile } from "@/database/firebase";
import { FormValues } from "@/types/types";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Input,
  Select,
  Tab,
  TabList,
  Tabs,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { array, object, string } from "yup";

const REG_EXP = /^((?![%=*><]).)*$/g;

const formSchema = object({
  game: string().required(),
  interest: array()
    .of(string())
    .ensure()
    .compact()
    .min(1, "하나 이상의 관심사를 선택해주세요")
    .required(),
  style: array()
    .of(string())
    .ensure()
    .compact()
    .min(1, "하나 이상의 스타일을 선택해주세요")
    .required(),
  intro: string()
    .min(1, "최소 한 글자 이상 입력해주세요")
    .matches(REG_EXP, "특수문자 %, =, *, >, <는 입력할 수 없습니다")
    .max(128, "최대 128자까지 입력 가능합니다")
    .required(),
  contact: string()
    .min(1, "최소 한 글자 이상 입력해주세요")
    .matches(REG_EXP, "특수문자 %, =, *, >, <는 입력할 수 없습니다")
    .max(64, "최대 64자까지 입력 가능합니다")
    .required(),
}).required();

const NewProfile = () => {
  const [currTab, setCurrTab] = useState<string>("친구");
  const [error, setError] = useState();
  const user = useAuthContext();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    clearErrors,
    reset,
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      game: "리그 오브 레전드",
    },
  });

  const changeTab = (e: React.MouseEvent<HTMLButtonElement>) => {
    const eventTarget = e.target as HTMLButtonElement;
    setCurrTab(eventTarget.innerText);
    clearErrors();
    reset();
  };

  const onSubmit: SubmitHandler<FormValues> = async (formValues) => {
    try {
      await addProfile(currTab, user?.uid, formValues);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const onTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.key === "Enter" && e.preventDefault();
  };

  return (
    <Flex
      direction="column"
      px="20"
      pt="4"
      pb="8"
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
        <form id="profile-form" onSubmit={handleSubmit(onSubmit)}>
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
            isInvalid={!!errors?.interest}
          >
            <FormLabel mt="8" fontWeight="bold" color="#555">
              관심사
            </FormLabel>
            <CheckboxGroup>
              <HStack spacing="24px">
                <Checkbox value="랭크/티어" {...register("interest")}>
                  <Text>랭크/티어</Text>
                </Checkbox>
                <Checkbox value="레벨/스펙" {...register("interest")}>
                  <Text>레벨/스펙</Text>
                </Checkbox>
                <Checkbox value="코디/꾸미기" {...register("interest")}>
                  <Text>코디/꾸미기</Text>
                </Checkbox>
              </HStack>
              <HStack spacing="11px" mt="2">
                <Checkbox value="보스/레이드" {...register("interest")}>
                  <Text>보스/레이드</Text>
                </Checkbox>
                <Checkbox value="수집/컬렉션" {...register("interest")}>
                  <Text>수집/컬렉션</Text>
                </Checkbox>
                <Checkbox value="사냥/채집" {...register("interest")}>
                  <Text>사냥/채집</Text>
                </Checkbox>
              </HStack>
            </CheckboxGroup>
            {errors?.interest ? (
              <FormErrorMessage>{errors.interest.message}</FormErrorMessage>
            ) : (
              <FormHelperText>
                {currTab === "친구"
                  ? "나"
                  : currTab === "파티"
                  ? "우리 파티"
                  : "우리 길드"}
                의 관심사를 선택해주세요
              </FormHelperText>
            )}
          </FormControl>
          <FormControl
            sx={{
              span: {
                fontSize: "0.9rem",
              },
            }}
            isInvalid={!!errors.style}
          >
            {currTab === "길드" ? (
              <>
                <FormLabel mt="8" fontWeight="bold" color="#555">
                  길드 스타일
                </FormLabel>
                <CheckboxGroup>
                  <HStack spacing="24px">
                    <Checkbox value="친목" {...register("style")}>
                      <Text>친목</Text>
                    </Checkbox>
                    <Checkbox value="솔플" {...register("style")}>
                      <Text>솔플</Text>
                    </Checkbox>
                    <Checkbox value="보이스" {...register("style")}>
                      <Text>보이스</Text>
                    </Checkbox>
                    <Checkbox value="채팅만" {...register("style")}>
                      <Text>채팅만</Text>
                    </Checkbox>
                  </HStack>
                </CheckboxGroup>
                {errors?.style ? (
                  <FormErrorMessage>{errors.style.message}</FormErrorMessage>
                ) : (
                  <FormHelperText>
                    우리 길드의 스타일을 선택해주세요
                  </FormHelperText>
                )}
              </>
            ) : (
              <>
                <FormLabel mt="8" fontWeight="bold" color="#555">
                  플레이 스타일
                </FormLabel>
                <CheckboxGroup>
                  <HStack spacing="24px">
                    <Checkbox value="돌격형" {...register("style")}>
                      <Text>돌격형</Text>
                    </Checkbox>
                    <Checkbox value="방어형" {...register("style")}>
                      <Text>방어형</Text>
                    </Checkbox>
                    <Checkbox value="빡겜" {...register("style")}>
                      <Text>빡겜</Text>
                    </Checkbox>
                    <Checkbox value="즐겜" {...register("style")}>
                      <Text>즐겜</Text>
                    </Checkbox>
                  </HStack>
                  <HStack spacing="24px" mt="2">
                    <Checkbox value="보이스" {...register("style")}>
                      <Text>보이스</Text>
                    </Checkbox>
                    <Checkbox value="채팅만" {...register("style")}>
                      <Text>채팅만</Text>
                    </Checkbox>
                    <Checkbox value="소통" {...register("style")}>
                      <Text>소통</Text>
                    </Checkbox>
                    <Checkbox value="솔플" {...register("style")}>
                      <Text>솔플</Text>
                    </Checkbox>
                  </HStack>
                </CheckboxGroup>
                {errors?.style ? (
                  <FormErrorMessage>{errors.style.message}</FormErrorMessage>
                ) : (
                  <FormHelperText>
                    {currTab === "친구" ? "나" : "우리 파티"}의 플레이 스타일을
                    선택해주세요
                  </FormHelperText>
                )}
              </>
            )}
          </FormControl>
          <FormControl
            sx={{
              textarea: {
                fontSize: "0.9rem",
              },
            }}
            isInvalid={!!errors?.intro}
          >
            <FormLabel mt="8" fontWeight="bold" color="#555">
              {currTab === "친구"
                ? "자기"
                : currTab === "파티"
                ? "파티"
                : "길드"}{" "}
              소개
            </FormLabel>
            <Textarea
              {...register("intro")}
              placeholder={
                currTab === "친구"
                  ? "자기 소개를 입력해주세요"
                  : currTab === "파티"
                  ? "파티 소개를 입력해주세요"
                  : "길드 소개를 입력해주세요"
              }
              onKeyDown={onTextareaKeyDown}
            />
            {errors?.intro ? (
              <FormErrorMessage>{errors.intro.message}</FormErrorMessage>
            ) : (
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
            )}
          </FormControl>
          <FormControl
            sx={{
              input: {
                fontSize: "0.9rem",
              },
            }}
            isInvalid={!!errors?.contact}
          >
            <FormLabel mt="8" fontWeight="bold" color="#555">
              연락처
            </FormLabel>
            <Input
              {...register("contact")}
              placeholder="채팅방 링크 또는 닉네임을 입력해주세요"
            />
            {errors?.contact ? (
              <FormErrorMessage>{errors.contact.message}</FormErrorMessage>
            ) : (
              <FormHelperText>
                {currTab} 신청을 수락하기 전까지 노출되지 않습니다
              </FormHelperText>
            )}
          </FormControl>
          {error && (
            <Alert
              status="info"
              mt="6"
              borderRadius="lg"
              color="brand.500"
              fontWeight="bold"
            >
              <AlertIcon />
              {error}
            </Alert>
          )}
          <Flex justify="end" mt="6">
            <Button size="md" type="submit" isLoading={isSubmitting}>
              만들기
            </Button>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
};
export default NewProfile;
