"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParagraphSpacing } from "@/lib/extensions/paragraphSpacing";
import { HyphenBullet } from "@/lib/extensions/hyphenBullet";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";

// Extend TipTap commands
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    paragraphSpacing: {
      setSpacing: (spacing: "medium" | "large" | null) => ReturnType;
    };
    hyphenBullet: {
      toggleHyphen: () => ReturnType;
    };
  }
}

type Props = {
  content: string;
  onChange: (html: string) => void;
};

export const RichTextEditor = ({ content, onChange }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      ParagraphSpacing,
      HyphenBullet,
      Color,
      TextStyle,
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "border border-input rounded-md p-2 min-h-[120px] focus:outline-none rich-text-area",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content]);

  if (!editor) return null;

  return (
    <div className="w-full max-w-xl">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-2 border border-input rounded-md p-2 bg-muted">
        {/* Text styles */}
        <Button
          type="button"
          variant={editor.isActive("bold") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleBold().run()}
          size="sm"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("italic") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          size="sm"
        >
          <Italic className="w-4 h-4" />
        </Button>

        {/* Alignment */}
        <Button
          type="button"
          variant={
            editor.isActive({ textAlign: "left" }) ? "default" : "outline"
          }
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          size="sm"
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant={
            editor.isActive({ textAlign: "center" }) ? "default" : "outline"
          }
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          size="sm"
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant={
            editor.isActive({ textAlign: "right" }) ? "default" : "outline"
          }
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          size="sm"
        >
          <AlignRight className="w-4 h-4" />
        </Button>

        {/* Spacing */}
        <Button
          type="button"
          variant={
            editor.isActive("paragraph", { dataSpacing: "medium" })
              ? "default"
              : "outline"
          }
          onClick={() =>
            editor
              .chain()
              .focus()
              .setSpacing(
                editor.isActive("paragraph", { dataSpacing: "medium" })
                  ? null
                  : "medium",
              )
              .run()
          }
          size="sm"
        >
          Medium Spacing
        </Button>

        <Button
          type="button"
          variant={
            editor.isActive("paragraph", { dataSpacing: "large" })
              ? "default"
              : "outline"
          }
          onClick={() =>
            editor
              .chain()
              .focus()
              .setSpacing(
                editor.isActive("paragraph", { dataSpacing: "large" })
                  ? null
                  : "large",
              )
              .run()
          }
          size="sm"
        >
          Large Spacing
        </Button>

        {/* Hyphen Toggle */}
        <Button
          type="button"
          variant={
            editor.isActive("paragraph", { dataHyphen: "true" })
              ? "default"
              : "outline"
          }
          onClick={() => editor.chain().focus().toggleHyphen().run()}
          size="sm"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <input
          type="color"
          onChange={(e) => {
            editor.chain().focus().setColor(e.target.value).run();
          }}
          className="w-8 h-8 border rounded"
          title="Text color"
        />
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
};
