'use client';


'use client';

import AppLayout from '@/components/AppLayout';
import Editor from '@/components/editor/Editor';
import EditorLayout from '@/components/editor/EditorLayout';
import ThumbnailSidebar from '@/components/pdf/ThumbnailSidebar';
import FileDropZone from '@/components/pdf/FileDropZone';
import { useDocumentStore } from '@/store/document';
import type { Page } from '@/types/document';

export default function Home() {
  const { currentDocument, currentPageIndex, addPage } = useDocumentStore();

  const handleCreateBlankPage = () => {
    const newPage: Page = {
      id: crypto.randomUUID(),
      width: 595, // A4 width in points at 72 DPI
      height: 842, // A4 height in points at 72 DPI
      source: 'blank',
      textBoxes: [],
      editorHtml: '',
    };
    addPage(newPage);
  };

  return (
    <AppLayout
      sidebar={
        currentDocument && (
          <ThumbnailSidebar 
            pages={currentDocument.pages} 
            currentPageIndex={currentPageIndex}
          />
        )
      }
    >
      <div className="h-screen flex flex-col">
        <header className="border-b p-4">
          <h1 className="text-xl font-semibold">PDF Editor</h1>
        </header>
        
        {!currentDocument || currentDocument.pages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FileDropZone />
              <div className="mt-4">
                <button
                  onClick={handleCreateBlankPage}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Create Blank Page
                </button>
              </div>
            </div>
          </div>
        ) : (
          <EditorLayout>
            {currentDocument.pages[currentPageIndex] && (
              <Editor
                key={currentDocument.pages[currentPageIndex].id}
                page={currentDocument.pages[currentPageIndex]}
              />
            )}
          </EditorLayout>
        )}
      </div>
    </AppLayout>
  );
}