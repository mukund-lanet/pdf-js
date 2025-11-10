'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from 'app/(after-login)/(with-header)/pdf-editor/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Menu from '@trenchaant/pkg-ui-component-library/build/Components/Menu';
import MenuItem from '@trenchaant/pkg-ui-component-library/build/Components/MenuItem';
import DraggableElement from './DraggableElement';
import { CanvasElement } from './types';

interface PDFPageProps {
  pdfDoc: any;
  pageNumber: number;
  onCanvasClick?: (pageNumber: number) => void;
  onDrop?: (x: number, y: number, info: { pageWidth: number; pageHeight: number }, pageNumber: number, type: string) => void;
  onAddBlankPage: (pageNumber: number) => void;
  onUploadAndInsertPages: (pageNumber: number) => void;
  onDeletePage: (pageNumber: number) => void;
  canvasElements: CanvasElement[];
  pageDimensions: { [key: number]: { pageWidth: number; pageHeight: number } };
  onElementUpdate: (updatedElement: CanvasElement) => void;
  onElementDelete: (id: string) => void;
  onImageUpload: (elementId: string) => void;
  onSignatureDraw: (elementId: string) => void;
  onElementSelect: (element: CanvasElement) => void;
}

const PDFPage = React.memo(({ 
  pdfDoc, 
  pageNumber, 
  onCanvasClick, 
  onDrop, 
  onAddBlankPage, 
  onUploadAndInsertPages, 
  onDeletePage,
  canvasElements,
  pageDimensions,
  onElementUpdate,
  onElementDelete,
  onImageUpload,
  onSignatureDraw,
  onElementSelect
}: PDFPageProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pageSize, setPageSize] = useState<{ pageWidth: number; pageHeight: number }>({ pageWidth: 600, pageHeight: 800 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addMenuAnchorEl, setAddMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState<null | HTMLElement>(null);
  const renderTaskRef = useRef<any>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, type: string) => {
    if (type === 'add') {
      setAddMenuAnchorEl(event.currentTarget);
    } else if (type === 'action') {
      setActionMenuAnchorEl(event.currentTarget);
    }
  };

  const handleMenuClose = () => {
    setAddMenuAnchorEl(null);
    setActionMenuAnchorEl(null);
  };

  const handleAddBlankPage = () => {
    onAddBlankPage(pageNumber);
    handleMenuClose();
  };
  
  const handleDeletePage = () => {
    onDeletePage(pageNumber);
    handleMenuClose();
  };

  const handleUploadAndInsert = () => {
    onUploadAndInsertPages(pageNumber);
    handleMenuClose();
  };

  // Cleanup function to cancel any ongoing render tasks
  const cleanupRenderTask = () => {
    if (renderTaskRef.current) {
      try {
        renderTaskRef.current.cancel();
      } catch (error) {
        // Ignore cancellation errors
      }
      renderTaskRef.current = null;
    }
  };

useEffect(() => {
  let isMounted = true;

  const renderPage = async () => {
    if (!pdfDoc || !canvasRef.current) return;

    // 🔥 Cancel any previous render immediately before starting a new one
    cleanupRenderTask();

    setIsLoading(true);
    setError(null);

    try {
      const page = await pdfDoc.getPage(pageNumber);
      if (!isMounted) return;

      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) throw new Error("Could not get canvas context");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);

      const renderContext = { canvasContext: context, viewport };

      // ✅ Store and await the render task
      const task = page.render(renderContext);
      renderTaskRef.current = task;

      await task.promise;

      if (isMounted) {
        setPageSize({ pageWidth: viewport.width, pageHeight: viewport.height });
        setIsLoading(false);
      }

    } catch (error: any) {
      // Ignore intended cancellation
      if (
        error?.name !== "RenderingCancelledException" &&
        error?.message !== "Rendering cancelled"
      ) {
        console.error(`Error rendering page ${pageNumber}:`, error);
        if (isMounted) setError(`Failed to render page ${pageNumber}`);
      }
    }
  };

  renderPage();

  return () => {
    isMounted = false;
    cleanupRenderTask(); // ✅ also cancel on unmount or dependency change
  };
}, [pdfDoc, pageNumber]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!onDrop || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const type = e.dataTransfer.getData('application/pdf-editor');
    
    if (type) {
      onDrop(x, y, pageSize, pageNumber, type);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCanvasClick) {
      onCanvasClick(pageNumber);
    }
  };

  return (
    <div 
      id={`pdf-page-${pageNumber}`}
      className={styles.pdfPageContainer}
      style={{ marginBottom: '40px', position: 'relative' }}
    >
      <div 
        ref={containerRef}
        className={styles.pdfCanvasViewer}
      >
        <div 
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleCanvasClick}
          className={styles.canvasContainer}
          style={{ position: 'relative' }}
        >
          {isLoading && (
            <div className={styles.loadingDiv}>
              <Typography>
                Loading page {pageNumber}...
              </Typography>
            </div>
          )}
          
          {error && (
            <div className={styles.errorDiv}>
              <Typography>
                {error}
              </Typography>
            </div>
          )}
          
          <Menu
            anchorEl={actionMenuAnchorEl}
            open={Boolean(actionMenuAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleDeletePage}>
              <Typography>Delete Page</Typography>
            </MenuItem>
          </Menu>
          
          <div className={styles.actionButtonWrapper} >
            <div className={styles.actionBtnJustifyWrapper} >
              <Button className={styles.addPageRound} onClick={handleAddBlankPage}>
                <CustomIcon iconName="plus" width={24} height={24} />
              </Button>
              <Button className={styles.threeDotsBtn} onClick={(e: React.MouseEvent<HTMLElement>) => handleMenuClick(e, "action")}>
                <CustomIcon iconName="ellipsis" width={24} height={24} />
              </Button>
            </div>
          </div>
          
          <canvas
            ref={canvasRef}
            className={styles.canvasWrapper}
            accessKey={`canvas-${pageNumber}`}
            key={`canvas-${pageNumber}`}
          />
          
          {/* Render draggable elements for this page */}
          {canvasElements
            .filter(el => el.page === pageNumber)
            .map(element => (
              <DraggableElement
                key={element.id}
                element={element}
                onUpdate={onElementUpdate}
                onDelete={onElementDelete}
                onImageUpload={onImageUpload}
                onSignatureDraw={onSignatureDraw}
                onSelect={onElementSelect}
                pageInfo={pageDimensions[pageNumber] || { pageWidth: 600, pageHeight: 800 }}
                scale={1}
              />
            ))
          }
        </div>
        
        <div className={styles.pageControls}>
          <Typography className={styles.pagesDiv} >
            Page {pageNumber}
            {pageSize.pageWidth > 0 && (
              <span className={styles.pageSpan} >
                ({Math.round(pageSize.pageWidth)} × {Math.round(pageSize.pageHeight)})
              </span>
            )}

            <Button className={styles.addPageBtn} onClick={(e: React.MouseEvent<HTMLElement>) => handleMenuClick(e, "add")}>
              <CustomIcon iconName="plus" width={16} height={16} />
              <Typography className={styles.addPage} >Add Page</Typography>
            </Button>
          </Typography>
          <Menu
            anchorEl={addMenuAnchorEl}
            open={Boolean(addMenuAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleAddBlankPage}>
              <Typography>Add blank page after</Typography>
            </MenuItem>
            <MenuItem onClick={handleUploadAndInsert}>
              <Typography>Upload PDF to insert after</Typography>
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
});

PDFPage.displayName = 'PDFPage';

export default PDFPage;