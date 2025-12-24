import { getUserProfile, getUserPlaylists } from "@/lib/firebase/firestore";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { UserProfile } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { User as UserIcon, Heart } from "lucide-react";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  let profile = await getUserProfile(userId);
  const playlists = await getUserPlaylists(userId);

  if (!profile) {
    if (playlists.length > 0) {
      // Fallback if user document doesn't exist but they have playlists
      profile = {
        uid: userId,
        displayName: playlists[0].authorName,
        email: "", // Hidden/Unknown
        level: playlists[0].authorLevel || 1,
      } as UserProfile;
    } else {
      notFound();
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-12">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="shrink-0">
          {profile.photoURL ? (
            <img
              src={profile.photoURL}
              alt={profile.displayName || "User"}
              className="h-32 w-32 rounded-full border-4 border-white shadow-lg"
            />
          ) : (
            <div className="h-32 w-32 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-4xl font-bold text-indigo-600">
                {profile.displayName?.charAt(0) || "U"}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4 w-full">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {profile.displayName}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-indigo-600">
                Level {profile.level || 1}
              </Badge>
              <span className="text-slate-500">•</span>
              <span className="text-slate-600">
                {playlists.length} Playlists
              </span>
            </div>
          </div>

          {profile.bio && (
            <p className="text-slate-700 leading-relaxed max-w-2xl text-lg">
              {profile.bio}
            </p>
          )}

          <div className="grid md:grid-cols-2 gap-6 pt-4">
            {profile.subjects && profile.subjects.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                  Subjects
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.subjects.map((subject, i) => (
                    <Badge key={i} variant="secondary">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {profile.projects && profile.projects.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                  Projects
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.projects.map((project, i) => (
                    <Badge key={i} variant="outline">
                      {project}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User's Playlists */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-4">
          Playlists by {profile.displayName}
        </h2>

        {playlists.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl">
            <p className="text-slate-500">No playlists created yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {playlists.map((playlist) => (
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
                    {playlist.likes !== undefined && (
                      <div className="flex items-center gap-1 ml-auto text-slate-500">
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
        )}
      </div>
    </div>
  );
}
