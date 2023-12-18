export interface FormValues {
  game: string;
  interest: Array<string | undefined>;
  style: Array<string | undefined>;
  image?: FileList;
  intro: string;
  contact: string;
}

export interface Profile {
  [key: string]: string | Array<string>;
  userId: string;
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
