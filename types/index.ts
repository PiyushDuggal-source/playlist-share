export type PlaylistItemType = "video" | "document" | "link" | "note";

export interface PlaylistItem {
  id: string;
  title: string; // display name / title
  type: PlaylistItemType;
  url?: string; // optional: only required for items like video/link/document
  description?: string; // short description or summary
  notes?: string; // freeform user notes (editor)
}

export interface Playlist {
  id: string;
  name: string; // course/playlist name
  description: string;
  authorId: string;
  authorName: string;
  authorLevel?: number;
  items: PlaylistItem[];
  isPublic: boolean; // controls visibility outside author profile
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
  level?: number; // 1-4
  subjects?: string[]; // max 4
  projects?: string[]; // max 4
  bio?: string;
}
