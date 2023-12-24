import { useAuthContext } from "@/context/AuthContext";
import { logout } from "@/database/firebase";
import { AddIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

interface Props {
  children: {
    name: string;
    href: string;
  };
}

const Links = [
  { name: "친구", href: "/friends" },
  { name: "파티", href: "/parties" },
  { name: "길드", href: "/guilds" },
];

const NavLink = ({ children }: Props) => {
  const { name, href } = children;
  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        backgroundColor: "brand.50",
      }}
      href={href}
      fontWeight="bold"
      color="white"
    >
      {name}
    </Box>
  );
};

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useAuthContext();

  return (
    <>
      <Box backgroundColor="brand.100" px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box>로고</Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink key={link.name}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Link to="/newProfile">
              <Button
                variant={"solid"}
                backgroundColor="brand.50"
                size={"sm"}
                mr={2}
                leftIcon={<AddIcon />}
              >
                프로필 생성
              </Button>
            </Link>
            <Popover>
              <PopoverTrigger>
                <Button background="none" mr="2">
                  <i className="fa-solid fa-bell"></i>
                </Button>
              </PopoverTrigger>
              <PopoverContent mt="1">
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>알림</PopoverHeader>
                <PopoverBody>알림 내용</PopoverBody>
              </PopoverContent>
            </Popover>
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                {user?.photoURL ? (
                  <Avatar size={"sm"} src={user.photoURL} />
                ) : (
                  <Box>{user?.displayName?.substring(0, 2)}</Box>
                )}
              </MenuButton>
              <MenuList>
                <Link to="/profiles">
                  <MenuItem>내 프로필</MenuItem>
                </Link>
                <MenuDivider />
                <MenuItem onClick={logout}>로그아웃</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link.name}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};

export default Header;
