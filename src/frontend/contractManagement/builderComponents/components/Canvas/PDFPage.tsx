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
import MediaManagerList from "@trenchaant/common-component/dist/commonComponent/mediaManager";
import BlockContainer from './BlockContainer';
import FillableContainer from './FillableContainer';
import { RootState } from '../../../store/reducer/contractManagement.reducer';
import { Page, PageDimension } from '../../../utils/interface';
import { SET_CURRENT_PAGE, SET_IS_LOADING, SET_PAGE_DIMENSIONS, SET_PDF_BYTES, SET_TOTAL_PAGES, UPDATE_MULTIPLE_ELEMENTS, SET_CANVAS_ELEMENTS, SET_SELECTED_TEXT_ELEMENT, SET_PAGES } from '../../../store/action/contractManagement.actions';

interface PDFPageProps {
  pdfDoc: any;
  pageNumber: number;
}

const PDFPage = React.memo((({
  pdfDoc,
  pageNumber,
}: PDFPageProps) => {
  const dispatch = useDispatch();

  const pdfBytes = useSelector((state: RootState) => state?.contractManagement?.pdfBytes);
  const totalPages = useSelector((state: RootState) => state?.contractManagement?.totalPages);
  const currentPage = useSelector((state: RootState) => state?.contractManagement?.currentPage);
  const pageDimensions = useSelector((state: RootState) => state?.contractManagement?.pageDimensions);
  const canvasElements = useSelector((state: RootState) => state?.contractManagement?.canvasElements);
  const pages = useSelector((state: RootState) => state?.contractManagement?.pages);
  // const isLoading = useSelector((state: RootState) => state?.contractManagement?.isLoading);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pageSize, setPageSize] = useState<{ pageWidth: number; pageHeight: number }>({ pageWidth: 600, pageHeight: 800 });
  const [selectedMenu, setSelectedMenu] = useState<boolean>(false);
  const [mediaManagerSelection, setMediaManagerSelection] = useState<any[]>([]);
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const renderTaskRef = useRef<any>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setActionMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setActionMenuAnchorEl(null);
  };

  const handleAddBlankPage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();

    try {
      dispatch({ type: SET_IS_LOADING, payload: true })
      
      // Update pages array
      const newPages = [...pages];
      // Insert a new blank page after the current page
      newPages.splice(pageNumber, 0, { fromPdf: false, imagePath: null });
      dispatch({ type: SET_PAGES, payload: newPages });
      
      // Update total pages
      dispatch({ type: SET_TOTAL_PAGES, payload: newPages.length });

      // Update canvas elements page numbers
      const updatedElements = canvasElements.map((el: { page: number; }) => {
        if (el.page > pageNumber) {
          return { ...el, page: el.page + 1 };
        }
        return el;
      });
      dispatch({ type: SET_CANVAS_ELEMENTS, payload: updatedElements });

      // Update page dimensions
      const newPageDimensions: { [key: number]: PageDimension } = {};
      const newPageSize = { pageWidth: 600, pageHeight: 800 };

      Object.keys(pageDimensions).forEach(key => {
        const pageNum = parseInt(key);
        if (pageNum <= pageNumber) {
          newPageDimensions[pageNum] = pageDimensions[pageNum];
        } else {
          newPageDimensions[pageNum + 1] = pageDimensions[pageNum];
        }
      });

      newPageDimensions[pageNumber + 1] = newPageSize;

      dispatch({ type: SET_PAGE_DIMENSIONS, payload: newPageDimensions });
      dispatch({ type: SET_CURRENT_PAGE, payload: pageNumber + 1 });
      dispatch({ type: SET_IS_LOADING, payload: false })
    } catch (error) {
      dispatch({ type: SET_IS_LOADING, payload: false })
      console.error('Error adding blank page:', error);
      alert('Failed to add a blank page.');
    }
  };

  const handleDeletePage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();

    if (totalPages <= 1) {
      alert("Cannot delete the last page.");
      return;
    }

    try {
      dispatch({ type: SET_IS_LOADING, payload: true })
      
      // Update pages array
      const newPages = [...pages];
      newPages.splice(pageNumber - 1, 1); // Remove the page at the specified index (0-based)
      dispatch({ type: SET_PAGES, payload: newPages });
      
      // Update total pages
      dispatch({ type: SET_TOTAL_PAGES, payload: newPages.length })
      
      if (currentPage > newPages.length) {
        dispatch({ type: SET_CURRENT_PAGE, payload: newPages.length })
      } else if (currentPage > pageNumber) {
        dispatch({ type: SET_CURRENT_PAGE, payload: currentPage - 1 })
      }

      // Update element page numbers and filter out deleted page elements
      dispatch({ type: UPDATE_MULTIPLE_ELEMENTS, payload: canvasElements.filter((el: { page: number; }) => el.page !== pageNumber).map((el: { page: number; }) => el.page > pageNumber ? { ...el, page: el.page - 1 } : el) });

      // Update page dimensions keys
      const newPageDimensions: { [key: number]: PageDimension } = {};
      Object.keys(pageDimensions).filter(key => parseInt(key) !== pageNumber).forEach(key => {
        newPageDimensions[parseInt(key) > pageNumber ? parseInt(key) - 1 : parseInt(key)] = pageDimensions[parseInt(key)];
      });
      dispatch({ type: SET_PAGE_DIMENSIONS, payload: newPageDimensions })
      dispatch({ type: SET_IS_LOADING, payload: false })
    } catch (error) {
      dispatch({ type: SET_IS_LOADING, payload: false })
      console.error('Error deleting page:', error);
      alert('Failed to delete the page.');
    }
  };

  const handleUpsert = async (fileToUpload: any) => {
    if (!fileToUpload) return;

    try {
      dispatch({ type: SET_IS_LOADING, payload: true });

      let arrayBuffer: ArrayBuffer;

      // Handle MediaButton media object (has original_url or url)
      if (fileToUpload.original_url || fileToUpload.url) {
        const fileUrl = fileToUpload.original_url || fileToUpload.url;
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch PDF from URL');
        }
        arrayBuffer = await response.arrayBuffer();
      }
      // Handle direct File object
      else if (fileToUpload instanceof File) {
        arrayBuffer = await fileToUpload.arrayBuffer();
      }
      else {
        throw new Error('Invalid file format');
      }

      // Process the PDF to get page count
      const uploadedDoc = await PDFDocument.load(arrayBuffer);
      const numNewPages = uploadedDoc.getPageCount();

      // Update pages array - insert new pages after the current page
      const newPages = [...pages];
      const newPageObjects: Page[] = [];
      for (let i = 0; i < numNewPages; i++) {
        // For now, we'll just add placeholder pages
        // In a real implementation, you would generate image paths for each page
        newPageObjects.push({ fromPdf: true, originalPdfPageIndex: i });
      }
      newPages.splice(pageNumber, 0, ...newPageObjects);
      dispatch({ type: SET_PAGES, payload: newPages });

      // Update total pages
      dispatch({ type: SET_TOTAL_PAGES, payload: newPages.length })

      // Update elements to shift page numbers
      const updatedElements = canvasElements.map((el: { page: number; }) => {
        if (el.page > pageNumber) {
          return { ...el, page: el.page + numNewPages };
        }
        return el;
      });
      dispatch({ type: SET_CANVAS_ELEMENTS, payload: updatedElements });

      // Regenerate all dimensions
      const dimensions: { [key: number]: PageDimension } = {};
      uploadedDoc.getPages().forEach((page, i) => {
        const { width, height } = page.getSize();
        dimensions[pageNumber + i + 1] = { pageWidth: width, pageHeight: height };
      });
      
      // Merge with existing dimensions
      const newPageDimensions = { ...pageDimensions, ...dimensions };
      dispatch({ type: SET_PAGE_DIMENSIONS, payload: newPageDimensions })
      dispatch({ type: SET_CURRENT_PAGE, payload: pageNumber + 1 })
      dispatch({ type: SET_IS_LOADING, payload: false })
    } catch (error) {
      dispatch({ type: SET_IS_LOADING, payload: false })
      console.error('Error inserting PDF pages:', error);
      alert('Failed to insert PDF pages.');
    }
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
    // Check if we have pages data with imagePath
    if (pages && pages.length > 0 && pageNumber <= pages.length) {
      const pageData = pages[pageNumber - 1]; // 0-based index
      if (pageData && pageData.imagePath) {
        // Use the imagePath directly
        setImageSrc(pageData.imagePath);
        // Set default page size or get from pageDimensions
        const pageDim = pageDimensions[pageNumber] || { pageWidth: 600, pageHeight: 800 };
        setPageSize(pageDim);
        return;
      }
    }

    // Fallback to original pdfDoc rendering if no imagePath is available
    let isMounted = true;

    const renderPage = async () => {
      if (!pdfDoc) return;

      cleanupRenderTask();

      dispatch({ type: SET_IS_LOADING, payload: true })

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
          dispatch({ type: SET_IS_LOADING, payload: false })
        }

      } catch (error: any) {
        if (
          error?.name !== "RenderingCancelledException" &&
          error?.message !== "Rendering cancelled"
        ) {
          console.error(`Error rendering page ${pageNumber}:`, error);
        }
      }
    };

    renderPage();

    return () => {
      isMounted = false;
      cleanupRenderTask();
    };
  }, [pdfDoc, pageNumber, pages, pageDimensions]);

  const handlePageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: SET_SELECTED_TEXT_ELEMENT, payload: null });
    dispatch({ type: SET_CURRENT_PAGE, payload: pageNumber });
  };

  const handleMediaSubmit = () => {
    if (mediaManagerSelection.length > 0) {
      const selectedFile = mediaManagerSelection[0];
      handleUpsert(selectedFile);
    }
    setSelectedMenu(false);
    setMediaManagerSelection([]);
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
          <Menu
            anchorEl={actionMenuAnchorEl}
            open={Boolean(actionMenuAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleAddBlankPage}>
              <Typography>Add blank page after</Typography>
            </MenuItem>
            <MenuItem onClick={handleDeletePage}>
              <Typography>Delete Page</Typography>
            </MenuItem>
            <MenuItem onClick={() => setSelectedMenu(true)}>
              <Typography>Insert PDF from media manager</Typography>
            </MenuItem>
          </Menu>
          <MediaManagerList
            type="drawer"
            anchor="right"
            acceptedFileType="application/pdf"
            filterMediaDisplay
            filterMediaUpload
            showHeader
            showFooter
            showSideBar
            isMediaOpen={selectedMenu}
            multiSelection={false}
            handleStateChange={(dataObj: any[]) => setMediaManagerSelection(dataObj)}
            selectedMedia={mediaManagerSelection}
            handleSubmit={handleMediaSubmit}
            handleCancel={() => {
              setSelectedMenu(false);
              setMediaManagerSelection([]);
            }}
            submitButtonText="Select"
            cancelButtonText="Cancel"
            title="Select PDF Document"
          />
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

          {/* { !isLoading && imageSrc ? ( */}
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
          {/* ) : (
            <div className={styles.loadingPageWrapper}>
              <SimpleLoading />
            </div>
          )} */}

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