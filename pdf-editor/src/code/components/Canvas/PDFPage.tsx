'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Menu from '@trenchaant/pkg-ui-component-library/build/Components/Menu';
import MenuItem from '@trenchaant/pkg-ui-component-library/build/Components/MenuItem';
import BlockContainer from './BlockContainer';
import FillableContainer from './FillableContainer';
import { isBlockElement, isFillableElement, CanvasElement } from '../../types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/reducer/pdfEditor.reducer';

interface PDFPageProps {
  pdfDoc: any;
  pageNumber: number;
  onPageClick?: (pageNumber: number) => void;
  onDrop?: (x: number, y: number, info: { pageWidth: number; pageHeight: number }, pageNumber: number, type: string) => void;
  onAddBlankPage: (pageNumber: number) => void;
  onUploadAndInsertPages: (pageNumber: number) => void;
  onDeletePage: (pageNumber: number) => void;
  onElementDelete: (id: string) => void;
  canvasElements: CanvasElement[];
}

const PDFPage = React.memo((({
  pdfDoc,
  pageNumber,
  onPageClick,
  onDrop,
  onAddBlankPage,
  onUploadAndInsertPages,
  onDeletePage,
  onElementDelete,
  canvasElements,
}: PDFPageProps) => {
  const dispatch = useDispatch();

  const currentPageFromStore = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.currentPage);
  const isLoading = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.isLoading);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pageSize, setPageSize] = useState<{ pageWidth: number; pageHeight: number }>({ pageWidth: 600, pageHeight: 800 });
  const [error, setError] = useState<string | null>(null);
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const renderTaskRef = useRef<any>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setActionMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setActionMenuAnchorEl(null);
  };

  const handleAddBlankPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddBlankPage(pageNumber);
    handleMenuClose();
  };

  const handleDeletePage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeletePage(pageNumber);
    handleMenuClose();
  };

  const handleUploadAndInsert = (e: React.MouseEvent) => {
    e.stopPropagation();
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
      if (!pdfDoc) return;

      cleanupRenderTask();

      console.log("in render page")
      dispatch({ type: 'SET_IS_LOADING', payload: true })
      setError(null);

      try {
        const page = await pdfDoc.getPage(pageNumber);
        if (!isMounted) return;

        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error("Could not get canvas context");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);

        const renderContext = { canvasContext: context, viewport };

        const task = page.render(renderContext);
        renderTaskRef.current = task;

        await task.promise;

        if (isMounted) {
          console.log({ isLoading, isMounted })
          setImageSrc(canvas.toDataURL('image/png'));
          setPageSize({ pageWidth: viewport.width, pageHeight: viewport.height });
          dispatch({ type: 'SET_IS_LOADING', payload: false })
        }

      } catch (error: any) {
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
      cleanupRenderTask();
    };
  }, [pdfDoc, pageNumber]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!onDrop || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
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

  const handlPageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPageClick) {
      onPageClick(pageNumber);
    }
  };

  // Separate elements by type
  const pageElements = canvasElements.filter(el => el.page === pageNumber);
  const blockElements = pageElements.filter(isBlockElement);
  const fillableElements = pageElements.filter(isFillableElement);

  return (
    <div
      id={`pdf-page-${pageNumber}`}
      className={styles.pdfPageContainer}
    >
      <div
        ref={containerRef}
        className={styles.pdfCanvasViewer}
      >
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handlPageClick}
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
            <MenuItem onClick={handleAddBlankPage}>
              <Typography>Add blank page after</Typography>
            </MenuItem>
            <MenuItem onClick={handleUploadAndInsert}>
              <Typography>Upload PDF to insert after</Typography>
            </MenuItem>
            <MenuItem onClick={handleDeletePage}>
              <Typography>Delete Page</Typography>
            </MenuItem>
          </Menu>

          <div className={styles.actionButtonWrapper} >
            <div className={styles.actionBtnJustifyWrapper} >
              <Button className={styles.addPageRound} onClick={handleAddBlankPage}>
                <CustomIcon iconName="plus" width={24} height={24} />
              </Button>
              <Button className={styles.threeDotsBtn} onClick={handleMenuClick}>
                <CustomIcon iconName="ellipsis" width={24} height={24} />
              </Button>
            </div>
          </div>

          {imageSrc && (
            <div
              ref={imageRef}
              className={styles.canvasWrapper}
              style={{
                width: '100%',
                paddingTop: `${(pageSize.pageHeight / pageSize.pageWidth) * 100}%`,
                // @ts-ignore
                "--bg-image": `url(${imageSrc})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            />
          )}

          {/* Block Elements Container (z-index: 1) */}
          <div className={styles.blockLayerWrapper}>
            <BlockContainer
              blocks={blockElements}
              pageNumber={pageNumber}
              onDelete={onElementDelete}
              pageWidth={pageSize.pageWidth}
            />
          </div>

          {/* Fillable Elements Container (z-index: 2) */}
          <div className={styles.fillableLayerWrapper}>
            <FillableContainer
              fillableElements={fillableElements}
              pageNumber={pageNumber}
              onDelete={onElementDelete}
              containerRef={containerRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
}));
PDFPage.displayName = 'PDFPage';

export default PDFPage;