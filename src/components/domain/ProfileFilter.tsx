import {
  getGames,
  getGenres,
  getInterests,
  getStyles,
} from "@/database/firebase";
import { Filters, Games } from "@/types/types";
import { Box, Flex, Grid, Heading, Select, Tag } from "@chakra-ui/react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

const ProfileFilter = ({
  tab,
  filters,
  setFilters,
}: {
  tab: string;
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
}) => {
  const [genres, setGenres] = useState<Array<string>>([]);
  const [genre, setGenre] = useState<string>("all");
  const [games, setGames] = useState<Games>({});
  const [styles, setStyles] = useState<Array<string>>([]);
  const [interests, setInterests] = useState<Array<string>>([]);

  const gameList =
    genre === "all" ? ["게임 장르를 선택해주세요"] : games[genre];

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

  const onGenreSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setGenre(value);
    if (value === "all") {
      setFilters({ ...filters, game: [] });
    } else {
      setFilters({ ...filters, game: [games[value][0]] });
    }
  };

  const onGameSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFilters({ ...filters, game: [value] });
  };

  const onTagSelect = (name: string, value: string) => {
    const duplicatedIndex = getDuplicated(name, value);
    if (duplicatedIndex > -1) {
      const newFilters = removeDuplicated(name, duplicatedIndex);
      setFilters(newFilters);
    } else {
      setFilters({ ...filters, [name]: [...filters[name], value] });
    }
  };

  const getDuplicated = (name: string, value: string) => {
    const filter = filters[name];
    const sameValueIndex = filter.findIndex((val) => val === value);
    if (sameValueIndex > -1) {
      return sameValueIndex;
    } else {
      return -1;
    }
  };

  const removeDuplicated = (name: string, index: number) => {
    const newFilters = { ...filters };
    const filter = newFilters[name];
    filter.splice(index, 1);
    return newFilters;
  };

  return (
    <Flex direction="column" w="80%">
      <Box mb="4">
        <Heading size="sm" mb="2">
          게임
        </Heading>
        <Grid templateColumns="4fr 6fr">
          <Select
            w="90%"
            style={{ cursor: "pointer" }}
            onChange={onGenreSelect}
          >
            <option value="all">게임 장르</option>
            {genres &&
              genres.map((genre, idx) => {
                return (
                  <option key={idx} value={genre}>
                    {genre}
                  </option>
                );
              })}
          </Select>
          <Select style={{ cursor: "pointer" }} onChange={onGameSelect}>
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
            <Tag
              key={idx}
              mr="1"
              mt='1'
              style={{ cursor: "pointer" }}
              colorScheme={
                filters.interest.includes(interest) ? "blue" : "gray"
              }
              onClick={() => onTagSelect("interest", interest)}
            >
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
            <Tag
              key={idx}
              mr="1"
              mt='1'
              style={{ cursor: "pointer" }}
              colorScheme={filters.style.includes(style) ? "blue" : "gray"}
              onClick={() => onTagSelect("style", style)}
            >
              {style}
            </Tag>
          );
        })}
      </Box>
    </Flex>
  );
};
export default ProfileFilter;
