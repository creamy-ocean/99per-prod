import {
  addProfile,
  checkIfProfileExists,
  getGames,
  getGenres,
  getInterests,
  getStyles,
  updateProfile,
} from "@/database/firebase";
import { FormValues, Games, UserInterface } from "@/types/types";
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
  Grid,
  Heading,
  Img,
  Input,
  Select,
  Tab,
  TabList,
  Tabs,
  Text,
  Textarea,
  VisuallyHiddenInput,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import imageCompression from "browser-image-compression";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useOutletContext } from "react-router-dom";
import { array, mixed, object, string } from "yup";

const REG_EXP = /^((?![%=*><]).)*$/g;

const formSchema = object()
  .shape({
    genre: string().required(),
    game: string()
      .test("gameNotSelected", "게임을 선택해주세요", (game, context) => {
        if (game === "게임 장르를 선택해주세요") {
          return context.createError({
            message: "게임을 선택해주세요",
          });
        } else {
          return true;
        }
      })
      .required(),
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
    image: mixed<File>().test(
      "fileSize",
      "최대 1MB까지 업로드 가능",
      (file, context) => {
        if (file) {
          if (file.size > 1000000) {
            return context.createError({
              message: "최대 1MB까지 업로드 가능합니다",
            });
          } else {
            return true;
          }
        } else {
          return true;
        }
      }
    ),
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
  })
  .required();

