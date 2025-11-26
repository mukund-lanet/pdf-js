'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PDFDocument } from 'pdf-lib';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Menu from '@trenchaant/pkg-ui-component-library/build/Components/Menu';
import MenuItem from '@trenchaant/pkg-ui-component-library/build/Components/MenuItem';
import BlockContainer from './BlockContainer';
import FillableContainer from './FillableContainer';
import { RootState } from '../../store/reducer/pdfEditor.reducer';
import {
  TextElement, ImageElement, SignatureElement, DateElement, InitialsElement,
  CheckboxElement, HeadingElement, VideoElement, TableElement, PageDimension
} from '../../types';

interface PDFPageProps {
  pdfDoc: any;
  pageNumber: number;
}

const PDFPage = React.memo((({
  pdfDoc,
  pageNumber,
}: PDFPageProps) => {
  const dispatch = useDispatch();

  const pdfBytes = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.pdfBytes);
  const totalPages = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.totalPages);
  const currentPage = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.currentPage);
  const pageDimensions = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.pageDimensions);
  const canvasElements = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.canvasElements);
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

  // Generate unique ID
  const generateId = () => `element_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

  const handleAddBlankPage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();

    if (!pdfBytes) return;

    try {
      dispatch({ type: 'SET_IS_LOADING', payload: true })
      const pdfDoc = await PDFDocument.load(pdfBytes);
      pdfDoc.insertPage(pageNumber, [600, 800]);
      const newPdfBytes = await pdfDoc.save();

      // Update state in a single batch to prevent multiple re-renders
      dispatch({ type: 'SET_PDF_BYTES', payload: newPdfBytes });
      dispatch({ type: 'SET_TOTAL_PAGES', payload: pdfDoc.getPageCount() });

      // Update elements to shift page numbers
      const updatedElements = canvasElements.map((el: { page: number; }) => {
        if (el.page > pageNumber) {
          return { ...el, page: el.page + 1 };
        }
        return el;
      });
      dispatch({ type: 'SET_CANVAS_ELEMENTS', payload: updatedElements });

      // Update page dimensions
      const newPageDimensions: { [key: number]: PageDimension } = {};
      const newPageSize = { pageWidth: 600, pageHeight: 800 };

      // Copy existing dimensions, shifting where necessary
      Object.keys(pageDimensions).forEach(key => {
        const pageNum = parseInt(key);
        if (pageNum <= pageNumber) {
          newPageDimensions[pageNum] = pageDimensions[pageNum];
        } else {
          newPageDimensions[pageNum + 1] = pageDimensions[pageNum];
        }
      });

      // Add the new page dimension
      newPageDimensions[pageNumber + 1] = newPageSize;

      dispatch({ type: 'SET_PAGE_DIMENSIONS', payload: newPageDimensions });
      dispatch({ type: 'SET_CURRENT_PAGE', payload: pageNumber + 1 });
      dispatch({ type: 'SET_IS_LOADING', payload: false })
    } catch (error) {
      dispatch({ type: 'SET_IS_LOADING', payload: false })
      console.error('Error adding blank page:', error);
      alert('Failed to add a blank page.');
    }
  };

  const handleDeletePage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();

    if (!pdfBytes || totalPages <= 1) {
      alert("Cannot delete the last page.");
      return;
    }

    try {
      dispatch({ type: 'SET_IS_LOADING', payload: true })
      const pdfDoc = await PDFDocument.load(pdfBytes);
      pdfDoc.removePage(pageNumber - 1);
      const newPdfBytes = await pdfDoc.save();
      dispatch({ type: 'SET_PDF_BYTES', payload: newPdfBytes });
      dispatch({ type: 'SET_TOTAL_PAGES', payload: pdfDoc.getPageCount() })
      if (currentPage > pdfDoc.getPageCount()) {
        dispatch({ type: 'SET_CURRENT_PAGE', payload: pdfDoc.getPageCount() })
      } else if (currentPage > pageNumber) {
        dispatch({ type: 'SET_CURRENT_PAGE', payload: currentPage - 1 })
      }

      // Update element page numbers and filter out deleted page elements
      dispatch({ type: 'UPDATE_MULTIPLE_ELEMENTS', payload: canvasElements.filter((el: { page: number; }) => el.page !== pageNumber).map((el: { page: number; }) => el.page > pageNumber ? { ...el, page: el.page - 1 } : el) });

      // Update page dimensions keys
      const newPageDimensions: { [key: number]: PageDimension } = {};
      Object.keys(pageDimensions).filter(key => parseInt(key) !== pageNumber).forEach(key => {
        newPageDimensions[parseInt(key) > pageNumber ? parseInt(key) - 1 : parseInt(key)] = pageDimensions[parseInt(key)];
      });
      dispatch({ type: 'SET_PAGE_DIMENSIONS', payload: newPageDimensions })
      dispatch({ type: 'SET_IS_LOADING', payload: false })
    } catch (error) {
      dispatch({ type: 'SET_IS_LOADING', payload: false })
      console.error('Error deleting page:', error);
      alert('Failed to delete the page.');
    }
  };

  const handleUploadAndInsert = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || !pdfBytes) return;

      try {
        dispatch({ type: 'SET_IS_LOADING', payload: true })
        const mainDoc = await PDFDocument.load(pdfBytes);
        const uploadedBytes = await file.arrayBuffer();
        const uploadedDoc = await PDFDocument.load(uploadedBytes);

        const copiedPages = await mainDoc.copyPages(uploadedDoc, uploadedDoc.getPageIndices());
        const numNewPages = copiedPages.length;

        let lastInsertedIndex = pageNumber;
        for (const copiedPage of copiedPages) {
          mainDoc.insertPage(lastInsertedIndex, copiedPage);
          lastInsertedIndex++;
        }

        const newPdfBytes = await mainDoc.save();
        dispatch({ type: 'SET_PDF_BYTES', payload: newPdfBytes });
        dispatch({ type: 'SET_TOTAL_PAGES', payload: mainDoc.getPageCount() })

        // Update elements to shift page numbers
        const updatedElements = canvasElements.map((el: { page: number; }) => {
          if (el.page > pageNumber) {
            return { ...el, page: el.page + numNewPages };
          }
          return el;
        });
        dispatch({ type: 'SET_CANVAS_ELEMENTS', payload: updatedElements });

        // Regenerate all dimensions
        const dimensions: { [key: number]: PageDimension } = {};
        mainDoc.getPages().forEach((page, i) => {
          const { width, height } = page.getSize();
          dimensions[i + 1] = { pageWidth: width, pageHeight: height };
        });
        dispatch({ type: 'SET_PAGE_DIMENSIONS', payload: dimensions })
        dispatch({ type: 'SET_CURRENT_PAGE', payload: pageNumber + 1 })
        dispatch({ type: 'SET_IS_LOADING', payload: false })
      } catch (error) {
        dispatch({ type: 'SET_IS_LOADING', payload: false })
        console.error('Error inserting PDF pages:', error);
        alert('Failed to insert PDF pages.');
      }
    };
    input.click();
  };

  // Cleanup function to cancel any ongoing render tasks
  const cleanupRenderTask = () => {
    if (renderTaskRef.current) {
      try {
        renderTaskRef.current.cancel();
      } catch (error) {
        console.log("error: ", error)
      }
      renderTaskRef.current = null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const renderPage = async () => {
      if (!pdfDoc) return;

      cleanupRenderTask();

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



  const handlePageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'SET_SELECTED_TEXT_ELEMENT', payload: null });
    dispatch({ type: 'SET_CURRENT_PAGE', payload: pageNumber });
  };

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
          onClick={handlePageClick}
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

          <div className={styles.blockLayerWrapper}>
            <BlockContainer
              pageNumber={pageNumber}
              pageWidth={pageSize.pageWidth}
            />
          </div>

          <div className={styles.fillableLayerWrapper} ref={containerRef}>
            <FillableContainer
              pageNumber={pageNumber}
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