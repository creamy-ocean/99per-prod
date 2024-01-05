import { FormValues, Noti } from "@/types/types";
import { config } from "@/utils/config";
import { changeTabName, isArrayEmpty } from "@/utils/functions";
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
  documentId,
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
    .then(({ user }) => {
      getUserState(user.uid).then((userState) => {
        !userState && addUserState(user.uid, "joined");
      });
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
    const { userId, game, genre, style, interest, image, intro, contact } =
      doc.data();
    return {
      id: doc.id,
      userId,
      genre,
      tab: changeTabName(tab),
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
  profileId: string,
  senderUserId: string,
  recipientUserId: string,
  tab: string,
  game: string
) => {
  const changedTabName = changeTabName(tab);
  const doc = await addDoc(collection(db, "requests"), {
    profileId,
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

export const updateProfile = async (
  userId: string | undefined,
  docId: string,
  tab: string,
  values: FormValues
) => {
  const changedTabName = changeTabName(tab);
  const { image, ...restValues } = values;
  const profileRef = doc(db, changedTabName, docId);
  await updateDoc(profileRef, { ...restValues });
  if (image) {
    const result = await uploadProfileImage(
      changedTabName,
      image[0],
      userId,
      docId
    );
    const url = await getDownloadURL(result.ref);
    await updateDoc(profileRef, {
      image: url,
    });
  }
};

export const deleteProfile = async (
  id: string,
  tab: string,
  userId: string | undefined
) => {
  console.log(userId);
  if (!userId) return;
  const changedTabName = changeTabName(tab);
  await deleteDoc(doc(db, changedTabName, id));
  await deleteRequest("recipientUserId", userId);
  await deleteRequest("senderUserId", userId);
};

const deleteRequest = async (fieldName: string, userId: string) => {
  const requestQuery = query(
    collection(db, "requests"),
    where(fieldName, "==", userId)
  );
  const snapshot = await getDocs(requestQuery);
  if (snapshot.empty) {
    return;
  } else {
    return await deleteDoc(doc(db, "requests", snapshot.docs[0].id));
  }
};

export const getProfilesFromRequests = async (
  userId: string | undefined,
  type: string,
  tab: string
) => {
  if (type === "received") {
    const { senderUserIds, senderUserTabs } =
      await getSenderUserInfosFromRequests(userId);
    if (isArrayEmpty(Object.keys(senderUserIds))) {
      return [];
    }
    const profilesQuery = query(
      // 받은 요청의 경우 파티, 길드 요청도 친구 프로필로 노출되어야 하기 때문
      collection(db, "friends"),
      where("userId", "in", senderUserIds)
    );
    const snapshot = await getDocs(profilesQuery);
    const profiles = snapshot.docs.map((doc, idx) => {
      const { userId, genre, game, style, interest, image, intro, contact } =
        doc.data();
      return {
        id: doc.id,
        userId,
        genre,
        tab: changeTabName(senderUserTabs[idx]),
        game,
        style,
        interest,
        image,
        intro,
        contact,
      };
    });
    return profiles;
  } else {
    const profileIds = await getProfileIdsFromRequests(userId);
    if (isArrayEmpty(profileIds)) {
      return [];
    }
    const profilesQuery = query(
      collection(db, tab),
      where(documentId(), "in", profileIds)
    );
    const snapshot = await getDocs(profilesQuery);
    const profiles = snapshot.docs.map((doc) => {
      const { userId, game, genre, style, interest, image, intro, contact } =
        doc.data();
      return {
        id: doc.id,
        userId,
        genre,
        tab: changeTabName(tab),
        game,
        style,
        interest,
        image,
        intro,
        contact,
      };
    });
    return profiles;
  }
};

const getProfileIdsFromRequests = async (userId: string | undefined) => {
  const requestsQuery = query(
    collection(db, "requests"),
    where("senderUserId", "==", userId),
    where("read", "==", false)
  );
  const snapshot = await getDocs(requestsQuery);
  const profileIds = snapshot.docs.map((doc) => {
    const { profileId } = doc.data();
    return profileId;
  });
  return profileIds;
};

const getSenderUserInfosFromRequests = async (userId: string | undefined) => {
  const requestsQuery = query(
    collection(db, "requests"),
    where("recipientUserId", "==", userId),
    where("read", "==", false)
  );
  const snapshot = await getDocs(requestsQuery);
  const senderUserIds = snapshot.docs.map((doc) => {
    const { senderUserId } = doc.data();
    return senderUserId;
  });
  const senderUserTabs = snapshot.docs.map((doc) => {
    const { tab } = doc.data();
    return tab;
  });
  return { senderUserIds, senderUserTabs };
};
