"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { revalidatePlaylist } from "@/app/actions";
import { Playlist, PlaylistItem, PlaylistItemType } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Trash2, GripVertical, Plus } from "lucide-react";
import {
  createPlaylist,
  updatePlaylist,
  getUserProfile,
} from "@/lib/firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import MarkdownEditor from "@/components/MarkdownEditor";

interface PlaylistFormProps {
  initialData?: Playlist;
}

export function PlaylistForm({ initialData }: PlaylistFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [items, setItems] = useState<PlaylistItem[]>(initialData?.items || []);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        title: "",
        type: "video",
        url: "",
        notes: "",
      },
    ]);
  };

  const updateItem = (
    index: number,
    field: keyof PlaylistItem,
    value: string
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!name) return;

    setLoading(true);
    try {
      // Fetch user profile to get the level
      const userProfile = await getUserProfile(user.uid);

      const playlistData = {
        name,
        description,
        items,
        authorId: user.uid,
        authorName: user.displayName || "Anonymous",
        authorLevel: userProfile?.level || 1,
      };

      if (initialData) {
        await updatePlaylist(initialData.id, playlistData);
        await revalidatePlaylist(initialData.id);
        router.push(`/playlist/${initialData.id}`);
      } else {
        const id = await createPlaylist(playlistData);
        router.push(`/playlist/${id}`);
      }
      router.refresh();
    } catch (error) {
      console.error("Error saving playlist:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-slate-900">
            Course Name
          </label>
          <input
            required
            className="flex h-12 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., CS 101: Intro to Computer Science"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold text-slate-900">
            Description (Optional)
          </label>
          <textarea
            className="flex min-h-[100px] w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this course about? Any tips for passing?"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">The Syllabus</h3>
          <Button
            type="button"
            onClick={addItem}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" /> Add Resource
          </Button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <Card key={item.id} className="border-slate-200 shadow-sm">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-3 text-slate-300 cursor-move">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <div className="flex-grow space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Title
                        </label>
                        <input
                          required
                          className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          value={item.title}
                          onChange={(e) =>
                            updateItem(index, "title", e.target.value)
                          }
                          placeholder="e.g. Lecture 1: Intro"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Type
                        </label>
                        <select
                          className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          value={item.type}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "type",
                              e.target.value as PlaylistItemType
                            )
                          }
                        >
                          <option value="video">Video</option>
                          <option value="document">Document</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        URL
                      </label>
                      <input
                        required
                        type="url"
                        className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        value={item.url}
                        onChange={(e) =>
                          updateItem(index, "url", e.target.value)
                        }
                        placeholder="https://youtube.com/..."
                      />
                    </div>

                    <div>
                      <MarkdownEditor
                        value={item.notes || ""}
                        onChange={(v) => updateItem(index, "notes", v)}
                        placeholder="Add context: 'Watch from 10:00' or 'Read pages 5-10'"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {items.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
              <p className="text-slate-500">
                No items yet. Add your first resource.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} size="lg" className="px-8">
          {loading
            ? "Saving..."
            : initialData
            ? "Save Changes"
            : "Publish Course"}
        </Button>
      </div>
    </form>
  );
}
