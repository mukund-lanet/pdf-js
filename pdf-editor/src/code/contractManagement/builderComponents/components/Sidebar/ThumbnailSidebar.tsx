
'use client';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { PDFDocument } from 'pdf-lib';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import EmptyMessageComponent from "@trenchaant/pkg-ui-component-library/build/Components/EmptyMessageComponent";
import SimpleLoading from "@trenchaant/pkg-ui-component-library/build/Components/SimpleLoading";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/reducer/pdfEditor.reducer';
import ThumbnailPage from './ThumbnailPage';
import { noDocument } from '../../types';

const ThumbnailSidebar = () => {
  const dispatch = useDispatch();
  const [pdfjsLib, setPdfjsLib] = useState<any>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const totalPages = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.totalPages);
  const pdfBytes = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.pdfBytes);

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

    try {
      setIsLoading(true);
      if (!pdfBytes) return;

      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      const pageToMove = pages[sourceIndex];

      pdfDoc.removePage(sourceIndex);
      pdfDoc.insertPage(destinationIndex, pageToMove);

      const newPdfBytes = await pdfDoc.save();

      dispatch({ type: 'SET_PDF_BYTES', payload: newPdfBytes });
      dispatch({
        type: 'REORDER_PAGE_ELEMENTS',
        payload: { sourceIndex, destinationIndex }
      });

    } catch (error) {
      console.error('Error reordering pages:', error);
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
        {isLoading ? (
          <div className={styles.loadingWrapper}>
            <SimpleLoading />
          </div>
        ) : pdfDoc && totalPages > 0 ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="thumbnail-pages">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ height: '100%' }}
                >
                  {Array.from(new Array(totalPages), (el, index) => (
                    <Draggable key={`page-${index + 1}`} draggableId={`page-${index + 1}`} index={index}>
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
                            key={`thumbnail_page_${index + 1}_${pdfDoc ? pdfDoc._pdfInfo.fingerprint : 'no_pdf'}`}
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
            </Droppable>
          </DragDropContext>
        ) : (
          <div className={styles.noPdfLoaded} >
            <EmptyMessageComponent className={styles.noPdfLoadedEmptyMessage} {...noDocument} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ThumbnailSidebar;
