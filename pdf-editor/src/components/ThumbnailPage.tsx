'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from 'app/(after-login)/(with-header)/pdf-editor/pdfEditor.module.scss';

interface ThumbnailPageProps {
  pdfDoc: any;
  pageNumber: number;
  currentPage: number;
  onThumbnailClick: (pageNumber: number) => void;
}

const ThumbnailPage = React.memo(({ pdfDoc, pageNumber, currentPage, onThumbnailClick }: ThumbnailPageProps) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const renderTaskRef = useRef<any>(null);

  // Cleanup function
  const cleanup = () => {
    if (renderTaskRef.current) {
      try {
        renderTaskRef.current.cancel();
      } catch (e) {
        // Ignore cancellation errors
      }
      renderTaskRef.current = null;
    }
    
    // Clean up blob URL to prevent memory leaks
    if (thumbnailUrl) {
      URL.revokeObjectURL(thumbnailUrl);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const renderThumbnail = async () => {
      if (!pdfDoc) return;

      try {
        setIsLoading(true);
        setError(null);
        cleanup();

        const page = await pdfDoc.getPage(pageNumber);
        if (!isMounted) return;

        const viewport = page.getViewport({ scale: 0.3 });

        // Create offscreen canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error("Could not get canvas context");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render to offscreen canvas
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        const task = page.render(renderContext);
        renderTaskRef.current = task;

        await task.promise;
        if (!isMounted) return;

        // Convert to blob URL instead of data URL to avoid large strings
        canvas.toBlob((blob) => {
          if (!isMounted || !blob) return;
          
          const url = URL.createObjectURL(blob);
          setThumbnailUrl(url);
          setIsLoading(false);
        }, 'image/jpeg', 0.7);

      } catch (error) {
        if (!isMounted) return;
        console.error(`Error rendering thumbnail for page ${pageNumber}:`, error);
        setError(`Failed to load page ${pageNumber}`);
        setIsLoading(false);
      }
    };

    renderThumbnail();

    return () => {
      isMounted = false;
      cleanup();
    };
  }, [pdfDoc, pageNumber]);

  return (
    <div
      key={`thumbnail_page_${pageNumber}`}
      className={`${styles.thumbnailItem} ${pageNumber === currentPage ? styles.activeThumbnail : ''}`}
      onClick={() => onThumbnailClick(pageNumber)}
    >
      <div className={styles.thumbnailContent}>
        {isLoading && (
          <div className={styles.thumbnailLoading}>
            Loading...
          </div>
        )}
        
        {error && (
          <div className={styles.thumbnailError}>
            {error}
          </div>
        )}
        
        {thumbnailUrl && !isLoading && !error && (
          <img 
            src={thumbnailUrl}
            alt={`Page ${pageNumber}`}
            className={styles.thumbnailImage}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setError('Failed to load image');
              setIsLoading(false);
            }}
          />
        )}
      </div>
      <div className={styles.thumbnailPageNumber}>Page {pageNumber}</div>
    </div>
  );
});

ThumbnailPage.displayName = 'ThumbnailPage';

export default ThumbnailPage;
