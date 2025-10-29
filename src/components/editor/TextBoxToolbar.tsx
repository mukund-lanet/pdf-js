import { Editor } from '@tiptap/react';
import { FaBold, FaItalic, FaUnderline, FaTrash } from 'react-icons/fa';
import { IoMdColorPalette } from 'react-icons/io';

interface TextBoxToolbarProps {
  editor: Editor | null;
  onDelete?: () => void;
  position: {
    x: number;
    y: number;
  };
}

export default function TextBoxToolbar({ editor, onDelete, position }: TextBoxToolbarProps) {
  if (!editor) {
    return null;
  }

  return (
    <div
      className="absolute bg-white shadow-lg rounded-lg border flex items-center p-1 space-x-1 z-50"
      style={{
        top: `${position.y - 40}px`,
        left: `${position.x}px`,
      }}
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('bold') ? 'bg-gray-200' : ''
        }`}
        title="Bold"
      >
        <FaBold className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('italic') ? 'bg-gray-200' : ''
        }`}
        title="Italic"
      >
        <FaItalic className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('underline') ? 'bg-gray-200' : ''
        }`}
        title="Underline"
      >
        <FaUnderline className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <input
        type="color"
        onChange={(e) => {
          editor.chain().focus().setColor(e.target.value).run();
        }}
        className="w-6 h-6 rounded cursor-pointer"
        title="Text Color"
      />

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {onDelete && (
        <button
          onClick={onDelete}
          className="p-2 rounded hover:bg-red-100 text-red-600"
          title="Delete Text Box"
        >
          <FaTrash className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}