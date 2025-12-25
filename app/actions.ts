"use server";

import { revalidatePath } from "next/cache";

export async function revalidatePlaylist(id: string) {
  revalidatePath(`/playlist/${id}`);
}
