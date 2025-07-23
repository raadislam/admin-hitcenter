import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { forwardRef, useEffect, useImperativeHandle } from "react";

// Add forwardRef to expose the insert function
const RichTextEditor = forwardRef(({ value, onChange, disabled }, ref) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editable: !disabled,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // Expose insertText function
  useImperativeHandle(ref, () => ({
    insertText: (text) => {
      if (editor) editor.commands.insertContent(text);
    },
  }));

  // Sync value from props if changed externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
  }, [value]);

  return (
    <div>
      <EditorContent
        editor={editor}
        className="min-h-[180px] bg-gray-50 rounded-lg px-2 py-1 border"
      />
    </div>
  );
});

export default RichTextEditor;
