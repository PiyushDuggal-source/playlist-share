import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { GripVertical, Trash2 } from "lucide-react";
import { PlaylistItem, PlaylistItemType } from "@/types";
import MarkdownEditor from "@/components/MarkdownEditor";

interface SortablePlaylistItemProps {
  item: PlaylistItem;
  onUpdate: (id: string, field: keyof PlaylistItem, value: string) => void;
  onRemove: (id: string) => void;
}

export function SortablePlaylistItem({
  item,
  onUpdate,
  onRemove,
}: SortablePlaylistItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      id={`item-${item.id}`}
      ref={setNodeRef}
      style={style}
      className="relative"
    >
      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-start gap-4">
            <div
              className="mt-3 cursor-move text-slate-300 touch-none"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="w-5 h-5" />
            </div>
            <div className="flex-grow space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider uppercase text-slate-700">
                    Title
                  </label>
                  <input
                    required
                    className="flex w-full h-10 px-3 py-2 text-sm transition-all bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={item.title}
                    onChange={(e) => onUpdate(item.id, "title", e.target.value)}
                    placeholder="e.g. Lecture 1: Intro"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider uppercase text-slate-700">
                    Type
                  </label>
                  <select
                    className="flex w-full h-10 px-3 py-2 text-sm transition-all bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={item.type}
                    onChange={(e) =>
                      onUpdate(
                        item.id,
                        "type",
                        e.target.value as PlaylistItemType
                      )
                    }
                  >
                    <option value="video">Video</option>
                    <option value="document">Document</option>
                    <option value="link">Link</option>
                    <option value="note">Note</option>
                  </select>
                </div>
              </div>

              {item.type !== "note" && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider uppercase text-slate-700">
                    URL
                  </label>
                  <input
                    required={
                      item.type === "video" ||
                      item.type === "document" ||
                      item.type === "link"
                    }
                    type="url"
                    className="flex w-full h-10 px-3 py-2 text-sm transition-all bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={item.url || ""}
                    onChange={(e) => onUpdate(item.id, "url", e.target.value)}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wider uppercase text-slate-700">
                  Description
                </label>
                <MarkdownEditor
                  value={item.description || item.notes || ""}
                  onChange={(v) => onUpdate(item.id, "description", v ? v : "")}
                  placeholder="Add context, summaries, timestamps, or key takeaways"
                />
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-red-500 hover:bg-red-50"
              onClick={() => onRemove(item.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
