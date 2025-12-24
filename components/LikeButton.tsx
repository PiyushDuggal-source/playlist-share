"use client";

import { useState, useMemo } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { likePlaylist, unlikePlaylist } from "@/lib/firebase/firestore";
import { AuthPromptModal } from "@/components/AuthGateButton";
import { Button } from "@/components/ui/Button";

interface LikeButtonProps {
  playlistId: string;
  initialLikes?: number;
  initialLikedBy?: string[];
}

export function LikeButton({
  playlistId,
  initialLikes = 0,
  initialLikedBy = [],
}: LikeButtonProps) {
  const { user, loading } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [likedBy, setLikedBy] = useState<string[]>(initialLikedBy);

  const liked = useMemo(() => {
    if (!user) return false;
    return likedBy.includes(user.uid);
  }, [likedBy, user]);

  const toggleLike = async () => {
    if (!user) {
      setOpenModal(true);
      return;
    }
    try {
      if (liked) {
        setLikes((l) => Math.max(0, l - 1));
        setLikedBy((arr) => arr.filter((id) => id !== user.uid));
        await unlikePlaylist(playlistId, user.uid);
      } else {
        setLikes((l) => l + 1);
        setLikedBy((arr) => [...arr, user.uid]);
        await likePlaylist(playlistId, user.uid);
      }
    } catch (error) {
      console.error("Error updating like", error);
      // revert optimistic change
      if (liked) {
        setLikes((l) => l + 1);
        setLikedBy((arr) => [...arr, user.uid]);
      } else {
        setLikes((l) => Math.max(0, l - 1));
        setLikedBy((arr) => arr.filter((id) => id !== user.uid));
      }
    }
  };

  return (
    <>
      <Button
        variant={liked ? "default" : "outline"}
        size="sm"
        onClick={toggleLike}
        disabled={loading}
        className="flex items-center gap-2"
      >
        <Heart className={`h-4 w-4 ${liked ? "fill-white" : ""}`} />
        <span>{likes}</span>
      </Button>
      <AuthPromptModal open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
}