const NewProfile = () => {
  const user = useOutletContext<UserInterface>();
  const profile = useLocation().state?.profile;

  const [loading, setLoading] = useState<boolean>(true);
  const [currTab, setCurrTab] = useState<string>("친구");
  const [imgPreview, setImgPreview] = useState<string>(
    profile ? profile.image : ""
  );
  const [genres, setGenres] = useState<Array<string>>([]);
  const [genre, setGenre] = useState<string>(profile ? profile.genre : "all");
  const [games, setGames] = useState<Games>({});
  const [gameList, setGameList] = useState<Array<string>>([
    "게임 장르를 선택해주세요",
  ]);
  const [styles, setStyles] = useState<Array<string>>([]);
  const [interests, setInterests] = useState<Array<string>>([]);
  const [alert, setAlert] = useState<string>("");

  const helperText =
    currTab === "친구" ? "나" : currTab === "파티" ? "우리 파티" : "우리 길드";

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    clearErrors,
    watch,
    control,
    setValue,
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: profile
      ? {
          genre: profile.genre,
          game: profile.game,
          interest: profile.interest,
          style: profile.style,
          intro: profile.intro,
          contact: profile.contact,
        }
      : {
          genre: "all",
          game: "게임 장르를 선택해주세요",
        },
  });

  const profileImg = watch("image");

  const getLists = async () => {
    const genres = await getGenres();
    const games = await getGames();
    const styles = await getStyles(currTab);
    const interests = await getInterests(currTab);
    setGenres(genres);
    setGames(games);
    setStyles(styles);
    setInterests(interests);
    profile && setGameList(games[genre]);
    setLoading(false);
  };

  useEffect(() => {
    getLists();
  }, [currTab]);

  useEffect(() => {
    if (loading) return;
    if (genre === "all") {
      setGameList(["게임 장르를 선택해주세요"]);
    } else {
      setGameList(games[genre]);
      setValue("game", games[genre][0]);
    }
  }, [genre]);

  useEffect(() => {
    if (profileImg) {
      setImgPreview(URL.createObjectURL(profileImg));
    }
  }, [profileImg]);

  const changeTab = (e: React.MouseEvent<HTMLButtonElement>) => {
    const eventTarget = e.target as HTMLButtonElement;
    setCurrTab(eventTarget.innerText);
    clearErrors();
  };

  const onGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setGenre(value);
    setValue("genre", value);
  };

  const onTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.key === "Enter" && e.preventDefault();
  };

  const onSubmit: SubmitHandler<FormValues> = async (formValues) => {
    try {
      if (profile) {
        await updateProfile(user?.uid, profile.id, profile.tab, formValues);
        setAlertMsg("프로필이 수정되었습니다");
      } else {
        // 친구 프로필의 경우 같은 게임의 프로필이 이미 존재하면 프로필 생성 불가
        if (currTab === "친구") {
          const profileExists = await checkIfProfileExists(
            currTab,
            user.uid,
            formValues.game
          );
          if (profileExists) {
            setAlertMsg(`${formValues.game} 친구 프로필이 이미 존재합니다`);
            return;
          }
        }
        await addProfile(currTab, user?.uid, formValues);
        setAlertMsg("프로필이 생성되었습니다");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setAlertMsg(e.message);
    }
  };

  const setAlertMsg = (alertMsg: string) => {
    setAlert(alertMsg);
    setTimeout(() => {
      setAlert("");
    }, 5000);
  };
  return (
    <Flex
      direction="column"
      px={{sm:"2", md:"12"}}
      pt="4"
      pb="8"
      my="8"
      w={{sm: '100%', md: "80%"}}
      maxW="40rem"
      backgroundColor="white"
      borderRadius="xl"
      alignItems="center"
    >
      <Heading fontSize="3xl" color="#555" pt="6" pb="10">
        {profile ? "프로필 수정하기" : "새 프로필 만들기"}
      </Heading>
      <Box w="90%">
        <Tabs variant="soft-rounded" colorScheme="blue" mb="4" align="center">
          {profile ? (
            <TabList>
              <Tab>{profile.tab}</Tab>
            </TabList>
          ) : (
            <TabList>
              <Tab onClick={changeTab}>친구</Tab>
              <Tab onClick={changeTab}>파티</Tab>
              <Tab onClick={changeTab}>길드</Tab>
            </TabList>
          )}
        </Tabs>
        <form id="profile-form" onSubmit={handleSubmit(onSubmit)}>
          <label style={{ marginTop: "8", fontWeight: "bold", color: "#555" }}>
            게임
            <span style={{ color: "#E53E3E" }}> *</span>
          </label>
          <Grid templateColumns="1fr 1fr" mt="2">
            <FormControl
              sx={{
                select: { fontSize: "0.9rem" },
                option: {
                  fontSize: "0.9rem",
                },
              }}
              isInvalid={!!errors?.game}
            >
              <Controller
                control={control}
                name="genre"
                render={({ field: { value } }) => (
                  <Select
                    w="90%"
                    style={{ cursor: "pointer" }}
                    value={value}
                    onChange={onGenreChange}
                  >
                    {genre === "all" && <option value="all">게임 장르</option>}
                    {genres &&
                      genres.map((g, idx) => {
                        return (
                          <option key={idx} value={g}>
                            {g}
                          </option>
                        );
                      })}
                  </Select>
                )}
              />
              {errors?.game ? (
                <FormErrorMessage>{errors.game.message}</FormErrorMessage>
              ) : (
                <FormHelperText>
                  프로필을 등록할 게임을 선택해주세요
                </FormHelperText>
              )}
            </FormControl>
            <FormControl
              sx={{
                select: { fontSize: "0.9rem" },
                option: {
                  fontSize: "0.9rem",
                },
              }}
              isInvalid={!!errors?.game}
            >
              <Controller
                control={control}
                name="game"
                render={({ field: { value, onChange } }) => (
                  <Select
                    style={{ cursor: "pointer" }}
                    value={value}
                    onChange={onChange}
                  >
                    {gameList &&
                      gameList.map((game, idx) => {
                        return (
                          <option key={idx} value={game}>
                            {game}
                          </option>
                        );
                      })}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <FormControl
            sx={{
              span: {
                fontSize: "0.9rem",
              },
            }}
            isInvalid={!!errors?.interest}
          >
            <FormLabel mt="8" fontWeight="bold" color="#555">
              관심사 <span style={{ color: "#E53E3E" }}> *</span>
            </FormLabel>
            <Controller
              name="interest"
              control={control}
              render={({ field: { value, onChange } }) => (
                <CheckboxGroup value={value as string[]} onChange={onChange}>
                  {interests.map((i, idx) => {
                    return (
                      <Checkbox mr="24px" mb="2" key={idx} value={i}>
                        <Text>{i}</Text>
                      </Checkbox>
                    );
                  })}
                </CheckboxGroup>
              )}
            />
            {errors?.interest ? (
              <FormErrorMessage>{errors.interest.message}</FormErrorMessage>
            ) : (
              <FormHelperText>
                {helperText}의 관심사를 선택해주세요
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
            <FormLabel mt="8" fontWeight="bold" color="#555">
              플레이 스타일 <span style={{ color: "#E53E3E" }}> *</span>
            </FormLabel>
            <Controller
              name="style"
              control={control}
              render={({ field: { value, onChange } }) => (
                <CheckboxGroup value={value as string[]} onChange={onChange}>
                  {styles.map((s, idx) => {
                    return (
                      <Checkbox mr="24px" mb="2" key={idx} value={s}>
                        <Text>{s}</Text>
                      </Checkbox>
                    );
                  })}
                </CheckboxGroup>
              )}
            />
            {errors?.style ? (
              <FormErrorMessage>{errors.style.message}</FormErrorMessage>
            ) : (
              <FormHelperText>
                {helperText}의 플레이 스타일을 선택해주세요
              </FormHelperText>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.image}>
            <FormLabel mt="8" fontWeight="bold" color="#555">
              프로필 사진
            </FormLabel>
            <Flex
              align="center"
              direction="column"
              border="1px solid #E2E8F0"
              borderRadius="base"
              p="1rem"
            >
              {imgPreview ? (
                <>
                  <Img src={imgPreview} w="8rem" h="8rem" borderRadius="full" />
                </>
              ) : (
                <>
                  <Box>
                    <i
                      className="fa-regular fa-image"
                      style={{ fontSize: "2rem", color: "#718096" }}
                    ></i>
                  </Box>
                </>
              )}
              <label
                htmlFor="image-input"
                style={{
                  width: "100%",
                  marginTop: "14px",
                  padding: "6px 0px",
                  backgroundColor: "#E2E8F0",
                  fontSize: "0.9rem",
                  textAlign: "center",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                파일 선택
              </label>
              <Controller
                control={control}
                name={"image"}
                render={({ field: { onChange } }) => (
                  <VisuallyHiddenInput
                    color="#718096"
                    border="none"
                    borderRadius="base"
                    cursor="pointer"
                    type="file"
                    accept="image/*"
                    id="image-input"
                    onChange={async (e) => {
                      if (
                        e.target.files === null ||
                        e.target.files.length === 0
                      )
                        return;
                      const imageFile = e.target.files[0];
                      const options = { maxSizeMB: 1, maxWidthOrHeight: 1920 };
                      try {
                        const compressedFile = await imageCompression(
                          imageFile,
                          options
                        );
                        onChange(compressedFile);
                      } catch (error) {
                        setAlertMsg(
                          "파일 업로드 중 문제가 발생했습니다 다시 시도해주세요"
                        );
                      }
                    }}
                  />
                )}
              />
            </Flex>
            {errors?.image ? (
              <FormErrorMessage>{errors.image.message}</FormErrorMessage>
            ) : (
              <FormHelperText>프로필 사진을 업로드 해주세요</FormHelperText>
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
              소개 <span style={{ color: "#E53E3E" }}> *</span>
            </FormLabel>
            <Controller
              control={control}
              name="intro"
              render={({ field: { value, onChange } }) => (
                <Textarea
                  placeholder={
                    currTab === "친구"
                      ? "자기 소개를 입력해주세요"
                      : currTab === "파티"
                        ? "파티 소개를 입력해주세요"
                        : "길드 소개를 입력해주세요"
                  }
                  value={value}
                  onChange={onChange}
                  onKeyDown={onTextareaKeyDown}
                />
              )}
            />
            {errors?.intro ? (
              <FormErrorMessage>{errors.intro.message}</FormErrorMessage>
            ) : (
              <FormHelperText>
                {helperText}를 예비{" "}
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
              연락처 <span style={{ color: "#E53E3E" }}> *</span>
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
          <Flex justify="end" mt="6">
            <Button size="md" type="submit" isLoading={isSubmitting}>
              {profile ? "수정하기" : "만들기"}
            </Button>
          </Flex>
        </form>
      </Box>
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
export default NewProfile;
