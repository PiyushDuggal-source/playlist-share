"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllPlaylists } from "@/lib/firebase/firestore";
import { Playlist } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AuthGateButton } from "@/components/AuthGateButton";
import { ShareButton } from "@/components/ShareButton";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllPlaylists();
        setPlaylists(data);
      } catch (error) {
        console.error("Error loading playlists", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!query) return playlists;
    const q = query.toLowerCase();
    return playlists.filter((p) =>
      [p.name, p.description, p.authorName].some((val) =>
        (val || "").toLowerCase().includes(q)
      )
    );
  }, [playlists, query]);

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            The Syllabus Archive
          </h1>
          <p className="text-slate-600 mt-1">
            See what other students are binge-watching to pass their exams.
          </p>
        </div>
        <AuthGateButton href="/playlist/create">Create playlist</AuthGateButton>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          className="w-full sm:max-w-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Search by name, description, or author"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <p className="text-sm text-slate-500">
          {loading ? "Loading..." : `${filtered.length} result(s)`}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-40 rounded-xl border border-slate-200 bg-slate-100 animate-pulse"
              />
            ))
          : filtered.map((playlist) => (
              <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
                <Card className="h-full hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col">
                  <CardHeader>
                    <CardTitle className="line-clamp-1">
                      {playlist.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {playlist.description}
                    </CardDescription>
                  </CardHeader>
                  <CardDescription className="px-6 pb-6 text-sm text-slate-600 flex flex-wrap gap-2 items-center mt-auto">
                    <Badge variant="secondary">
                      {playlist.items?.length || 0} items
                    </Badge>
                    <Badge variant="outline">By {playlist.authorName}</Badge>
                    {playlist.likes !== undefined && (
                      <div className="flex items-center gap-1 ml-auto text-slate-500">
                        <div onClick={(e) => e.preventDefault()}>
                          <ShareButton
                            url={`/playlist/${playlist.id}`}
                            title={playlist.name}
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-slate-400 hover:text-indigo-600 mr-2"
                          />
                        </div>
                        <Heart className="h-3 w-3 fill-slate-300 text-slate-400" />
                        <span className="text-xs font-medium">
                          {playlist.likes}
                        </span>
                      </div>
                    )}
                  </CardDescription>
                </Card>
              </Link>
            ))}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
          <p className="text-lg font-medium text-slate-900">
            No one's shared anything yet.
          </p>
          <p className="text-slate-500">
            Be the first legend to drop a course playlist.
          </p>
          <div className="mt-6">
            <AuthGateButton href="/playlist/create">
              Create playlist
            </AuthGateButton>
          </div>
        </div>
      )}
    </div>
  );
}
