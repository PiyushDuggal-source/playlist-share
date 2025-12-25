"use client";

import dynamic from "next/dynamic";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder,
}: MarkdownEditorProps) {
  return (
    <div data-color-mode="light" className="markdown-editor-wrapper">
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || "")}
        preview="edit"
        height={200}
        textareaProps={{
          placeholder: placeholder,
        }}
        className="rounded-lg overflow-hidden border border-slate-200 shadow-sm"
      />
    </div>
  );
}
