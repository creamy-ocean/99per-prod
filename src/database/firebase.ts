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
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
  databaseURL: config.firebase.databaseURL,
  projectId: config.firebase.projectId,
  storageBucket: config.firebase.storageBucket,
};

interface Providers {
  [key: string]: AuthProvider;
}

const app = initializeApp(firebaseConfig);
const googleProvider = new GoogleAuthProvider();
const twitterProvider = new TwitterAuthProvider();
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage();

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
  const { image, ...restValues } = values;
  const doc = await addDoc(collection(db, `${changedTabName}`), {
    userId,
    ...restValues,
    createdAt: serverTimestamp(),
  });
  if (image) {
    const result = await uploadProfileImage(
      changedTabName,
      image[0],
      userId,
      doc.id
    );
    const url = await getDownloadURL(result.ref);
    await updateDoc(doc, {
      image: url,
    });
  }
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

const uploadProfileImage = async (
  tab: string,
  image: File,
  userId: string | undefined,
  docId: string
) => {
  const storageRef = ref(storage, `${tab}/${userId}/${docId}`);
  return await uploadBytes(storageRef, image);
};

export const getProfiles = async (tab: string) => {
  const profilesQuery = query(
    collection(db, `${tab}`),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(profilesQuery);
  const profiles = snapshot.docs.map((doc) => {
    const { style, interest, image, intro, contact } = doc.data();
    return {
      userId: doc.id,
      style,
      interest,
      image,
      intro,
      contact,
    };
  });
  return profiles;
};
