'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
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
import { Page } from '../../../utils/interface';
import { SET_CURRENT_PAGE, SET_IS_LOADING, SET_TOTAL_PAGES, UPDATE_MULTIPLE_ELEMENTS, SET_CANVAS_ELEMENTS, SET_SELECTED_TEXT_ELEMENT, SET_PAGES } from '../../../store/action/contractManagement.actions';

const PDFPage = React.memo(({ pageNumber }: { pageNumber: number }) => {
  const dispatch = useDispatch();

  const totalPages = useSelector((state: RootState) => state?.contractManagement?.totalPages);
  const currentPage = useSelector((state: RootState) => state?.contractManagement?.currentPage);
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

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setActionMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setActionMenuAnchorEl(null);
  };

  const handleAddBlankPage = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleMenuClose();

    try {
      const pagesArray = Object.values(pages || {});
      const newPages = [...pagesArray];
      
      const newPageId = uuidv4().replace(/-/g, '').substring(0, 24);
      newPages.splice(pageNumber, 0, { _id: newPageId, fromPdf: false } as Page);
      
      // Convert array back to Record
      const pagesRecord = newPages.reduce((acc, page, index) => {
        const id = page._id || `page-${index}`;
        acc[id] = page;
        return acc;
      }, {} as Record<string, Page>);
      
      dispatch({ type: SET_PAGES, payload: pagesRecord });
      dispatch({ type: SET_TOTAL_PAGES, payload: newPages.length });

      // Update canvasElements with page number shifts
      const elementsArray = Object.values(canvasElements || {});
      const updatedElements = elementsArray.map((el: any) => {
        if (el.page > pageNumber) {
          return { ...el, page: el.page + 1 };
        }
        return el;
      });
      
      // Convert back to Record
      const elementsRecord = updatedElements.reduce((acc, el) => {
        acc[el.id] = el;
        return acc;
      }, {} as Record<string, any>);
      
      dispatch({ type: SET_CANVAS_ELEMENTS, payload: elementsRecord });
      dispatch({ type: SET_CURRENT_PAGE, payload: pageNumber + 1 });

    } catch (error) {
      console.error('Error adding blank page:', error);
      console.warn('Failed to add a blank page.');
    }
  };

  const handleDeletePage = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleMenuClose();

    if (totalPages <= 1) {
      alert("Cannot delete the last page.");
      return;
    }

    try {
      // Update pages array
      const pagesArray = Object.values(pages || {});
      const newPages = [...pagesArray];
      newPages.splice(pageNumber - 1, 1); // Remove the page at the specified index (0-based)
      
      // Convert array back to Record
      const pagesRecord = newPages.reduce((acc, page, index) => {
        const id = page._id || `page-${index}`;
        acc[id] = page;
        return acc;
      }, {} as Record<string, Page>);
      
      dispatch({ type: SET_PAGES, payload: pagesRecord });
      
      // Update total pages
      dispatch({ type: SET_TOTAL_PAGES, payload: newPages.length })
      
      if (currentPage > newPages.length) {
        dispatch({ type: SET_CURRENT_PAGE, payload: newPages.length })
      } else if (currentPage > pageNumber) {
        dispatch({ type: SET_CURRENT_PAGE, payload: currentPage - 1 })
      }

      // Update element page numbers and filter out deleted page elements
      const elementsArray = Object.values(canvasElements || {});
      const updatedElements = elementsArray
        .filter((el: any) => el.page !== pageNumber)
        .map((el: any) => el.page > pageNumber ? { ...el, page: el.page - 1 } : el);
      
      // Convert back to Record
      const elementsRecord = updatedElements.reduce((acc, el: any) => {
        acc[el.id] = el;
        return acc;
      }, {} as Record<string, any>);
        
      dispatch({ type: SET_CANVAS_ELEMENTS, payload: elementsRecord });

    } catch (error) {
      console.error('Error deleting page:', error);
      console.warn('Failed to delete the page.');
    }
  };

  const handleUpsert = async (fileToUpload: any) => {
    if (!fileToUpload) return;

    try {
      dispatch({ type: SET_IS_LOADING, payload: true });

      const fileUrl = fileToUpload.original_url || fileToUpload.url;
      if (!fileUrl) {
        throw new Error('No file URL provided');
      }

      // Insert a placeholder blank page (backend will process and add imagePath later)
      const pagesArray = Object.values(pages || {});
      const newPages = [...pagesArray];
      // Generate MongoDB-like _id for the new page
      const newPageId = uuidv4().replace(/-/g, '').substring(0, 24);
      newPages.splice(pageNumber, 0, { _id: newPageId, fromPdf: true });
      
      // Convert array back to Record
      const pagesRecord = newPages.reduce((acc, page, index) => {
        const id = page._id || `page-${index}`;
        acc[id] = page;
        return acc;
      }, {} as Record<string, Page>);
      
      dispatch({ type: SET_PAGES, payload: pagesRecord });

      dispatch({ type: SET_TOTAL_PAGES, payload: newPages.length });
      dispatch({ type: SET_CURRENT_PAGE, payload: pageNumber + 1 });
      dispatch({ type: SET_IS_LOADING, payload: false });

      console.warn('PDF upload added as placeholder. Backend processing needed to generate page images.');
    } catch (error) {
      dispatch({ type: SET_IS_LOADING, payload: false });
      console.error('Error inserting PDF pages:', error);
    }
  };

  useEffect(() => {
    // Render page based on pages[] Record from backend
    const pagesArray = Object.values(pages || {});
    if (pagesArray && pagesArray.length > 0 && pageNumber <= pagesArray.length) {
      const pageData = pagesArray[pageNumber - 1]; // 0-based index
      
      // Check for imagePath or imageUrl (Firebase URL)
      const imageUrl = pageData?.imagePath || pageData?.imageUrl;
      
      if (imageUrl) {
        // Page has image - render as background
        setImageSrc(imageUrl);
      } else {
        // Page has no image - render white background (blank page)
        setImageSrc(null);
      }
      
      // Set page dimensions
      const pageDim = { pageWidth: 600, pageHeight: 800 };
      setPageSize(pageDim);
    }
  }, [pageNumber, pages]);

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
});

PDFPage.displayName = 'PDFPage';

export default PDFPage;