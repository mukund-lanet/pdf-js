import { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import EditorToolbar from './EditorToolbar';
import { useDocumentStore } from '@/store/document';
import type { Page } from '@/types/document';

interface EditorProps {
  page: Page;
}

export default function Editor({ page }: EditorProps) {
  const { updatePage } = useDocumentStore();
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
    ],
    content: page.editorHtml,
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[200px] px-4 py-2',
      },
    },
    onUpdate: ({ editor }) => {
      // Update the page's content in the store
      updatePage(page.id, { editorHtml: editor.getHTML() });
    },
  });

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Prevent form submission on Enter
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
    }
  }, []);

  return (
    <div className="border rounded-lg bg-white">
      <EditorToolbar editor={editor} />
      <div onKeyDown={handleKeyDown}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}