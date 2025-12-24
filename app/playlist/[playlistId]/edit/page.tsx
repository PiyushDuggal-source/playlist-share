"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { getPlaylist } from "@/lib/firebase/firestore";
import { Playlist } from "@/types";
import { PlaylistForm } from "@/components/PlaylistForm";
import { useAuth } from "@/hooks/useAuth";

export default function EditPlaylistPage({
  params,
}: {
  params: Promise<{ playlistId: string }>;
}) {
  const { playlistId } = use(params);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const playlistData = await getPlaylist(playlistId);
        setPlaylist(playlistData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [playlistId]);

  useEffect(() => {
    if (!authLoading && !loading) {
      if (!user) {
        router.push("/");
        return;
      }
      if (playlist && playlist.authorId !== user.uid) {
        alert("You can only edit your own playlists.");
        router.push(`/playlist/${playlistId}`);
      }
    }
  }, [user, authLoading, loading, playlist, playlistId, router]);

  if (authLoading || loading) {
    return <div>Loading...</div>;
  }

  if (!playlist) {
    return <div>Playlist not found</div>;
  }

  if (user?.uid !== playlist.authorId) {
    return null; // Will redirect
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">
          Refine the curriculum.
        </h1>
        <p className="text-slate-600">
          Update your course details or rearrange the items.
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <PlaylistForm initialData={playlist} />
      </div>
    </div>
  );
}
