'use client';

import { useCallback, useState } from 'react';
import { useDocumentStore } from '@/store/document';
import { loadPDF, renderPageToCanvas, generatePageThumbnail } from '@/lib/pdf-service';

export default function FileDropZone() {
  const { createDocument, addPage } = useDocumentStore();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.includes('pdf')) {
      alert('Please drop a valid PDF file');
      return;
    }

    try {
      setIsLoading(true);
      setProgress(0);

      // Create document
      createDocument(file.name.replace('.pdf', ''));

      // Load PDF
      let pdf;
      try {
        pdf = await loadPDF(file);
      } catch (error: any) {
        console.error('Error loading PDF:', error);
        alert('Could not load the PDF file. Please make sure you are uploading a valid PDF file and try again.');
        return;
      }
      
      if (!pdf) {
        alert('Failed to load PDF. Please try again.');
        return;
      }
      
      const totalPages = pdf.numPages;

      // Process each page
      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const [pageBlob, thumbnailBlob] = await Promise.all([
          renderPageToCanvas(page),
          generatePageThumbnail(page)
        ]);

        addPage({
          id: crypto.randomUUID(),
          width: page.view[2], // Width from PDF view
          height: page.view[3], // Height from PDF view
          canvasBlob: pageBlob,
          thumbnailBlob,
          textBoxes: [],
          source: 'uploaded',
        });

        setProgress(Math.round((i / totalPages) * 100));
      }
    } catch (error) {
      console.error('Error processing PDF:', error);
      alert('Error processing PDF. Please try again.');
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  }, [createDocument]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const items = Array.from(e.dataTransfer.items);
    const hasPdf = items.some(item => item.type === 'application/pdf');
    e.currentTarget.classList.toggle('border-blue-500', hasPdf);
    e.currentTarget.classList.toggle('border-red-500', !hasPdf && items.length > 0);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500', 'border-red-500');
  }, []);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
        isLoading ? 'bg-gray-50' : 'hover:bg-gray-50'
      }`}
    >
      {isLoading ? (
        <div className="space-y-4">
          <div className="text-gray-500">Processing PDF...</div>
          <div className="w-48 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-sm text-gray-400">{progress}%</div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-gray-500">
            Drag and drop a PDF file here
          </div>
          <div className="text-sm text-gray-400">
            or click to select a file
          </div>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleDrop({
                  preventDefault: () => {},
                  dataTransfer: { files: [file] },
                } as any);
              }
            }}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}