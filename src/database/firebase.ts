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
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore";

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
const db = getFirestore(app);

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

const addUserState = async (userId: string, userState: string) => {
  await setDoc(doc(db, "users", userId), {
    state: userState,
  });
};

export const getUserState = async (userId: string) => {
  const docSnap = await getDoc(doc(db, "users", userId));
  if (docSnap.exists()) {
    const userState = docSnap.data().state;
    return userState;
  } else {
    return null;
  }
};

export const addProfile = async (
  tab: string,
  userId: string | undefined,
  values: FormValues
) => {
  const changedTabName = changeTabName(tab);
  const { game, ...restValues } = values;
  await addDoc(collection(db, `profiles/${changedTabName}/${game}`), {
    userId,
    ...restValues,
  });
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
