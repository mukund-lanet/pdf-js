'use client';

'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import TextBox from '@/components/editor/TextBox';
import { useDocumentStore } from '@/store/document';
import type { Page } from '@/types/document';

interface PDFPageProps {
  page: Page;
  isEditMode?: boolean;
}

export default function PDFPage({ page, isEditMode = false }: PDFPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addTextBox } = useDocumentStore();
  const [showGrid, setShowGrid] = useState(false);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditMode) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    addTextBox(page.id, {
      x,
      y,
      width: 200,
      height: 100,
      style: {
        fontSize: 16,
        color: '#000000',
        textAlign: 'left',
      },
      html: '<p>Click to edit text</p>',
    });
  }, [isEditMode, page.id, addTextBox]);

  useEffect(() => {
    if (!canvasRef.current || !page.canvasBlob) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      if (!canvasRef.current) return;
      ctx.drawImage(img, 0, 0);
    };
    img.src = URL.createObjectURL(page.canvasBlob);

    return () => {
      URL.revokeObjectURL(img.src);
    };
  }, [page.canvasBlob]);

  return (
    <div 
      className={`relative bg-white shadow-lg mx-auto ${showGrid ? 'bg-grid' : ''}`}
      style={{ 
        width: page.width, 
        height: page.height,
        cursor: isEditMode ? 'crosshair' : 'default'
      }}
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        width={page.width}
        height={page.height}
        className="absolute top-0 left-0"
      />

      {/* Text box layer */}
      <div className="absolute inset-0">
        {page.textBoxes.map((textBox) => (
          <TextBox key={textBox.id} textBox={textBox} />
        ))}
      </div>

      {/* Grid toggle button */}
      {isEditMode && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowGrid(prev => !prev);
          }}
          className="absolute top-2 right-2 p-2 bg-white/80 rounded shadow hover:bg-white"
          title={showGrid ? 'Hide Grid' : 'Show Grid'}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7-6v12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}