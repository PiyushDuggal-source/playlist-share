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
      const data = await getUserPlaylists(uid, { includePrivate: true });
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
    <div className="container px-4 py-10 mx-auto space-y-12">
      <ProfileEditor user={user} />

      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Your Stash</h2>
            <p className="mt-1 text-slate-600">
              The courses you're teaching the world (or just saving for later).
            </p>
          </div>
          <Link href="/playlist/create">
            <Button>Create Playlist</Button>
          </Link>
        </div>

        {playlists.length === 0 ? (
          <div className="py-16 text-center bg-white border border-dashed rounded-xl border-slate-300">
            <p className="text-lg font-medium text-slate-900">
              You haven't created anything yet.
            </p>
            <p className="mt-1 text-slate-500">
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
                className="flex flex-col transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-1">
                      {playlist.name}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className={
                        playlist.isPublic
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-amber-200 bg-amber-50 text-amber-700"
                      }
                    >
                      {playlist.isPublic ? "Public" : "Private"}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {playlist.description}
                  </CardDescription>
                </CardHeader>
                <CardDescription className="flex flex-wrap items-center gap-2 px-6 pb-4 mt-auto text-sm text-slate-600">
                  <Badge variant="secondary">
                    {playlist.items?.length || 0} items
                  </Badge>
                </CardDescription>
                <div className="flex gap-2 px-6 pb-6">
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
                      <Pencil className="w-4 h-4 mr-2" /> Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(playlist.id)}
                  >
                    <Trash2 className="w-4 h-4" />
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
