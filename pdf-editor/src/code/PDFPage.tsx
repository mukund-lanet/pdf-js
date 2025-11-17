'use client';
import React, {useEffect, useRef, useState } from 'react';
import Selecto from "react-selecto";
import Moveable from "react-moveable";
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Menu from '@trenchaant/pkg-ui-component-library/build/Components/Menu';
import MenuItem from '@trenchaant/pkg-ui-component-library/build/Components/MenuItem';
import DraggableElement from './DraggableElement';
import { CanvasElement } from './types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store/reducer/pdfEditor.reducer';

interface PDFPageProps {
  pdfDoc: any;
  pageNumber: number; 
  onPageClick?: (pageNumber: number) => void;
  onDrop?: (x: number, y: number, info: { pageWidth: number; pageHeight: number }, pageNumber: number, type: string) => void;
  onAddBlankPage: (pageNumber: number) => void;
  onUploadAndInsertPages: (pageNumber: number) => void;
  onDeletePage: (pageNumber: number) => void;
  canvasElements: CanvasElement[];
  onElementDelete: (id: string) => void;
}

const PDFPage = React.memo(({
  pdfDoc,
  pageNumber,
  onPageClick,
  onDrop,
  onAddBlankPage,
  onUploadAndInsertPages,
  onDeletePage,
  canvasElements,
  onElementDelete,
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

  const [targets, setTargets] = React.useState<any>([]);
  const moveableRef = React.useRef<Moveable>(null);
  const selectoRef = React.useRef<Selecto>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setActionMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setActionMenuAnchorEl(null);
  };

  const handleAddBlankPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddBlankPage(pageNumber); // Use pageNumber
    handleMenuClose();
  };

  const handleDeletePage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeletePage(pageNumber); // Use pageNumber
    handleMenuClose();
  };

  const handleUploadAndInsert = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUploadAndInsertPages(pageNumber); // Use pageNumber
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

      // Cancel any previous render immediately before starting a new one
      cleanupRenderTask();

      console.log("in render page")
      dispatch({type: 'SET_IS_LOADING', payload: true})
      setError(null);

      try {
        const page = await pdfDoc.getPage(pageNumber); // Use pageNumber here
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

        // Store and await the render task
        const task = page.render(renderContext);
        renderTaskRef.current = task;

        await task.promise;

        if (isMounted) {
          console.log({isLoading, isMounted})
          setImageSrc(canvas.toDataURL('image/png'));
          setPageSize({ pageWidth: viewport.width, pageHeight: viewport.height });
          dispatch({type: 'SET_IS_LOADING', payload: false})
        }

      } catch (error: any) {
        // Ignore intended cancellation
        if (
          error?.name !== "RenderingCancelledException" &&
          error?.message !== "Rendering cancelled"
        ) {
          console.error(`Error rendering page ${pageNumber}:`, error); // Use pageNumber
          if (isMounted) setError(`Failed to render page ${pageNumber}`); // Use pageNumber
        }
      }
    };

    renderPage();

    return () => {
      isMounted = false;
      cleanupRenderTask(); // ✅ also cancel on unmount or dependency change
    };
  }, [pdfDoc, pageNumber]); // Add pageNumber to dependency array

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!onDrop || !imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const type = e.dataTransfer.getData('application/pdf-editor');
    
    if (type) {
      onDrop(x, y, pageSize, pageNumber, type); // Use pageNumber
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handlPageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPageClick){
      onPageClick(pageNumber); // Use pageNumber
    }
  };

  return (
    <div 
      id={`pdf-page-${pageNumber}`} // Use pageNumber
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
          
          {/* Render draggable elements for this page */}
          <Moveable
            ref={moveableRef}
            draggable={true}
            target={targets}
            onClickGroup={e => {
              selectoRef.current!.clickTarget(e.inputEvent, e.inputTarget);
            }}
            onDrag={e => {
              e.target.style.transform = e.transform;
            }}
            onDragGroup={e => {
              e.events.forEach(ev => {
                ev.target.style.transform = ev.transform;
              });
            }}
          ></Moveable>
          <Selecto
            ref={selectoRef}
            dragContainer={window}
            selectableTargets={[".selecto-area .cube"]}
            hitRate={0}
            selectByClick={true}
            selectFromInside={false}
            toggleContinueSelect={["shift"]}
            ratio={0}
            onDragStart={e => {
              const moveable = moveableRef.current!;
              const target = e.inputEvent.target;
              if (
                moveable.isMoveableElement(target)
                // @ts-ignore
                || targets.some(t => t === target || t.contains(target))
              ) {
                e.stop();
              }
            }}
            onSelectEnd={e => {
              const moveable = moveableRef.current!;
              if (e.isDragStart) {
                e.inputEvent.preventDefault();

                moveable.waitToChangeTarget().then(() => {
                  moveable.dragStart(e.inputEvent);
                });
              }
              setTargets(e.selected);
            }}
          ></Selecto>
          <div className={styles.outerSelectMovableWrapper} >
            {canvasElements
              .filter(el => el.page === pageNumber) // Use pageNumber
              .map(element => (
                <div className={styles.innerSelectoMovableDivWrapper} >
                  <DraggableElement
                    key={element.id}
                    element={element}
                    onDelete={onElementDelete}
                  />
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
});
PDFPage.displayName = 'PDFPage';

export default PDFPage;