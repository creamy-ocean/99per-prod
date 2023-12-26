import { FormValues, Noti } from "@/types/types";
import { config } from "@/utils/config";
import { changeTabName } from "@/utils/functions";
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
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Dispatch, SetStateAction } from "react";

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
    const { userId, game, style, interest, image, intro, contact } = doc.data();
    return {
      id: doc.id,
      userId,
      game,
      style,
      interest,
      image,
      intro,
      contact,
    };
  });
  return profiles;
};

export const checkIfProfileExists = async (userId: string, game: string) => {
  const profileQuery = query(
    collection(db, "friends"),
    where("userId", "==", userId),
    where("game", "==", game)
  );
  const snapshot = await getDocs(profileQuery);
  if (snapshot.empty) {
    return false;
  } else {
    return true;
  }
};

export const getGenres = async () => {
  const genresQuery = query(collection(db, "genres"));
  const snapshot = await getDocs(genresQuery);
  const [genres] = Object.values(snapshot.docs[0].data());
  return genres;
};

export const getGames = async () => {
  const gamesQuery = query(collection(db, "games"));
  const snapshot = await getDocs(gamesQuery);
  const games = snapshot.docs[0].data();
  return games;
};

export const getStyles = async (tab: string) => {
  const changedTabName = changeTabName(tab);
  const stylesQuery = query(collection(db, "styles"));
  const snapshot = await getDocs(stylesQuery);
  const styles = snapshot.docs[0].data()[changedTabName];
  return styles;
};

export const getInterests = async (tab: string) => {
  const changedTabName = changeTabName(tab);
  const interestsQuery = query(collection(db, "interests"));
  const snapshot = await getDocs(interestsQuery);
  const interests = snapshot.docs[0].data()[changedTabName];
  return interests;
};

export const addRequest = async (
  senderUserId: string,
  recipientUserId: string,
  tab: string,
  game: string
) => {
  const changedTabName = changeTabName(tab);
  const doc = await addDoc(collection(db, "requests"), {
    senderUserId,
    recipientUserId,
    tab: changedTabName,
    game,
    read: false,
  });
  return doc.id;
};

export const cancelRequest = async (requestDocId: string) => {
  await deleteDoc(doc(db, "requests", requestDocId));
};

export const getRequestId = async (
  senderUserId: string,
  recipientUserId: string,
  tab: string,
  game: string
) => {
  const changedTabName = changeTabName(tab);
  const requestQuery = query(
    collection(db, "requests"),
    where("senderUserId", "==", senderUserId),
    where("recipientUserId", "==", recipientUserId),
    where("tab", "==", changedTabName),
    where("game", "==", game)
  );
  const snapshot = await getDocs(requestQuery);
  if (snapshot.empty) {
    return null;
  } else {
    return snapshot.docs[0].id;
  }
};

export const getNotifications = async (
  userId: string,
  setNotiList: Dispatch<SetStateAction<Noti[]>>
) => {
  const q = query(
    collection(db, "requests"),
    where("recipientUserId", "==", userId),
    where("read", "==", false)
  );
  onSnapshot(q, (querySnapshot) => {
    setNotiList(
      querySnapshot.docs.map((doc) => {
        const changedTabName = changeTabName(doc.data().tab);
        console.log(doc.id);
        return { ...doc.data(), id: doc.id, tab: changedTabName } as Noti;
      })
    );
  });
};

export const updateNotiReadOption = async (notiIds: Array<string>) => {
  const batch = writeBatch(db);
  for (const notiId of notiIds) {
    const notiRef = doc(db, "requests", notiId);
    batch.update(notiRef, {
      read: true,
    });
  }
  await batch.commit();
};

export const deleteProfile = async (id: string, tab: string) => {
  const changedTabName = changeTabName(tab);
  await deleteDoc(doc(db, changedTabName, id));
};
