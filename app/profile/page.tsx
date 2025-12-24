"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUserPlaylists, deletePlaylist } from "@/lib/firebase/firestore";
import { Playlist } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { ProfileEditor } from "@/components/ProfileEditor";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Trash2, Pencil } from "lucide-react";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/");
      } else {
        loadPlaylists(user.uid);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  const loadPlaylists = async (uid: string) => {
    try {
      const data = await getUserPlaylists(uid);
      setPlaylists(data);
    } catch (error) {
      console.error("Error loading playlists", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure? This will delete the course for everyone."
    );
    if (!confirmDelete) return;
    try {
      await deletePlaylist(id);
      setPlaylists((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting playlist", error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-slate-400">
        Loading your stash...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-12 container mx-auto px-4 py-10">
      <ProfileEditor user={user} />

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Your Stash</h2>
            <p className="text-slate-600 mt-1">
              The courses you're teaching the world (or just saving for later).
            </p>
          </div>
          <Link href="/playlist/create">
            <Button>Create Playlist</Button>
          </Link>
        </div>

        {playlists.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-lg font-medium text-slate-900">
              You haven't created anything yet.
            </p>
            <p className="text-slate-500 mt-1">
              The world is waiting for your genius.
            </p>
            <div className="mt-6">
              <Link href="/playlist/create">
                <Button variant="outline">Start your first course</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {playlists.map((playlist) => (
              <Card
                key={playlist.id}
                className="flex flex-col hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="line-clamp-1">
                    {playlist.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {playlist.description}
                  </CardDescription>
                </CardHeader>
                <CardDescription className="px-6 pb-4 text-sm text-slate-600 flex flex-wrap gap-2 items-center mt-auto">
                  <Badge variant="secondary">
                    {playlist.items?.length || 0} items
                  </Badge>
                </CardDescription>
                <div className="px-6 pb-6 flex gap-2">
                  <Link href={`/playlist/${playlist.id}`} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      View
                    </Button>
                  </Link>
                  <Link
                    href={`/playlist/${playlist.id}/edit`}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full" size="sm">
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(playlist.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
