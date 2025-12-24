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
} from "firebase/firestore";
import { db } from "./config";
import { Playlist } from "@/types";

// Collection References
export const playlistsCollection = collection(db, "playlists");

// Playlists (courses)
export const getAllPlaylists = async (): Promise<Playlist[]> => {
  const q = query(playlistsCollection, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Playlist)
  );
};

export const getUserPlaylists = async (
  authorId: string
): Promise<Playlist[]> => {
  const q = query(playlistsCollection, where("authorId", "==", authorId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Playlist)
  );
};

export const getPlaylist = async (id: string): Promise<Playlist | null> => {
  const docRef = doc(db, "playlists", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Playlist;
  }
  return null;
};

export const createPlaylist = async (
  playlist: Omit<Playlist, "id" | "createdAt" | "updatedAt">
) => {
  const docRef = await addDoc(playlistsCollection, {
    ...playlist,
    likes: 0,
    likedBy: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  return docRef.id;
};

export const updatePlaylist = async (id: string, data: Partial<Playlist>) => {
  const docRef = doc(db, "playlists", id);
  await updateDoc(docRef, {
    ...data,
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
