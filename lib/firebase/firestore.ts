import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  increment,
  setDoc,
} from "firebase/firestore";
import { db } from "./config";
import { Playlist, UserProfile } from "@/types";

const hydratePlaylist = (id: string, data: any): Playlist => {
  const normalized = {
    ...data,
    isPublic: data?.isPublic ?? true,
  };

  return {
    id,
    ...normalized,
  } as Playlist;
};

// Collection References
export const playlistsCollection = collection(db, "playlists");
export const usersCollection = collection(db, "users");

// User Profile
export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { uid: docSnap.id, ...docSnap.data() } as UserProfile;
  }
  return null;
};

export const updateUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
) => {
  const docRef = doc(db, "users", uid);
  await setDoc(docRef, { ...data, uid }, { merge: true });
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  const snapshot = await getDocs(usersCollection);
  return snapshot.docs.map(
    (doc) => ({ uid: doc.id, ...doc.data() } as UserProfile)
  );
};

// Playlists (courses)
export const getAllPlaylists = async (): Promise<Playlist[]> => {
  const q = query(playlistsCollection, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((docSnapshot) => hydratePlaylist(docSnapshot.id, docSnapshot.data()))
    .filter((playlist) => playlist.isPublic);
};

export const getUserPlaylists = async (
  authorId: string,
  options: { includePrivate?: boolean } = {}
): Promise<Playlist[]> => {
  const { includePrivate = false } = options;
  const q = query(playlistsCollection, where("authorId", "==", authorId));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((docSnapshot) => hydratePlaylist(docSnapshot.id, docSnapshot.data()))
    .filter((playlist) => includePrivate || playlist.isPublic);
};

export const getPlaylist = async (id: string): Promise<Playlist | null> => {
  const docRef = doc(db, "playlists", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return hydratePlaylist(docSnap.id, docSnap.data());
  }
  return null;
};

export const updateAuthorDetailsOnPlaylists = async (
  authorId: string,
  data: { authorName?: string; authorLevel?: number }
) => {
  const q = query(playlistsCollection, where("authorId", "==", authorId));
  const snapshot = await getDocs(q);
  const updates = snapshot.docs.map((playlistDoc) =>
    updateDoc(doc(db, "playlists", playlistDoc.id), {
      ...data,
      updatedAt: Date.now(),
    })
  );
  await Promise.all(updates);
};

export const createPlaylist = async (
  playlist: Omit<Playlist, "id" | "createdAt" | "updatedAt">
) => {
  const docRef = await addDoc(playlistsCollection, {
    ...playlist,
    isPublic: playlist.isPublic ?? true,
    likes: 0,
    likedBy: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  return docRef.id;
};

export const updatePlaylist = async (id: string, data: Partial<Playlist>) => {
  const docRef = doc(db, "playlists", id);
  const { isPublic, ...rest } = data;
  await updateDoc(docRef, {
    ...rest,
    ...(typeof isPublic === "boolean" ? { isPublic } : {}),
    updatedAt: Date.now(),
  });
};

export const deletePlaylist = async (id: string) => {
  const docRef = doc(db, "playlists", id);
  await deleteDoc(docRef);
};

export const likePlaylist = async (id: string, userId: string) => {
  const docRef = doc(db, "playlists", id);
  await updateDoc(docRef, {
    likedBy: arrayUnion(userId),
    likes: increment(1),
    updatedAt: Date.now(),
  });
};

export const unlikePlaylist = async (id: string, userId: string) => {
  const docRef = doc(db, "playlists", id);
  await updateDoc(docRef, {
    likedBy: arrayRemove(userId),
    likes: increment(-1),
    updatedAt: Date.now(),
  });
};
