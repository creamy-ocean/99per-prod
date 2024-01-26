import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

export interface UserInterface extends User {
  userState: string | null;
}

export interface FormValues {
  game: string;
  interest: Array<string | undefined>;
  style: Array<string | undefined>;
  image?: File;
  intro: string;
  contact: string;
}

export interface Profile {
  [key: string]: any;
  id: string;
  createdAt: Timestamp;
  userId: string;
  game: string;
  style: Array<string>;
  interest: Array<string>;
  image: string;
  intro: string;
  contact: string;
}

export interface Games {
  [key: string]: Array<string>;
}

export interface Filters {
  [key: string]: Array<string>;
}

export interface Noti {
  id: string;
  recipientUserId: string;
  senderUserId: string;
  tab: string;
  game: string;
  read: boolean;
}
