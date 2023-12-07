import {
  getGames,
  getGenres,
  getInterests,
  getStyles,
} from "@/database/firebase";
import { Games } from "@/types/types";
import { Box, Flex, Grid, Heading, Select, Tag } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const ProfileFilter = ({ tab }: { tab: string }) => {
  const [genres, setGenres] = useState<Array<string>>([]);
  const [genre, setGenre] = useState<string>("AOS");
  const [games, setGames] = useState<Games>({});
  const [styles, setStyles] = useState<Array<string>>([]);
  const [interests, setInterests] = useState<Array<string>>([]);

  const gameList = games[genre];

  const getFilters = async () => {
    const genres = await getGenres();
    const games = await getGames();
    const styles = await getStyles(tab);
    const interests = await getInterests(tab);
    setGenres(genres);
    setGames(games);
    setStyles(styles);
    setInterests(interests);
  };

  useEffect(() => {
    getFilters();
  }, []);

  const onGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setGenre(value);
  };

  return (
    <Flex direction="column" w="80%">
      <Box mb="4">
        <Heading size="sm" mb="2">
          게임
        </Heading>
        <Grid templateColumns="4fr 6fr">
          <Select w="90%" onChange={onGenreChange}>
            {genres &&
              genres.map((genre, idx) => {
                return (
                  <option key={idx} value={genre}>
                    {genre}
                  </option>
                );
              })}
          </Select>
          <Select>
            {gameList &&
              gameList.map((game, idx) => {
                return <option key={idx}>{game}</option>;
              })}
          </Select>
        </Grid>
      </Box>
      <Box mb="4">
        <Heading size="sm" mb="2">
          관심사
        </Heading>
        {interests.map((interest, idx) => {
          return (
            <Tag key={idx} mr="1">
              {interest}
            </Tag>
          );
        })}
        <Box></Box>
      </Box>
      <Box mb="4">
        <Heading size="sm" mb="2">
          플레이 스타일
        </Heading>
        {styles.map((style, idx) => {
          return (
            <Tag key={idx} mr="1">
              {style}
            </Tag>
          );
        })}
      </Box>
    </Flex>
  );
};
export default ProfileFilter;
