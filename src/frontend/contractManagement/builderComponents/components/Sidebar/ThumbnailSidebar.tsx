
'use client';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { PDFDocument } from 'pdf-lib';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import EmptyMessageComponent from "@trenchaant/pkg-ui-component-library/build/Components/EmptyMessageComponent";
import SimpleLoading from "@trenchaant/pkg-ui-component-library/build/Components/SimpleLoading";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/reducer/contractManagement.reducer';
import ThumbnailPage from './ThumbnailPage';
import { noPdfDocument } from '../../../utils/utils';
import { SET_PDF_BYTES, REORDER_PAGE_ELEMENTS } from '../../../store/action/contractManagement.actions';

const ThumbnailSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const [pdfjsLib, setPdfjsLib] = useState<any>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const totalPages = useSelector((state: RootState) => state?.contractManagement?.totalPages);
  const pdfBytes = useSelector((state: RootState) => state?.contractManagement?.pdfBytes);
  const [pageIds, setPageIds] = useState<string[]>([]);

  // StrictModeDroppable component
  const StrictModeDroppable = ({ children, ...props }: any) => {
    const [enabled, setEnabled] = useState(false);
    useEffect(() => {
      const animation = requestAnimationFrame(() => setEnabled(true));
      return () => {
        cancelAnimationFrame(animation);
        setEnabled(false);
      };
    }, []);
    if (!enabled) {
      return null;
    }
    return <Droppable {...props}>{children}</Droppable>;
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('pdfjs-dist').then((pdfjs) => {
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
        setPdfjsLib(pdfjs);
      }).catch((error) => {
        console.error('Failed to load PDF.js:', error);
      });
    }
  }, []);

  useEffect(() => {
    const loadPdf = async () => {
      if (!pdfBytes || !pdfjsLib) return;

      try {
        const pdfBytesCopy = new Uint8Array(pdfBytes);
        const loadingTask = pdfjsLib.getDocument({ data: pdfBytesCopy });
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        
        // Initialize page IDs if not already set or if count mismatches
        // We use a simple index-based ID initially, but we need them to be stable across reorders if possible.
        // However, since we re-render the whole list on drop, we can just use a local state that we reorder.
        if (pageIds.length !== pdf.numPages) {
           setPageIds(Array.from({ length: pdf.numPages }, (_, i) => `page-${i + 1}-${Date.now()}`));
        }
      } catch (error) {
        console.error('Error loading PDF for thumbnails:', error);
      }
    };

    loadPdf();
  }, [pdfBytes, pdfjsLib]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    // Reorder local state immediately for UI responsiveness
    const newPageIds = Array.from(pageIds);
    const [movedPageId] = newPageIds.splice(sourceIndex, 1);
    newPageIds.splice(destinationIndex, 0, movedPageId);
    setPageIds(newPageIds);

    try {
      setIsLoading(true);
      if (!pdfBytes) return;

      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      const pageToMove = pages[sourceIndex];

      pdfDoc.removePage(sourceIndex);
      pdfDoc.insertPage(destinationIndex, pageToMove);

      const newPdfBytes = await pdfDoc.save();

      dispatch({ type: SET_PDF_BYTES, payload: newPdfBytes });
      dispatch({
        type: REORDER_PAGE_ELEMENTS,
        payload: { sourceIndex, destinationIndex }
      });

    } catch (error) {
      console.error('Error reordering pages:', error);
      // Revert local state on error
      setPageIds(pageIds);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.thumbnailSidebar}>
      <div className={styles.sidebarHeader}>
        <Typography variant="h6" className={styles.sidebarTitle}>Pages</Typography>
      </div>

      <div className={styles.thumbnailContainer}>
        {pdfDoc && totalPages > 0 ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <StrictModeDroppable droppableId="thumbnail-pages">
              {(provided: any) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ height: '100%' }}
                >
                  {pageIds.map((pageId, index) => (
                    <Draggable key={pageId} draggableId={pageId} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            ...provided.draggableProps.style,
                            marginBottom: '16px'
                          }}
                        >
                          <ThumbnailPage
                            key={`thumbnail_${pageId}`}
                            pdfDoc={pdfDoc}
                            pageNumber={index + 1}
                            isLoading={isLoading}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </StrictModeDroppable>
          </DragDropContext>
        ) : !isLoading && totalPages === 0 ? (
          <div className={styles.noPdfLoaded} >
            <EmptyMessageComponent className={styles.noPdfLoadedEmptyMessage} {...noPdfDocument} />
          </div>
        ) : (
          <div className={styles.loadingWrapper}>
            <SimpleLoading />
          </div>
        )}
      </div>
    </div>
  );
};

export default ThumbnailSidebar;
