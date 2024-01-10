import { FormValues, Noti, Profile } from "@/types/types";
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

export const getProfileId = async (userId: string, game: string) => {
  const profileQuery = query(
    collection(db, "friends"),
    where("userId", "==", userId),
    where("game", "==", game)
  );
  const snapshot = await getDocs(profileQuery);
  if (snapshot.empty) {
    return null;
  } else {
    return snapshot.docs[0].id;
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

export const deleteRequest = async (
  requestId?: string,
  fieldName?: string,
  userId?: string
) => {
  console.log("deleteRequest");
  if (requestId) {
    deleteDoc(doc(db, `requests/${requestId}`));
  } else if (fieldName) {
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
  }
};

export const getProfilesFromRequests = async (
  userId: string | undefined,
  type: string,
  tab: string
) => {
  const profileIds = await getProfileIdsFromRequests(userId, type, tab);
  if (isArrayEmpty(profileIds)) {
    return [];
  }
  const profilesQuery = query(
    collection(db, type === "received" ? "friends" : tab),
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
};

const getProfileIdsFromRequests = async (
  userId: string | undefined,
  type: string,
  tab: string
) => {
  const requestsQuery = query(
    collection(db, "requests"),
    where(
      type === "received" ? "recipientUserId" : "senderUserId",
      "==",
      userId
    ),
    where("tab", "==", tab)
  );

  const snapshot = await getDocs(requestsQuery);
  const profileIds = snapshot.docs.map((doc) => {
    const { profileId } = doc.data();
    return profileId;
  });
  return profileIds;
};

export const addRelationship = async (
  profileId: string,
  userId: string | undefined,
  friendUserId: string,
  tab: string
) => {
  const changedTabName = changeTabName(tab);
  await addDoc(collection(db, `relationships/${changedTabName}/${userId}`), {
    profileId,
    createdAt: serverTimestamp(),
  });
  await addDoc(
    collection(db, `relationships/${changedTabName}/${friendUserId}`),
    {
      profileId,
      createdAt: serverTimestamp(),
    }
  );
};

export const getProfilesFromRelationships = async (
  tab: string,
  colName: string,
  docName: string
) => {
  const profilesQuery = query(
    collection(db, `${colName}/${tab}/${docName}`),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(profilesQuery);
  if (snapshot.empty) {
    return [];
  }
  const profiles = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const { profileId } = doc.data();
      const profile = await getProfileById(profileId, tab);
      if (profile) {
        return profile as Profile;
      } else {
        return {} as Profile;
      }
    })
  );
  return isArrayEmpty(Object.keys(profiles[0])) ? [] : profiles;
};

const getProfileById = async (profileId: string, tab: string) => {
  const docSnap = await getDoc(doc(db, `${tab}`, profileId));
  if (docSnap.exists()) {
    const { id, createdAt, ...rest } = docSnap.data();
    return { id: docSnap.id, ...rest };
  } else {
    return {};
  }
};

export const blockUser = async (
  tab: string,
  userId: string,
  blockedUserProfileId: string,
  blockedUserId: string
) => {
  const userQuery = query(
    collection(db, `relationships/${tab}/${userId}`),
    where("profileId", "==", blockedUserProfileId)
  );
  const snapshot = await getDocs(userQuery);
  snapshot.docs.forEach(async (doc) => {
    await deleteDoc(doc.ref);
  });
  await addDoc(collection(db, `blocking/${userId}/userBlocking`), {
    userId: blockedUserId,
  });
  await addDoc(collection(db, `blocking/${blockedUserId}/userBlocked`), {
    userId,
  });
};
