import { FormValues } from "@/types/types";
import { config } from "@/utils/config";
import { initializeApp } from "firebase/app";
import {
  AuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { get, getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
  databaseURL: config.firebase.databaseURL,
  projectId: config.firebase.projectId,
};

interface Providers {
  [key: string]: AuthProvider;
}

const app = initializeApp(firebaseConfig);
const googleProvider = new GoogleAuthProvider();
const twitterProvider = new TwitterAuthProvider();
const auth = getAuth();
const database = getDatabase(app);

const providers: Providers = {
  google: googleProvider,
  twitter: twitterProvider,
};

export const login = (platform: string) => {
  signInWithPopup(auth, providers[platform])
    .then((userCredential) => {
      addUserState(userCredential.user.uid, "joined");
    })
    .catch(console.error);
};

export const logout = () => {
  signOut(auth).catch(console.error);
};

export const onUserStateChanged = (callback: any) => {
  onAuthStateChanged(auth, async (user) => {
    const userState = user ? await getUserState(user.uid) : null;
    callback({ ...user, userState });
  });
};

const addUserState = (userId: string, userState: string) => {
  set(ref(database, "users/" + userId), {
    state: userState,
  });
};

export const getUserState = async (userId: string) => {
  return get(ref(database, `users/${userId}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const userState = snapshot.val().state;
        return userState;
      } else {
        return null;
      }
    })
    .catch(console.error);
};

export const addProfile = async (
  tab: string,
  userId: string | undefined,
  values: FormValues
) => {
  const tabName = changeTabName(tab);
  const { game, ...restValues } = values;
  const profileExists = await getProfile(tabName, game, userId);
  if (profileExists) throw new Error("해당 게임의 프로필이 이미 존재합니다");
  set(ref(database, `profiles/${tabName}/${game}/${userId}`), {
    ...restValues,
  });
};

const getProfile = async (
  tab: string,
  game: string,
  userId: string | undefined
) => {
  return get(ref(database, `profiles/${tab}/${game}/${userId}`)).then(
    (snapshot) => {
      if (snapshot.exists()) {
        return true;
      } else {
        return false;
      }
    }
  );
};

const changeTabName = (tab: string) => {
  switch (tab) {
    case "친구":
      return "friends";
    case "파티":
      return "parties";
    case "길드":
      return "guilds";
    default:
      return "";
  }
};
