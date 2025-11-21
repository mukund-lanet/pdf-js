'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import { RootState } from '../../store/reducer/pdfEditor.reducer';
import { CanvasElement, isBlockElement, isFillableElement } from '../../types';

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
  const canvasElements = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.canvasElements || []);
  const pageDimensions = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.pageDimensions || {});

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

  // Render canvas elements on top of PDF
  const renderCanvasElements = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, scale: number) => {
    const pageElements = canvasElements.filter((el: CanvasElement) => el.page === pageNumber);
    const currentPageDimensions = pageDimensions[pageNumber] || { pageWidth: 600, pageHeight: 800 };

    // Separate elements
    const blocks = pageElements.filter(isBlockElement).sort((a, b) => a.order - b.order);
    const fillables = pageElements.filter(isFillableElement);

    // Helper to render individual element
    const renderElement = (element: CanvasElement, x: number, y: number, width: number, height: number) => {
      const scaledX = x * scale;
      const scaledY = y * scale;
      const scaledWidth = width * scale;
      const scaledHeight = height * scale;

      const BG = '#e0f7fa';
      const COLOR = '#00838f';
      const BORDER = '#00acc1';

      if (element.type === 'heading') {
        // Render heading with larger text and border
        context.fillStyle = '#ffffff';
        context.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);

        // Blue left border
        context.fillStyle = '#3b82f6';
        context.fillRect(scaledX, scaledY, 4 * scale, scaledHeight);

        // Border
        context.strokeStyle = '#e5e7eb';
        context.lineWidth = 2;
        context.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);

        // Heading text
        const fontSize = 16 * scale;
        context.font = `bold ${fontSize}px Arial`;
        context.fillStyle = '#000000';
        context.textAlign = 'left';
        context.textBaseline = 'top';
        context.fillText(element.content || 'Heading', scaledX + 8 * scale, scaledY + 8 * scale);

      } else if (element.type === 'text-field') {
        const fontSize = (element.fontSize || 16) * scale;
        context.font = `${element.fontWeight || 'normal'} ${element.fontStyle || 'normal'} ${fontSize}px Arial`;
        context.textAlign = (element.textAlign as CanvasTextAlign) || 'left';

        // Background
        context.fillStyle = BG;
        context.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);

        // Text
        context.fillStyle = COLOR;
        context.fillText(element.content, scaledX + 4, scaledY + fontSize);

      } else if (element.type === 'image' || element.type === 'signature') {

        context.fillStyle = BG;
        context.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);

        context.strokeStyle = BORDER;
        context.lineWidth = 2;
        context.setLineDash([6, 4]); // dashed border
        context.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
        context.setLineDash([]);

        if (element.imageData) {
          const img = new Image();
          img.src = element.imageData;
          img.onload = () => {
            context.drawImage(img, scaledX, scaledY, scaledWidth, scaledHeight);
          };
        }

      } else if (element.type === 'video') {
        // Render video placeholder
        context.fillStyle = '#f5f5f5';
        context.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);

        context.strokeStyle = '#ccc';
        context.lineWidth = 2;
        context.setLineDash([6, 4]);
        context.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
        context.setLineDash([]);

      } else if (element.type === 'table') {
        // Render table grid
        const rows = element.rows || 2;
        const cols = element.columns || 2;
        const cellWidth = scaledWidth / cols;
        const cellHeight = scaledHeight / rows;

        context.fillStyle = '#ffffff';
        context.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);

        context.strokeStyle = '#d1d5db';
        context.lineWidth = 1;

        // Draw grid
        for (let i = 0; i <= rows; i++) {
          context.beginPath();
          context.moveTo(scaledX, scaledY + i * cellHeight);
          context.lineTo(scaledX + scaledWidth, scaledY + i * cellHeight);
          context.stroke();
        }
        for (let j = 0; j <= cols; j++) {
          context.beginPath();
          context.moveTo(scaledX + j * cellWidth, scaledY);
          context.lineTo(scaledX + j * cellWidth, scaledY + scaledHeight);
          context.stroke();
        }

      } else if (element.type === 'date') {

        context.fillStyle = BG;
        context.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);

        context.strokeStyle = BORDER;
        context.lineWidth = 2;
        context.setLineDash([6, 4]);
        context.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
        context.setLineDash([]);

      } else if (element.type === 'initials') {

        context.fillStyle = BG;
        context.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);

        context.strokeStyle = BORDER;
        context.lineWidth = 2;
        context.setLineDash([6, 4]);
        context.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
        context.setLineDash([]);

        const fontSize = 12 * scale;
        context.font = `bold ${fontSize}px Arial`;
        context.fillStyle = COLOR;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(element.content || 'IN', scaledX + scaledWidth / 2, scaledY + scaledHeight / 2);

      } else if (element.type === 'checkbox') {

        context.fillStyle = BG;
        context.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);

        context.strokeStyle = BORDER;
        context.lineWidth = 2;
        context.setLineDash([6, 4]);
        context.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
        context.setLineDash([]);

        if (element.checked) {
          context.strokeStyle = COLOR;
          context.lineWidth = 2 * scale;
          context.beginPath();
          context.moveTo(scaledX + scaledWidth * 0.2, scaledY + scaledHeight * 0.5);
          context.lineTo(scaledX + scaledWidth * 0.4, scaledY + scaledHeight * 0.7);
          context.lineTo(scaledX + scaledWidth * 0.8, scaledY + scaledHeight * 0.3);
          context.stroke();
        }
      }
    };

    let currentY = 0;
    // Render Blocks
    blocks.forEach((element) => {
      // Calculate dimensions for block
      const elementX = 0;
      const elementY = currentY;
      const elementWidth = currentPageDimensions.pageWidth;
      const elementHeight = element.height;

      renderElement(element, elementX, elementY, elementWidth, elementHeight);
      currentY += elementHeight;
    });

    // Render Fillables
    fillables.forEach((element) => {
      renderElement(element, element.x, element.y, element.width, element.height);
    });
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

        const scale = 0.3;
        const viewport = page.getViewport({ scale });

        // Create offscreen canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error("Could not get canvas context");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page to canvas
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        const task = page.render(renderContext);
        renderTaskRef.current = task;

        await task.promise;
        if (!isMounted) return;

        // Render canvas elements on top of PDF
        renderCanvasElements(canvas, context, scale);

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
  }, [pdfDoc, pageNumber, canvasElements]); // Re-render when canvas elements change

  return (
    <div className={styles.thumbnailWrapper}>
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
            <div
              className={styles.thumbnailImage}
              style={{
                backgroundImage: `url(${thumbnailUrl})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                width: '100%',
                height: '100%',
              }}
            />
          )}
        </div>
        <div className={styles.thumbnailPageNumber}>Page {pageNumber}</div>
      </div>
    </div>
  );
});

ThumbnailPage.displayName = 'ThumbnailPage';

export default ThumbnailPage;
