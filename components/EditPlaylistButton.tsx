"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Edit } from "lucide-react";
import Link from "next/link";

interface EditPlaylistButtonProps {
  playlistId: string;
  authorId: string;
}

export function EditPlaylistButton({
  playlistId,
  authorId,
}: EditPlaylistButtonProps) {
  const { user } = useAuth();

  if (!user || user.uid !== authorId) {
    return null;
  }

  return (
    <Link href={`/playlist/${playlistId}/edit`}>
      <Button variant="outline" size="sm">
        <Edit className="mr-2 h-4 w-4" />
        Edit Playlist
      </Button>
    </Link>
  );
}
