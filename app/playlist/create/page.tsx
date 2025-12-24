"use client";

import { useEffect, useState, Suspense } from "react";
import { PlaylistForm } from "@/components/PlaylistForm";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

function CreatePlaylistContent() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/");
      } else {
        setLoading(false);
      }
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return <div>Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="space-y-8 max-w-2xl mx-auto py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">
          Drop some knowledge.
        </h1>
        <p className="text-slate-600">
          Create a new course playlist. Keep it organized, keep it clean.
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <PlaylistForm />
      </div>
    </div>
  );
}

export default function CreatePlaylistPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreatePlaylistContent />
    </Suspense>
  );
}
