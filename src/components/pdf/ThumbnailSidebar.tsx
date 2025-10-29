import { useCallback } from 'react';
import { useDocumentStore } from '@/store/document';
import type { Page } from '@/types/document';

interface ThumbnailProps {
  page: Page;
  index: number;
  isSelected: boolean;
}

function Thumbnail({ page, index, isSelected }: ThumbnailProps) {
  const { setCurrentPageIndex } = useDocumentStore();
  
  const handleClick = useCallback(() => {
    setCurrentPageIndex(index);
  }, [index, setCurrentPageIndex]);

  return (
    <div 
      onClick={handleClick}
      className={`relative cursor-pointer p-2 rounded ${
        isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'
      }`}
    >
      {page.canvasBlob ? (
        <img 
          src={URL.createObjectURL(page.canvasBlob)} 
          alt={`Page ${index + 1}`}
          className="w-full h-auto border shadow"
          style={{ maxWidth: '150px' }}
        />
      ) : (
        <div 
          className="w-full bg-white border shadow"
          style={{ 
            maxWidth: '150px',
            height: '212px', // Roughly A4 proportion
          }}
        />
      )}
      <div className="mt-1 text-center text-sm text-gray-600">
        Page {index + 1}
      </div>
    </div>
  );
}

interface ThumbnailSidebarProps {
  pages: Page[];
  currentPageIndex: number;
}

export default function ThumbnailSidebar({ pages, currentPageIndex }: ThumbnailSidebarProps) {
  return (
    <div className="p-4 space-y-4">
      <h2 className="font-semibold text-lg">Pages</h2>
      <div className="space-y-2">
        {pages.map((page, index) => (
          <Thumbnail
            key={page.id}
            page={page}
            index={index}
            isSelected={index === currentPageIndex}
          />
        ))}
      </div>
    </div>
  );
}