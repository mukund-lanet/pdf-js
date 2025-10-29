import { useCallback, type ReactNode } from 'react';
import { useDocumentStore } from '@/store/document';
import { MdEditDocument, MdRemoveRedEye } from 'react-icons/md';
import type { TextBox } from '@/types/document';
import PageManagement from '@/components/pdf/PageManagement';

interface EditorLayoutProps {
  children: ReactNode;
}

export default function EditorLayout({ children }: EditorLayoutProps) {
  const { currentDocument, currentPageIndex, addTextBox, isEditing, setEditing } = useDocumentStore();

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentDocument || !isEditing) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const currentPage = currentDocument.pages[currentPageIndex];
    if (!currentPage) return;

    const newTextBox: Omit<TextBox, 'id' | 'pageId' | 'createdAt' | 'updatedAt'> = {
      x,
      y,
      width: 200,
      height: 100,
      html: '',
      style: {
        fontSize: 16,
        color: '#000000',
        textAlign: 'left',
      },
    };

    addTextBox(currentPage.id, newTextBox);
  }, [currentDocument, currentPageIndex, addTextBox]);

  return (
    <div className="relative w-full h-full bg-gray-100 overflow-auto">
      <div className="sticky top-0 z-10 bg-white border-b p-2 mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {isEditing ? 'Click anywhere to add text' : 'View mode'}
        </div>
        <button
          onClick={() => setEditing(!isEditing)}
          className="flex items-center px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm"
        >
          {isEditing ? (
            <>
              <MdRemoveRedEye className="w-4 h-4 mr-1" />
              View Mode
            </>
          ) : (
            <>
              <MdEditDocument className="w-4 h-4 mr-1" />
              Edit Mode
            </>
          )}
        </button>
      </div>
      
      <div 
        className="relative w-[595px] min-h-[842px] mx-auto my-8 mb-24"
        onClick={handleCanvasClick}
      >
        {children}
      </div>

      <PageManagement />
    </div>
  );
}