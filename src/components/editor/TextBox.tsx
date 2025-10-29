import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { useDocumentStore } from '@/store/document';
import type { TextBox } from '@/types/document';
import TextBoxToolbar from './TextBoxToolbar';

interface TextBoxComponentProps {
  textBox: TextBox;
}

export default function TextBoxComponent({ textBox }: TextBoxComponentProps) {
  const { updateTextBox, deleteTextBox } = useDocumentStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const dragStartPos = useRef({ x: 0, y: 0, boxX: 0, boxY: 0 });
  const resizeStartPos = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
    ],
    content: textBox.html,
    onUpdate: ({ editor }) => {
      updateTextBox(textBox.pageId, textBox.id, {
        html: editor.getHTML(),
      });
    },
  });

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      boxX: textBox.x,
      boxY: textBox.y,
    };
  }, [textBox.x, textBox.y]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    resizeStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      width: textBox.width,
      height: textBox.height,
    };
  }, [textBox.width, textBox.height]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStartPos.current.x;
      const deltaY = e.clientY - dragStartPos.current.y;
      updateTextBox(textBox.pageId, textBox.id, {
        x: dragStartPos.current.boxX + deltaX,
        y: dragStartPos.current.boxY + deltaY,
      });
    } else if (isResizing) {
      const deltaX = e.clientX - resizeStartPos.current.x;
      const deltaY = e.clientY - resizeStartPos.current.y;
      updateTextBox(textBox.pageId, textBox.id, {
        width: Math.max(100, resizeStartPos.current.width + deltaX),
        height: Math.max(50, resizeStartPos.current.height + deltaY),
      });
    }
  }, [isDragging, isResizing, textBox.pageId, textBox.id, updateTextBox]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  const handleFocus = useCallback(() => {
    setShowToolbar(true);
    const rect = editor?.view.dom.getBoundingClientRect();
    if (rect) {
      setToolbarPosition({ x: rect.left, y: rect.top });
    }
  }, [editor]);

  // Add event listeners for drag and resize
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleDelete = useCallback(() => {
    if (confirm('Are you sure you want to delete this text box?')) {
      deleteTextBox(textBox.pageId, textBox.id);
    }
  }, [textBox.pageId, textBox.id, deleteTextBox]);

  return (
    <>
      {showToolbar && (
        <TextBoxToolbar
          editor={editor}
          position={toolbarPosition}
          onDelete={handleDelete}
        />
      )}
      <div
        style={{
          position: 'absolute',
          left: textBox.x,
          top: textBox.y,
          width: textBox.width,
          height: textBox.height,
          fontSize: textBox.style.fontSize,
          color: textBox.style.color,
          textAlign: textBox.style.textAlign,
        }}
        className="group relative border border-transparent hover:border-blue-500 focus-within:border-blue-500"
        onMouseDown={handleDragStart}
      >
        <EditorContent 
          editor={editor} 
          onFocus={handleFocus}
          onBlur={() => setShowToolbar(false)}
          className="prose max-w-none h-full"
        />
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 group-hover:opacity-100"
          onMouseDown={handleResizeStart}
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 text-blue-500"
          >
            <path d="M22 22H20V20H22V22ZM22 18H18V20H22V18ZM18 22H16V24H18V22ZM14 20H16V18H14V20ZM16 16H18V14H16V16ZM20 16H22V14H20V16Z" />
          </svg>
        </div>
      </div>
    </>
  );
}