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
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-start gap-4">
            <div
              className="mt-3 text-slate-300 cursor-move touch-none"
              {...attributes}
              {...listeners}
            >
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
                    onChange={(e) => onUpdate(item.id, "title", e.target.value)}
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
                      onUpdate(
                        item.id,
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
                  onChange={(e) => onUpdate(item.id, "url", e.target.value)}
                  placeholder="https://youtube.com/..."
                />
              </div>

              <div>
                <MarkdownEditor
                  value={item.notes || ""}
                  onChange={(v) => onUpdate(item.id, "notes", v || "")}
                  placeholder="Add context: 'Watch from 10:00' or 'Read pages 5-10'"
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
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
