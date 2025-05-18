import React, { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Spinner } from "react-bootstrap";

export default function TiptapEditor({ content, onUpdate, saving }) {
  const [mounted, setMounted] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose max-w-full outline-none",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  if (!mounted) return null;

  return (
    <div>
      {saving && <Spinner animation="border" size="sm" className="mb-2" />}
      <EditorContent editor={editor} />
    </div>
  );
}
