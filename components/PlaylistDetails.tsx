"use client";

import { Playlist } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getPlaylist } from "@/lib/firebase/firestore";
import { Card, CardContent } from "@/components/ui/Card";
import { ExternalLink, FileText, PlayCircle, BookOpen } from "lucide-react";
import { EditPlaylistButton } from "@/components/EditPlaylistButton";
import { LikeButton } from "@/components/LikeButton";
import { ShareButton } from "@/components/ShareButton";
import { LevelBadge } from "@/components/LevelBadge";
import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import dynamic from "next/dynamic";
import { getYouTubeEmbedUrl } from "@/lib/utils";

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
    <div className="max-w-4xl px-4 py-8 mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="text-indigo-700 bg-indigo-50"
              >
                Course Playlist
              </Badge>
              <span className="text-sm text-slate-500">
                Updated {new Date().toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-slate-900">
              {playlist.name}
            </h1>
            <div className="flex items-center gap-2 text-slate-600">
              <div className="flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full bg-slate-200 text-slate-600">
                {playlist.authorName?.charAt(0).toUpperCase()}
              </div>
              <Link
                href={`/users/${playlist.authorId}`}
                className="flex items-center gap-1 font-medium hover:text-indigo-600 hover:underline"
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

        <div className="p-6 text-lg leading-relaxed border bg-slate-50 rounded-2xl border-slate-100 text-slate-700">
          {playlist.description}
        </div>
      </motion.div>

      <div className="space-y-6">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 text-2xl font-bold text-slate-900"
        >
          <BookOpen className="w-6 h-6 text-indigo-600" />
          The Syllabus
        </motion.h2>

        <div className="space-y-4">
          {playlist.items?.map((item, index) => {
            const embedUrl = getYouTubeEmbedUrl(item.url);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05, duration: 0.4 }}
              >
                <Card className="transition-all duration-200 group hover:shadow-md border-slate-200 hover:border-indigo-200">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-center min-w-0 gap-3 sm:items-start">
                        {item.type === "video" ? (
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50">
                            <PlayCircle className="w-5 h-5 text-red-500" />
                          </div>
                        ) : item.type === "document" ? (
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50">
                            <FileText className="w-5 h-5 text-blue-500" />
                          </div>
                        ) : item.type === "link" ? (
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50">
                            <ExternalLink className="w-5 h-5 text-emerald-600" />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50">
                            <BookOpen className="w-5 h-5 text-indigo-600" />
                          </div>
                        )}
                        <h3 className="flex-1 min-w-0 text-lg font-semibold transition-colors text-slate-900 group-hover:text-indigo-600">
                          {item.title}
                        </h3>
                      </div>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="self-start hidden p-1 transition-colors sm:block text-slate-400 hover:text-slate-900 sm:self-auto"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    {(item.description || item.notes) && (
                      <div
                        className="p-3 text-sm border rounded-lg text-slate-600 bg-slate-50 border-slate-100"
                        data-color-mode="light"
                      >
                        <span className="block mb-1 text-xs font-semibold tracking-wider uppercase text-slate-500">
                          Description
                        </span>
                        <MarkdownPreview
                          source={item.description || item.notes || ""}
                          style={{
                            backgroundColor: "transparent",
                          }}
                        />
                      </div>
                    )}

                    {embedUrl && (
                      <div className="relative w-full overflow-hidden rounded-xl aspect-video">
                        <iframe
                          src={embedUrl}
                          title={`YouTube video: ${item.title}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          loading="lazy"
                          className="absolute inset-0 w-full h-full"
                        />
                      </div>
                    )}

                    {item.url && (
                      <div className="pt-1">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                        >
                          Open Resource <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {(!playlist.items || playlist.items.length === 0) && (
            <div className="py-12 text-center border border-dashed bg-slate-50 rounded-xl border-slate-200">
              <p className="italic text-slate-500">
                This course is empty. The professor must be late.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
