"use client";

import { useEffect, useState } from "react";
import { getAllUsers } from "@/lib/firebase/firestore";
import { UserProfile } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { User as UserIcon } from "lucide-react";
import { LevelBadge } from "@/components/LevelBadge";

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error loading users", error);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Community</h1>
        <p className="text-slate-600 mt-1">
          Meet the brilliant minds behind the playlists.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-48 rounded-xl border border-slate-200 bg-slate-100 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Link key={user.uid} href={`/users/${user.uid}`}>
              <Card className="h-full hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="h-12 w-12 rounded-full border border-slate-200"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <UserIcon className="h-6 w-6" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg">
                      {user.displayName}
                    </CardTitle>
                    <LevelBadge level={user.level || 1} />
                  </div>
                </CardHeader>
                <CardDescription className="px-6 pb-6 flex-1">
                  {user.bio ? (
                    <p className="line-clamp-3 text-slate-600">{user.bio}</p>
                  ) : (
                    <p className="text-slate-400 italic">No bio yet.</p>
                  )}
                </CardDescription>
                {(user.subjects?.length || 0) > 0 && (
                  <div className="px-6 pb-6 pt-0 flex flex-wrap gap-2">
                    {user.subjects?.slice(0, 3).map((subject, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                    {(user.subjects?.length || 0) > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{user.subjects!.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
