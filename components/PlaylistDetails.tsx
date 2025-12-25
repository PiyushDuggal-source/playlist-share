"use client";

import { Playlist } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getPlaylist } from "@/lib/firebase/firestore";
import { Card, CardContent } from "@/components/ui/Card";
import {
  ExternalLink,
  FileText,
  Video,
  PlayCircle,
  BookOpen,
} from "lucide-react";
import { EditPlaylistButton } from "@/components/EditPlaylistButton";
import { LikeButton } from "@/components/LikeButton";
import { ShareButton } from "@/components/ShareButton";
import { LevelBadge } from "@/components/LevelBadge";
import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import dynamic from "next/dynamic";

const MarkdownPreview = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default.Markdown),
  { ssr: false }
);

export function PlaylistDetails({
  playlist: initialPlaylist,
}: {
  playlist: Playlist;
}) {
  const { data: playlist } = useQuery({
    queryKey: ["playlist", initialPlaylist.id],
    queryFn: async () => {
      const data = await getPlaylist(initialPlaylist.id);
      if (!data) throw new Error("Playlist not found");
      return data;
    },
    initialData: initialPlaylist,
  });
  return (
    <div className="space-y-8 max-w-4xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-indigo-50 text-indigo-700"
              >
                Course Playlist
              </Badge>
              <span className="text-sm text-slate-500">
                Updated {new Date().toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              {playlist.name}
            </h1>
            <div className="flex items-center gap-2 text-slate-600">
              <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                {playlist.authorName?.charAt(0).toUpperCase()}
              </div>
              <Link
                href={`/users/${playlist.authorId}`}
                className="font-medium hover:text-indigo-600 hover:underline flex items-center gap-1"
              >
                By {playlist.authorName}
                {playlist.authorLevel && (
                  <LevelBadge level={playlist.authorLevel} compact />
                )}
              </Link>
              <span>•</span>
              <span>{playlist.items?.length || 0} items</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShareButton />
            <LikeButton
              playlistId={playlist.id}
              initialLikes={playlist.likes || 0}
              initialLikedBy={playlist.likedBy || []}
            />
            <EditPlaylistButton
              playlistId={playlist.id}
              authorId={playlist.authorId}
            />
          </div>
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-lg text-slate-700 leading-relaxed">
          {playlist.description}
        </div>
      </motion.div>

      <div className="space-y-6">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-slate-900 flex items-center gap-2"
        >
          <BookOpen className="h-6 w-6 text-indigo-600" />
          The Syllabus
        </motion.h2>

        <div className="space-y-4">
          {playlist.items?.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05, duration: 0.4 }}
            >
              <Card className="group hover:shadow-md transition-all duration-200 border-slate-200 hover:border-indigo-200">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="mt-1 shrink-0">
                    {item.type === "video" ? (
                      <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
                        <PlayCircle className="h-5 w-5 text-red-500" />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow space-y-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-semibold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">
                        {item.title}
                      </h3>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-slate-900 transition-colors p-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>

                    {item.notes && (
                      <div
                        className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg mt-2 border border-slate-100"
                        data-color-mode="light"
                      >
                        <span className="font-semibold text-slate-500 text-xs uppercase tracking-wider block mb-1">
                          Notes
                        </span>
                        <MarkdownPreview
                          source={item.notes}
                          style={{
                            backgroundColor: "transparent",
                          }}
                        />
                      </div>
                    )}

                    <div className="pt-2">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline inline-flex items-center gap-1"
                      >
                        Open Resource <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {(!playlist.items || playlist.items.length === 0) && (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-slate-500 italic">
                This course is empty. The professor must be late.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
