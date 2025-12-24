export type PlaylistItemType = "video" | "document";

export interface PlaylistItem {
  id: string;
  title: string;
  type: PlaylistItemType;
  url: string;
  notes?: string;
}

export interface Playlist {
  id: string;
  name: string; // course/playlist name
  description: string;
  authorId: string;
  authorName: string;
  items: PlaylistItem[];
  likes?: number;
  likedBy?: string[];
  createdAt: number; // Timestamp
  updatedAt: number; // Timestamp
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}
