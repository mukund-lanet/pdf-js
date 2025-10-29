import { Editor } from '@tiptap/react';

interface EditorToolbarProps {
  editor: Editor | null;
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 p-2 border-b">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1 rounded ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
        title="Bold"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"></path>
          <path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"></path>
        </svg>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1 rounded ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
        title="Italic"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="4" x2="10" y2="4"></line>
          <line x1="14" y1="20" x2="5" y2="20"></line>
          <line x1="15" y1="4" x2="9" y2="20"></line>
        </svg>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-1 rounded ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
        title="Underline"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 3v7a6 6 0 006 6 6 6 0 006-6V3"></path>
          <line x1="4" y1="21" x2="20" y2="21"></line>
        </svg>
      </button>

      <div className="w-px h-6 bg-gray-300" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
        title="Bullet List"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="9" y1="6" x2="20" y2="6"></line>
          <line x1="9" y1="12" x2="20" y2="12"></line>
          <line x1="9" y1="18" x2="20" y2="18"></line>
          <circle cx="5" cy="6" r="2"></circle>
          <circle cx="5" cy="12" r="2"></circle>
          <circle cx="5" cy="18" r="2"></circle>
        </svg>
      </button>

      <div className="w-px h-6 bg-gray-300" />

      <input
        type="color"
        onChange={e => editor.chain().focus().setColor(e.target.value).run()}
        value={editor.getAttributes('textStyle').color || '#000000'}
        className="w-8 h-8 p-0 border-0"
        title="Text Color"
      />

      <select
        onChange={e => {
          const size = parseInt(e.target.value);
          editor.chain().focus().setFontSize(size.toString()).run();
        }}
        value={editor.getAttributes('textStyle').fontSize || '16'}
        className="p-1 border rounded"
        title="Font Size"
      >
        {[12, 14, 16, 18, 20, 24, 28, 32, 36].map(size => (
          <option key={size} value={size}>{size}px</option>
        ))}
      </select>
    </div>
  );
}