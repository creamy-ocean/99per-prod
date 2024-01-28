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
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  documentId,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
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

export const login = (platform: string, callback: () => void) => {
  signInWithPopup(auth, providers[platform])
    .then(({ user }) => {
      getUserState(user.uid).then((userState) => {
        !userState && addUserState(user.uid, "joined");
      });
      callback();
      // getUsersFriends(user.uid).then((friends) => {
      //   !friends && updateUsersFriends(user.uid, []);
      // });
    })
    .catch((err) => {
      // 유저가 로그인 팝업을 닫으면 콜백 함수(로딩 false로 만드는 함수) 실행
      if (err.code === "auth/popup-closed-by-user") callback();
    });
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
    return "joined";
  }
};

// const getUsersFriends = async (userId: string) => {
//   const docSnap = await getDoc(doc(db, "users", userId));
//   if (docSnap.exists()) {
//     const usersFriends = docSnap.data().friends;
//     return usersFriends;
//   } else {
//     return null;
//   }
// };

// const updateUsersFriends = async (
//   userId: string | undefined,
//   friendsArray: Array<string> | FieldValue
// ) => {
//   await updateDoc(doc(db, `users/${userId}`), {
//     friends: friendsArray,
//   });
// };

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
      image,
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

export const getProfiles = async (
  isOwner: boolean,
  tab: string,
  userId: string,
  lastDoc: DocumentData | null
) => {
  const constraints = [];
  // 일반 프로필 목록과 내 프로필 목록 구별
  isOwner
    ? constraints.push(where("userId", "==", userId))
    : constraints.push(where("userId", "!=", userId), limit(6));
  // 마지막 문서가 있는 경우(프로필 목록이 있는 경우)
  lastDoc && constraints.push(startAfter(lastDoc));
  const profilesQuery = query(
    collection(db, `${tab}`),
    orderBy("userId"),
    orderBy("createdAt", "desc"),
    ...constraints,
    limit(6)
  );
  const snapshot = await getDocs(profilesQuery);
  const lastVisible = snapshot.docs[snapshot.docs.length - 1];
  const profilesData = snapshot.docs.map((doc) => {
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
  return { profilesData, lastVisible };
};

export const getBlockedUsers = async (userId: string) => {
  const userBlockedQuery = query(
    collection(db, `blocking/${userId}/userBlocked`)
  );
  const blockedUserQuery = query(
    collection(db, `blocking/${userId}/userBlocking`)
  );
  const userBlockedSnapshot = await getDocs(userBlockedQuery);
  const usersBlocked = userBlockedSnapshot.docs.map((doc) => {
    return doc.data().userId;
  });
  const blockedUserSnapshot = await getDocs(blockedUserQuery);
  const blockedUsers = blockedUserSnapshot.docs.map((doc) => {
    return doc.data().userId;
  });
  return usersBlocked.concat(blockedUsers);
};

export const getProfileId = async (
  tab: string,
  userId: string | undefined,
  game: string
) => {
  const profileQuery = query(
    collection(db, tab),
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
  recipientUserProfileId: string,
  senderUserProfileId: string,
  senderUserId: string,
  recipientUserId: string,
  tab: string,
  game: string
) => {
  const changedTabName = changeTabName(tab);
  const doc = await addDoc(collection(db, "requests"), {
    recipientUserProfileId,
    senderUserProfileId,
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
      image,
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
  game: string,
  userId: string | undefined
) => {
  console.log(userId);
  if (!userId) return;
  const changedTabName = changeTabName(tab);
  await deleteDoc(doc(db, changedTabName, id));
  await deleteRequest(null, "recipientUserId", userId, changedTabName, game);
  await deleteRequest(null, "senderUserId", userId, changedTabName, game);

  await deleteRelationship(id, changedTabName, userId, game);
};

export const deleteRequest = async (
  requestId: string | null,
  fieldName?: string,
  userId?: string,
  tab?: string,
  game?: string
) => {
  console.log("deleteRequest");
  if (requestId) {
    deleteDoc(doc(db, `requests/${requestId}`));
  } else if (fieldName) {
    const constrainsts = [];
    if (tab !== "friends")
      constrainsts.push(
        where("tab", "==", tab),
        where("recipientUserId", "==", userId)
      );
    const requestQuery = query(
      collection(db, "requests"),
      where(fieldName, "==", userId),
      where("game", "==", game),
      ...constrainsts
    );
    const snapshot = await getDocs(requestQuery);
    if (snapshot.empty) {
      return;
    } else {
      snapshot.docs.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    }
  }
};

const deleteRelationship = async (
  profileId: string,
  tab: string,
  userId: string,
  game: string
) => {
  const ownerQuery = query(
    collection(db, `relationships/${tab}/${userId}`),
    where("game", "==", game)
  );
  const ownerSnapshot = await getDocs(ownerQuery);
  // 해당 유저가 친구 요청하거나 요청 받은 모든 유저의 관계 삭제
  ownerSnapshot.docs.forEach(async (doc) => {
    const pairUserId = doc.data().pairUserId;
    // 친구 프로필을 삭제하는 경우 친구, 파티, 길드 관계 모두 삭제
    if (tab === "friends") {
      const friendsPairQuery = query(
        collection(db, `relationships/${tab}/${pairUserId}`),
        where("pairProfileId", "==", profileId),
        where("game", "==", game)
      );
      const friendsPairSnapshot = await getDocs(friendsPairQuery);
      deleteDoc(friendsPairSnapshot.docs[0].ref);
      const partiesPairQuery = query(
        collection(db, `relationships/parties/${pairUserId}`),
        where("pairProfileId", "==", profileId),
        where("game", "==", game)
      );
      const partiesPairSnapshot = await getDocs(partiesPairQuery);
      deleteDoc(partiesPairSnapshot.docs[0].ref);
      const guildsPairQuery = query(
        collection(db, `relationships/guilds/${pairUserId}`),
        where("pairProfileId", "==", profileId),
        where("game", "==", game)
      );
      const guildsPairSnapshot = await getDocs(guildsPairQuery);
      deleteDoc(guildsPairSnapshot.docs[0].ref);
    } else {
      const pairQuery = query(
        collection(db, `relationships/${tab}/${pairUserId}`),
        where("pairProfileId", "==", profileId),
        where("game", "==", game)
      );
      const pairSnapshot = await getDocs(pairQuery);
      deleteDoc(pairSnapshot.docs[0].ref);
    }
  });
  ownerSnapshot.docs.forEach(async (doc) => {
    await deleteDoc(doc.ref);
  });
};

export const getProfilesFromRequests = async (
  userId: string | undefined,
  type: string,
  tab: string
) => {
  const { senderUserProfileIds, recipientUserProfileIds } =
    await getProfileIdsFromRequests(userId, type, tab);
  if (
    isArrayEmpty(senderUserProfileIds) ||
    isArrayEmpty(recipientUserProfileIds)
  ) {
    return [];
  }
  const profilesQuery = query(
    collection(db, type === "received" ? "friends" : tab),
    where(
      documentId(),
      "in",
      type === "received" ? senderUserProfileIds : recipientUserProfileIds
    )
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
  const recipientUserProfileIds = snapshot.docs.map((doc) => {
    const { recipientUserProfileId } = doc.data();
    return recipientUserProfileId;
  });
  const senderUserProfileIds = snapshot.docs.map((doc) => {
    const { senderUserProfileId } = doc.data();
    return senderUserProfileId;
  });
  return { recipientUserProfileIds, senderUserProfileIds };
};

export const addRelationship = async (
  pairUserProfileId: string,
  userId: string | undefined,
  pairUserId: string,
  tab: string,
  game: string
) => {
  const changedTabName = changeTabName(tab);
  await addDoc(collection(db, `relationships/${changedTabName}/${userId}`), {
    type: "recipient",
    pairProfileId: pairUserProfileId,
    pairUserId: pairUserId,
    createdAt: serverTimestamp(),
    game,
  });
  const userProfileId = await getProfileId(changedTabName, userId, game);
  await addDoc(
    collection(db, `relationships/${changedTabName}/${pairUserId}`),
    {
      type: "sender",
      pairProfileId: userProfileId,
      pairUserId: userId,
      createdAt: serverTimestamp(),
      game,
    }
  );
  // updateUsersFriends(userId, arrayUnion(pairUserId));
  // updateUsersFriends(pairUserId, arrayUnion(userId));
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
      const { pairProfileId, type } = doc.data();
      const profile = await getProfileById(
        pairProfileId,
        tab !== "friends" && type === "sender" ? tab : "friends"
      );
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

export const getRelativeProfileIds = async (tab: string, userId: string) => {
  const profilesQuery = query(collection(db, `relationships/${tab}/${userId}`));
  const snapshot = await getDocs(profilesQuery);
  if (snapshot.empty) {
    return [];
  } else {
    const profileIds = snapshot.docs.map((doc) => doc.data().pairProfileId);
    return profileIds;
  }
};

export const checkIfProfileExists = async (
  tab: string,
  userId: string,
  game: string
) => {
  const changedTabName = changeTabName(tab);
  const userQuery = query(
    collection(db, `${changedTabName}`),
    where("userId", "==", userId),
    where("game", "==", game)
  );
  const snapshot = await getDocs(userQuery);
  if (snapshot.empty) {
    return false;
  } else {
    return true;
  }
};

export const blockUser = async (
  tab: string,
  userId: string,
  blockedUserProfileId: string,
  blockedUserId: string
) => {
  const blockingUserQuery = query(
    collection(db, `relationships/${tab}/${userId}`),
    where("pairProfileId", "==", blockedUserProfileId)
  );
  const blockingUserSnapshot = await getDocs(blockingUserQuery);
  blockingUserSnapshot.docs.forEach(async (doc) => {
    await deleteDoc(doc.ref);
  });
  const blockedUserQuery = query(
    collection(db, `relationships/${tab}/${blockedUserId}`)
  );
  const blockedUserSnapshot = await getDocs(blockedUserQuery);
  blockedUserSnapshot.docs.forEach(async (doc) => {
    await deleteDoc(doc.ref);
  });
  await addDoc(collection(db, `blocking/${userId}/userBlocking`), {
    userId: blockedUserId,
  });
  await addDoc(collection(db, `blocking/${blockedUserId}/userBlocked`), {
    userId,
  });
};
