import { getPlaylist } from "@/lib/firebase/firestore";
import { notFound } from "next/navigation";
import { PlaylistDetails } from "@/components/PlaylistDetails";

export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ playlistId: string }>;
}) {
  const { playlistId } = await params;
  const playlist = await getPlaylist(playlistId);

  if (!playlist) {
    notFound();
  }

  return <PlaylistDetails playlist={playlist} />;
}
