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
import SimpleLoading from '@trenchaant/pkg-ui-component-library/build/Components/SimpleLoading';
// import MediaButton from "@trenchaant/common-component/dist/commonComponent/mediaButton";
import MediaButton from "components/commonComponentCode/mediaButton";
import BlockContainer from './BlockContainer';
import FillableContainer from './FillableContainer';
import { RootState } from '../../../store/reducer/contractManagement.reducer';
import { Page, PageDimension, GHLBlockElement, GHLFillableElement, isGHLBlockElement, isGHLFillableElement } from '../../../utils/interface';
import { SET_CURRENT_PAGE, SET_IS_LOADING, SET_PAGE_DIMENSIONS, SET_PDF_BYTES, SET_TOTAL_PAGES, UPDATE_MULTIPLE_ELEMENTS, SET_CANVAS_ELEMENTS, SET_SELECTED_TEXT_ELEMENT, ADD_PAGE, DELETE_PAGE } from '../../../store/action/contractManagement.actions';

interface PDFPageProps {
  pdfDoc: any;
  pageNumber: number;
  page: Page | null;
}

const PDFPage = React.memo((({
  pdfDoc,
  pageNumber,
  page,
}: PDFPageProps) => {
  const dispatch = useDispatch();

  const pdfBytes = useSelector((state: RootState) => state?.contractManagement?.pdfBytes);
  const totalPages = useSelector((state: RootState) => state?.contractManagement?.totalPages);
  const currentPage = useSelector((state: RootState) => state?.contractManagement?.currentPage);
  const pageDimensions = useSelector((state: RootState) => state?.contractManagement?.pageDimensions);
  const canvasElements = useSelector((state: RootState) => state?.contractManagement?.canvasElements);
  const isLoading = useSelector((state: RootState) => state?.contractManagement?.isLoading);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pageSize, setPageSize] = useState<{ pageWidth: number; pageHeight: number }>({ pageWidth: 600, pageHeight: 800 });
  const [error, setError] = useState<string | null>(null);
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(page?.component?.options?.src || null);
  const renderTaskRef = useRef<any>(null);

  useEffect(() => {
    if (page?.component?.options?.src) {
      setImageSrc(page.component.options.src);
    }
  }, [page?.component?.options?.src]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setActionMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setActionMenuAnchorEl(null);
  };

  const handleAddBlankPage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();

    if (!pdfBytes) return;

    try {
      dispatch({ type: SET_IS_LOADING, payload: true })
      const pdfDoc = await PDFDocument.load(pdfBytes);
      pdfDoc.insertPage(pageNumber, [600, 800]);
      const newPdfBytes = await pdfDoc.save();

      dispatch({ type: SET_PDF_BYTES, payload: newPdfBytes });
      dispatch({ type: SET_TOTAL_PAGES, payload: pdfDoc.getPageCount() });

      const updatedElements = canvasElements.map((el: { page: number; }) => {
        if (el.page > pageNumber) {
          return { ...el, page: el.page + 1 };
        }
        return el;
      });
      dispatch({ type: SET_CANVAS_ELEMENTS, payload: updatedElements });

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
      
      // Dispatch ADD_PAGE for GHL architecture
      const newPageId = `page_${Date.now()}`;
      const newPage: Page = {
        id: newPageId,
        name: `Page ${pageNumber + 1}`,
        path: `/pages/${newPageId}`,
        updatedAt: new Date().toISOString(),
        previewImage: '', // Blank page
        component: {
          id: `comp_${newPageId}`,
          type: 'Body',
          options: {
            paddingTop: '0px',
            paddingBottom: '0px',
            paddingLeft: '0px',
            paddingRight: '0px',
            src: '', // No background image for blank page
            bgColor: '#ffffff',
            pageDimensions: {
              dimensions: { width: 600, height: 800 },
              margins: { top: 0, right: 0, bottom: 0, left: 0 },
              rotation: 'portrait'
            }
          }
        },
        children: []
      };
      
      dispatch({ 
        type: ADD_PAGE, 
        payload: {
          page: newPage,
          index: pageNumber
        }
      });

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

    if (!pdfBytes || totalPages <= 1) {
      alert("Cannot delete the last page.");
      return;
    }

    try {
      dispatch({ type: SET_IS_LOADING, payload: true })
      const pdfDoc = await PDFDocument.load(pdfBytes);
      pdfDoc.removePage(pageNumber - 1);
      const newPdfBytes = await pdfDoc.save();
      dispatch({ type: SET_PDF_BYTES, payload: newPdfBytes });
      dispatch({ type: SET_TOTAL_PAGES, payload: pdfDoc.getPageCount() })
      if (currentPage > pdfDoc.getPageCount()) {
        dispatch({ type: SET_CURRENT_PAGE, payload: pdfDoc.getPageCount() })
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
      
      // Dispatch DELETE_PAGE for GHL architecture
      if (page) {
        dispatch({ type: DELETE_PAGE, payload: page.id });
      }

      dispatch({ type: SET_IS_LOADING, payload: false })
    } catch (error) {
      dispatch({ type: SET_IS_LOADING, payload: false })
      console.error('Error deleting page:', error);
      alert('Failed to delete the page.');
    }
  };

  const handleUploadAndInsert = async (fileToUpload: any) => {
    if (!fileToUpload || !pdfBytes) return;

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

      const mainDoc = await PDFDocument.load(pdfBytes);
      const uploadedDoc = await PDFDocument.load(arrayBuffer);

      const copiedPages = await mainDoc.copyPages(uploadedDoc, uploadedDoc.getPageIndices());
      const numNewPages = copiedPages.length;

      let lastInsertedIndex = pageNumber;
      for (const copiedPage of copiedPages) {
        mainDoc.insertPage(lastInsertedIndex, copiedPage);
        lastInsertedIndex++;
      }

      const newPdfBytes = await mainDoc.save();
      dispatch({ type: SET_PDF_BYTES, payload: newPdfBytes });
      dispatch({ type: SET_TOTAL_PAGES, payload: mainDoc.getPageCount() })

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
      mainDoc.getPages().forEach((page, i) => {
        const { width, height } = page.getSize();
        dimensions[i + 1] = { pageWidth: width, pageHeight: height };
      });
      dispatch({ type: SET_PAGE_DIMENSIONS, payload: dimensions })
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
    let isMounted = true;

    const renderPage = async () => {
      // If we have an image source from the page object, we don't need to render the PDF
      if (imageSrc && !pdfDoc) return;
      if (!pdfDoc) return;

      cleanupRenderTask();

      dispatch({ type: SET_IS_LOADING, payload: true })
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
          dispatch({ type: SET_IS_LOADING, payload: false })
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
    dispatch({ type: SET_SELECTED_TEXT_ELEMENT, payload: null });
    dispatch({ type: SET_CURRENT_PAGE, payload: pageNumber });
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
            <MenuItem>
              <MediaButton
                classes={{mediaButton: styles.mediaBtnMenu, mediaButtonWrap: styles.mediaBtnMenuWrap}}
                noBtnIcon
                noTooltip
                title="Insert PDF from media manager"
                setSelectedMedia={(selectedMedia: any) => {
                  if (selectedMedia && selectedMedia.length > 0) {
                    handleUploadAndInsert(selectedMedia[0]);
                  }
                }}
                allow={true}
                allowFromLocal={true}
                supportedDocTypes="pdf"
              />
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

          { !isLoading && imageSrc ? (
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
          ) : (
            <div className={styles.loadingPageWrapper}>
              <SimpleLoading />
            </div>
          )}

          <div className={styles.blockLayerWrapper}>
            <BlockContainer
              pageNumber={pageNumber}
              pageWidth={pageSize.pageWidth}
              elements={page?.children.filter(isGHLBlockElement) as GHLBlockElement[] || []}
            />
          </div>

          <div className={styles.fillableLayerWrapper} ref={containerRef}>
            <FillableContainer
              pageNumber={pageNumber}
              containerRef={containerRef}
              elements={page?.children.filter(isGHLFillableElement) as GHLFillableElement[] || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
}));

PDFPage.displayName = 'PDFPage';

export default PDFPage;