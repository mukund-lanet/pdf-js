'use client';

'use client';

import { useCallback, useRef } from 'react';
import { MdAdd, MdDeleteOutline, MdArrowUpward, MdArrowDownward, MdPictureAsPdf } from 'react-icons/md';
import { useDocumentStore } from '@/store/document';
import { loadPDF, renderPageToCanvas, generatePageThumbnail } from '@/lib/pdf-service';
import type { Page } from '@/types/document';

export default function PageManagement() {
  const { 
    currentDocument, 
    currentPageIndex,
    addPage, 
    deletePage,
    movePage,
    setCurrentPageIndex 
  } = useDocumentStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateBlankPage = useCallback(() => {
    const newPage: Page = {
      id: crypto.randomUUID(),
      width: 595, // A4 width in points at 72 DPI
      height: 842, // A4 height in points at 72 DPI
      source: 'blank',
      textBoxes: [],
    };
    addPage(newPage);
  }, [addPage]);

  const handleAppendPDF = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.includes('pdf')) {
      alert('Please select a valid PDF file');
      return;
    }

    try {
      // Load PDF
      const pdf = await loadPDF(file);
      const totalPages = pdf.numPages;

      // Process each page
      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const [pageBlob, thumbnailBlob] = await Promise.all([
          renderPageToCanvas(page),
          generatePageThumbnail(page)
        ]);

        const newPage: Page = {
          id: crypto.randomUUID(),
          width: page.view[2],
          height: page.view[3],
          canvasBlob: pageBlob,
          thumbnailBlob,
          textBoxes: [],
          source: 'appended',
        };

        addPage(newPage);
      }
    } catch (error) {
      console.error('Error appending PDF:', error);
      alert('Error processing PDF. Please try again.');
    }

    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [addPage]);

  const handleDeletePage = useCallback(() => {
    if (!currentDocument || currentPageIndex === undefined) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this page?');
    if (!confirmDelete) return;

    deletePage(currentPageIndex);

    // Update current page index if needed
    if (currentPageIndex >= currentDocument.pages.length - 1) {
      setCurrentPageIndex(Math.max(0, currentDocument.pages.length - 2));
    }
  }, [currentDocument, currentPageIndex, deletePage, setCurrentPageIndex]);

  const handleMovePage = useCallback((direction: 'up' | 'down') => {
    if (!currentDocument || currentPageIndex === undefined) return;

    const newIndex = direction === 'up' 
      ? currentPageIndex - 1 
      : currentPageIndex + 1;

    if (newIndex < 0 || newIndex >= currentDocument.pages.length) return;

    movePage(currentPageIndex, newIndex);
    setCurrentPageIndex(newIndex);
  }, [currentDocument, currentPageIndex, movePage, setCurrentPageIndex]);

  if (!currentDocument) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white rounded-full shadow-lg px-4 py-2">
      <button
        onClick={handleCreateBlankPage}
        className="p-2 hover:bg-gray-100 rounded-full"
        title="Add Blank Page"
      >
        <MdAdd className="w-5 h-5" />
      </button>

      <button
        onClick={() => fileInputRef.current?.click()}
        className="p-2 hover:bg-gray-100 rounded-full"
        title="Append from PDF"
      >
        <MdPictureAsPdf className="w-5 h-5" />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleAppendPDF}
        className="hidden"
      />

      <div className="w-px h-6 bg-gray-200 mx-2" />

      <button
        onClick={() => handleMovePage('up')}
        disabled={currentPageIndex <= 0}
        className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
        title="Move Page Up"
      >
        <MdArrowUpward className="w-5 h-5" />
      </button>

      <button
        onClick={() => handleMovePage('down')}
        disabled={currentPageIndex >= currentDocument.pages.length - 1}
        className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
        title="Move Page Down"
      >
        <MdArrowDownward className="w-5 h-5" />
      </button>

      <div className="w-px h-6 bg-gray-200 mx-2" />

      <button
        onClick={handleDeletePage}
        disabled={currentDocument.pages.length === 0}
        className="p-2 hover:bg-red-100 text-red-600 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
        title="Delete Current Page"
      >
        <MdDeleteOutline className="w-5 h-5" />
      </button>
    </div>
  );
}