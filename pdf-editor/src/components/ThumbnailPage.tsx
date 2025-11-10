
'use client';
import React, { useEffect, useRef } from 'react';
import styles from 'app/(after-login)/(with-header)/pdf-editor/pdfEditor.module.scss';

interface ThumbnailPageProps {
  pdfDoc: any;
  pageNumber: number;
  currentPage: number;
  onThumbnailClick: (pageNumber: number) => void;
}

const ThumbnailPage = React.memo(({ pdfDoc, pageNumber, currentPage, onThumbnailClick }: ThumbnailPageProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const renderThumbnail = async () => {
      if (!pdfDoc || !canvasRef.current) return;

      try {
        const page = await pdfDoc.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 0.5 });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        page.render(renderContext);
      } catch (error) {
        console.error(`Error rendering thumbnail for page ${pageNumber}:`, error);
      }
    };

    renderThumbnail();
  }, [pdfDoc, pageNumber]);

  return (
    <div
      className={`${styles.thumbnailItem} ${pageNumber === currentPage ? styles.activeThumbnail : ''}`}
      onClick={() => onThumbnailClick(pageNumber)}
    >
      <canvas ref={canvasRef}></canvas>
      <div className={styles.thumbnailPageNumber}>Page {pageNumber}</div>
    </div>
  );
});

export default ThumbnailPage;
