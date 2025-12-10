'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import { RootState } from '../../../store/reducer/contractManagement.reducer';
import { CanvasElement, isBlockElement, isFillableElement } from '../../../utils/interface';
import Typography from '@trenchaant/pkg-ui-component-library/build/Components/Typography';
import { SET_CURRENT_PAGE } from '../../../store/action/contractManagement.actions';
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';

interface ThumbnailPageProps {
  pdfDoc: any;
  pageNumber: number;
  isLoading: boolean;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
}

const ThumbnailPage = React.memo(({ pdfDoc, pageNumber, isLoading, dragHandleProps }: ThumbnailPageProps) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const renderTaskRef = useRef<any>(null);
  const canvasElements = useSelector((state: RootState) => state?.contractManagement?.canvasElements || []);
  const pageDimensions = useSelector((state: RootState) => state?.contractManagement?.pageDimensions || {});
  const dispatch = useDispatch();
  const currentPage = useSelector((state: RootState) => state?.contractManagement?.currentPage);

  // cleanup function
  const cleanup = () => {
    if (renderTaskRef.current) {
      try {
        renderTaskRef.current.cancel();
      } catch (e) {
        console.log("error: ", e)
      }
      renderTaskRef.current = null;
    }

    // clean up blob uri to prevent memory leaks
    if (thumbnailUrl) {
      URL.revokeObjectURL(thumbnailUrl);
    }
  };

  // render canvas elements on top of PDF
  const renderCanvasElements = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, scale: number) => {
    const pageElements = canvasElements.filter((el: CanvasElement) => el.page === pageNumber);
    const currentPageDimensions = pageDimensions[pageNumber] || { pageWidth: 600, pageHeight: 800 };

    // separate elements
    const blocks = pageElements.filter(isBlockElement).sort((a, b) => a.order - b.order);
    const fillables = pageElements.filter(isFillableElement);

    // helper to render individual element
    const renderElement = (element: CanvasElement, x: number, y: number, width: number, height: number) => {
      const scaledX = x * scale;
      const scaledY = y * scale;
      const scaledWidth = width * scale;
      const scaledHeight = height * scale;

      const BG = '#e0f7fa';
      const COLOR = '#00838f';
      const BORDER = '#00acc1';

      if (element.type === 'Text') {
        // for heading with larger text and border
        context.fillStyle = '#ffffff';
        context.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);

        // for blue left border
        context.fillStyle = '#3b82f6';
        context.fillRect(scaledX, scaledY, 4 * scale, scaledHeight);

        // for border
        context.strokeStyle = '#e5e7eb';
        context.lineWidth = 2;
        context.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);

        // for heading text
        const fontSize = 16 * scale;
        context.font = `bold ${fontSize}px Arial`;
        context.fillStyle = '#000000';
        context.textAlign = 'left';
        context.textBaseline = 'top';
        context.fillText(element.content || 'Heading', scaledX + 8 * scale, scaledY + 8 * scale);

      } else if (element.type === 'TextField') {
        const fontSize = (element.fontSize || 16) * scale;
        context.font = `${element.fontWeight || 'normal'} ${element.fontStyle || 'normal'} ${fontSize}px Arial`;
        context.textAlign = (element.textAlign as CanvasTextAlign) || 'left';

        // for background
        context.fillStyle = BG;
        context.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);

        // for text
        context.fillStyle = COLOR;
        context.fillText(element.content, scaledX + 4, scaledY + fontSize);

      } else if (element.type === 'Image' || element.type === 'Signature') {

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

      } else if (element.type === 'Video') {
        // render tht video placeholder
        context.fillStyle = '#f5f5f5';
        context.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);

        context.strokeStyle = '#ccc';
        context.lineWidth = 2;
        context.setLineDash([6, 4]);
        context.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
        context.setLineDash([]);

      } else if (element.type === 'Table') {
        // render the table grid
        const rows = element.rows || 2;
        const cols = element.columns || 2;
        const cellWidth = scaledWidth / cols;
        const cellHeight = scaledHeight / rows;

        context.fillStyle = '#ffffff';
        context.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);

        context.strokeStyle = '#d1d5db';
        context.lineWidth = 1;

        // draw the grid
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

      } else if (element.type === 'DateField') {

        context.fillStyle = BG;
        context.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);

        context.strokeStyle = BORDER;
        context.lineWidth = 2;
        context.setLineDash([6, 4]);
        context.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
        context.setLineDash([]);

      } else if (element.type === 'InitialsField') {

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

      } else if (element.type === 'Checkbox') {

        context.fillStyle = BG;
        context.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);

        context.strokeStyle = BORDER;
        context.lineWidth = 2;
        context.setLineDash([6, 4]);
        context.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
        context.setLineDash([]);

        if (element.preChecked) {
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
    blocks.forEach((element) => {
      const elementX = 0;
      const elementY = currentY;
      const elementWidth = currentPageDimensions.pageWidth;
      let elementHeight = element.height;

      if (element.type === 'Image' && !element.imageData) {
        elementHeight = 110;
      } else if (element.type === 'Video' && !element.videoUrl) {
        elementHeight = 110;
      } else if (element.type === 'Table') {
        elementHeight = 100;
      }

      renderElement(element, elementX, elementY, elementWidth, elementHeight);
      currentY += elementHeight;
    });

    fillables.forEach((element) => {
      renderElement(element, element.x, element.y, element.width, element.height);
    });
  };

  useEffect(() => {
    let isMounted = true;

    const renderThumbnail = async () => {
      if (!pdfDoc) return;

      try {
        setError(null);
        cleanup();

        const page = await pdfDoc.getPage(pageNumber);
        if (!isMounted) return;

        const scale = 0.3;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error("Could not get canvas context");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        const task = page.render(renderContext);
        renderTaskRef.current = task;

        await task.promise;
        if (!isMounted) return;

        renderCanvasElements(canvas, context, scale);

        canvas.toBlob((blob) => {
          if (!isMounted || !blob) return;

          const url = URL.createObjectURL(blob);
          setThumbnailUrl(url);
        }, 'image/jpeg', 0.7);

      } catch (error) {
        if (!isMounted) return;
        console.error(`Error rendering thumbnail for page ${pageNumber}:`, error);
        setError(`Failed to load page ${pageNumber}`);
      }
    };

    renderThumbnail();

    return () => {
      isMounted = false;
      cleanup();
    };
  }, [pdfDoc, pageNumber, canvasElements]);

  return (
    <div className={styles.thumbnailWrapper}>
      <div className={styles.thumbnailDragHandle} {...dragHandleProps}>
        <Typography className={styles.thumbnailPageNumber}>{pageNumber}</Typography>
        <CustomIcon iconName="grip-vertical" width={16} height={16} variant="white" />
      </div>
      <div className={styles.thumbnailPageContainer}>
        <div
          key={`thumbnail_page_${pageNumber}`}
          className={`${styles.thumbnailItem} ${pageNumber === currentPage ? styles.activeThumbnail : ''}`}
          onClick={() => dispatch({ type: SET_CURRENT_PAGE, payload: pageNumber })}
        >
          <div className={styles.thumbnailContent}>
            {thumbnailUrl && !isLoading && !error && (
              <div
                className={styles.thumbnailImage}
                style={{
                  backgroundImage: `url(${thumbnailUrl})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  width: '201px',
                  height: '255px',
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ThumbnailPage.displayName = 'ThumbnailPage';

export default ThumbnailPage;
