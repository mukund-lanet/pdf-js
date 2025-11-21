'use client';
import React, { useRef, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PDFDocument } from 'pdf-lib';
import SimpleLoading from "@trenchaant/pkg-ui-component-library/build/Components/SimpleLoading"
import EmptyMessageComponent from "@trenchaant/pkg-ui-component-library/build/Components/EmptyMessageComponent";
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import PDFCanvasViewer from '../Canvas/PDFCanvasViewer';
import { TextElement, ImageElement, SignatureElement, DateElement, InitialsElement, CheckboxElement, HeadingElement, VideoElement, TableElement, PageDimension, noDocument } from '../../types';
import { RootState } from '../../store/reducer/pdfEditor.reducer';

const EditorMainArea = () => {
  const dispatch = useDispatch();
  const editorPanelRef = useRef<HTMLDivElement>(null);

  const pdfBytes = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.pdfBytes);
  const totalPages = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.totalPages);
  const currentPage = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.currentPage);
  const pageDimensions = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.pageDimensions);
  const canvasElements = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.canvasElements);
  const selectedTextElement = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.selectedTextElement);
  const isLoading = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.isLoading);

  // Scroll to the selected page when currentPage changes
  useEffect(() => {
    if (editorPanelRef.current) {
      const pageElement = editorPanelRef.current.querySelector(`#pdf-page-${currentPage}`);
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [currentPage]);

  // Generate unique ID
  const generateId = () => `element_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

  const handleDrop = useCallback((x: number, y: number, info: PageDimension, pageNumber: number, type: string) => {
    const elementType = type as 'text-field' | 'image' | 'signature' | 'date' | 'initials' | 'checkbox' | 'heading' | 'video' | 'table';

    console.log({ x, y, info, pageNumber, type })
    dispatch({ type: 'SET_PAGE_DIMENSIONS', payload: { ...pageDimensions, [pageNumber]: info } })

    const defaultSize = {
      heading: { height: 115 },
      'text-field': { width: 200, height: 40 },
      image: { height: 300 },
      signature: { width: 150, height: 80 },
      date: { width: 150, height: 40 },
      initials: { width: 100, height: 60 },
      checkbox: { width: 40, height: 40 },
      video: { height: 300 },
      table: { height: 200 }
    };

    // Calculate order for block elements
    const getNextOrder = (page: number) => {
      const pageBlocks = canvasElements.filter(el =>
        el.page === page && ['heading', 'image', 'video', 'table'].includes(el.type)
      );
      return pageBlocks.length > 0
        ? Math.max(...pageBlocks.map((el: any) => el.order || 0)) + 1
        : 0;
    };

    switch (elementType) {
      case 'heading':
        const headingElement: HeadingElement = {
          type: 'heading',
          id: generateId(),
          order: getNextOrder(pageNumber),
          height: defaultSize.heading.height,
          content: 'Heading',
          page: pageNumber,
          fontSize: 32,
          fontWeight: '700'
        };
        dispatch({ type: 'ADD_CANVAS_ELEMENT', payload: headingElement });
        break;

      case 'text-field':
        const textElement: TextElement = {
          type: 'text-field',
          id: generateId(),
          x: x - defaultSize['text-field'].width / 2,
          y: y - defaultSize['text-field'].height / 2,
          width: defaultSize['text-field'].width,
          height: defaultSize['text-field'].height,
          content: 'Enter text here...',
          page: pageNumber,
          fontSize: 12,
          color: '#000000',
          fontWeight: 'normal',
          fontStyle: 'normal',
          textDecoration: 'none',
          textAlign: 'left'
        };
        dispatch({ type: 'ADD_CANVAS_ELEMENT', payload: textElement });
        break;

      case 'image':
        const imageElement: ImageElement = {
          type: 'image',
          id: generateId(),
          order: getNextOrder(pageNumber),
          height: defaultSize.image.height,
          imageData: '',
          page: pageNumber
        };
        dispatch({ type: 'ADD_CANVAS_ELEMENT', payload: imageElement });
        break;

      case 'video':
        const videoElement: VideoElement = {
          type: 'video',
          id: generateId(),
          order: getNextOrder(pageNumber),
          height: defaultSize.video.height,
          videoUrl: '',
          page: pageNumber
        };
        dispatch({ type: 'ADD_CANVAS_ELEMENT', payload: videoElement });
        break;

      case 'table':
        const tableElement: TableElement = {
          type: 'table',
          id: generateId(),
          order: getNextOrder(pageNumber),
          height: defaultSize.table.height,
          rows: 2,
          columns: 2,
          page: pageNumber
        };
        dispatch({ type: 'ADD_CANVAS_ELEMENT', payload: tableElement });
        break;

      case 'signature':
        const signatureElement: SignatureElement = {
          type: 'signature',
          id: generateId(),
          x: x - defaultSize.signature.width / 2,
          y: y - defaultSize.signature.height / 2,
          width: defaultSize.signature.width,
          height: defaultSize.signature.height,
          imageData: '',
          page: pageNumber
        };
        dispatch({ type: 'ADD_CANVAS_ELEMENT', payload: signatureElement });
        break;

      case 'date':
        const dateElement: DateElement = {
          type: 'date',
          id: generateId(),
          x: x - defaultSize.date.width / 2,
          y: y - defaultSize.date.height / 2,
          width: defaultSize.date.width,
          height: defaultSize.date.height,
          value: '',
          page: pageNumber
        };
        dispatch({ type: 'ADD_CANVAS_ELEMENT', payload: dateElement });
        break;

      case 'initials':
        const initialsElement: InitialsElement = {
          type: 'initials',
          id: generateId(),
          x: x - defaultSize.initials.width / 2,
          y: y - defaultSize.initials.height / 2,
          width: defaultSize.initials.width,
          height: defaultSize.initials.height,
          content: '',
          page: pageNumber
        };
        dispatch({ type: 'ADD_CANVAS_ELEMENT', payload: initialsElement });
        break;

      case 'checkbox':
        const checkboxElement: CheckboxElement = {
          type: 'checkbox',
          id: generateId(),
          x: x - defaultSize.checkbox.width / 2,
          y: y - defaultSize.checkbox.height / 2,
          width: defaultSize.checkbox.width,
          height: defaultSize.checkbox.height,
          checked: false,
          page: pageNumber
        };
        dispatch({ type: 'ADD_CANVAS_ELEMENT', payload: checkboxElement });
        break;
    }

    dispatch({ type: 'SET_ACTIVE_TOOL', payload: null })
  }, [pageDimensions, canvasElements, dispatch]);

  const handleElementDelete = useCallback((id: string) => {
    dispatch({ type: 'DELETE_CANVAS_ELEMENT', payload: id });

    if (selectedTextElement && selectedTextElement.id === id) {
      dispatch({ type: 'SET_SELECTED_TEXT_ELEMENT', payload: null });
    }
  }, [selectedTextElement, dispatch]);

  const handleCanvasClick = (pageNumber: number) => {
    dispatch({ type: 'SET_SELECTED_TEXT_ELEMENT', payload: null });
    dispatch({ type: 'SET_CURRENT_PAGE', payload: pageNumber });
  };

  const handleDeletePage = async (pageNumber: number) => {
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
      console.log('Error deleting page:', error);
      alert('Failed to delete the page.');
    }
  };

  const handleAddBlankPage = async (afterPageNumber: number) => {
    if (!pdfBytes) return;

    try {
      dispatch({ type: 'SET_IS_LOADING', payload: true })
      const pdfDoc = await PDFDocument.load(pdfBytes);
      pdfDoc.insertPage(afterPageNumber, [600, 800]);
      const newPdfBytes = await pdfDoc.save();

      // Update state in a single batch to prevent multiple re-renders
      dispatch({ type: 'SET_PDF_BYTES', payload: newPdfBytes });
      dispatch({ type: 'SET_TOTAL_PAGES', payload: pdfDoc.getPageCount() });

      // Update elements to shift page numbers
      const updatedElements = canvasElements.map((el: { page: number; }) => {
        if (el.page > afterPageNumber) {
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
        if (pageNum <= afterPageNumber) {
          newPageDimensions[pageNum] = pageDimensions[pageNum];
        } else {
          newPageDimensions[pageNum + 1] = pageDimensions[pageNum];
        }
      });

      // Add the new page dimension
      newPageDimensions[afterPageNumber + 1] = newPageSize;

      dispatch({ type: 'SET_PAGE_DIMENSIONS', payload: newPageDimensions });
      dispatch({ type: 'SET_CURRENT_PAGE', payload: afterPageNumber + 1 });
      dispatch({ type: 'SET_IS_LOADING', payload: false })
    } catch (error) {
      dispatch({ type: 'SET_IS_LOADING', payload: false })
      console.error('Error adding blank page:', error);
      console.log('Error adding blank page:', error);
      alert('Failed to add a blank page.');
    }
  };

  const handleUploadAndInsertPages = (afterPageNumber: number) => {
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

        let lastInsertedIndex = afterPageNumber;
        for (const copiedPage of copiedPages) {
          mainDoc.insertPage(lastInsertedIndex, copiedPage);
          lastInsertedIndex++;
        }

        const newPdfBytes = await mainDoc.save();
        dispatch({ type: 'SET_PDF_BYTES', payload: newPdfBytes });
        dispatch({ type: 'SET_TOTAL_PAGES', payload: mainDoc.getPageCount() })

        // Update elements to shift page numbers
        const updatedElements = canvasElements.map((el: { page: number; }) => {
          if (el.page > afterPageNumber) {
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
        dispatch({ type: 'SET_CURRENT_PAGE', payload: afterPageNumber + 1 })
        dispatch({ type: 'SET_IS_LOADING', payload: false })
      } catch (error) {
        dispatch({ type: 'SET_IS_LOADING', payload: false })
        console.error('Error inserting PDF pages:', error);
        console.log('Error inserting PDF pages:', error);
        alert('Failed to insert PDF pages.');
      }
    };
    input.click();
  };

  return (
    <div className={styles.editorPanel} ref={editorPanelRef}>
      <div className={styles.pdfViewerWrapper} >
        <div className={` ${pdfBytes ? styles.pdfViewer : styles.noPdfLoadedWrapper}`}>
          {pdfBytes && totalPages > 0 ? (
            <PDFCanvasViewer
              pdfBytes={pdfBytes}
              onDrop={handleDrop}
              onPageClick={handleCanvasClick}
              onAddBlankPage={handleAddBlankPage}
              onUploadAndInsertPages={handleUploadAndInsertPages}
              onDeletePage={handleDeletePage}
              canvasElements={canvasElements}
              onElementDelete={handleElementDelete}
            />
          ) : isLoading ? <div className={styles.simpleLoadingWrapper} > <SimpleLoading /> </div>
            : (
              <div className={styles.noPdfLoaded} >
                <EmptyMessageComponent {...noDocument} />
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default EditorMainArea;
