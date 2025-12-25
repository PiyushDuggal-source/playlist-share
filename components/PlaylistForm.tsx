"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { revalidatePlaylist } from "@/app/actions";
import { Playlist, PlaylistItem, PlaylistItemType } from "@/types";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortablePlaylistItem } from "./SortablePlaylistItem";
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addItem = () => {
    // create id first so we can scroll to the new element after render
    const id = crypto.randomUUID();
    setItems((prev) => [
      ...prev,
      {
        id,
        title: "",
        type: "video",
        url: "",
        notes: "",
      },
    ]);

    // wait a tick for the DOM to update, then smooth-scroll the new item into view
    setTimeout(() => {
      const el = document.getElementById(`item-${id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        // fallback to scrolling to bottom
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 80);
  };

  const updateItem = (id: string, field: keyof PlaylistItem, value: string) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const removeItem = (id: string) => {
    if (confirm("Are you sure you want to remove this item?")) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {items.map((item) => (
                <SortablePlaylistItem
                  key={item.id}
                  item={item}
                  onUpdate={updateItem}
                  onRemove={removeItem}
                />
              ))}
            </SortableContext>
          </DndContext>
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
