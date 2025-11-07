'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import styles from 'app/(after-login)/(with-header)/pdf-editor/pdfEditor.module.scss';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import SignaturePad from './SignaturePad';
import PDFCanvasViewer from './PDFCanvasViewer';
import DragDropToolbar from './DragDropToolbar';
import DraggableElement from './DraggableElement';
import TextPropertiesToolbar from './TextPropertiesToolbar';
import { CanvasElement, TextElement, ImageElement, SignatureElement } from './types';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import ThumbnailSidebar from './ThumbnailSidebar';
import { injectReducer } from 'components/store';
import reducer from './store/index'
import { useSelector, useDispatch } from 'react-redux';

interface PageDimension {
  pageWidth: number;
  pageHeight: number;
}

const PdfEditor = () => {
  const dispatch = useDispatch();

  const {
    pdfBytes,
    totalPages,
    currentPage,
    isSignaturePadOpen,
    signatureForElement,
    activeTool,
    pageDimensions,
    canvasElements,
    selectedTextElement
  } = useSelector((state: any) => state?.pdfEditor?.pdfEditorReducer);

  const uploadInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { injectReducer("pdfEditor", reducer) }, [])

  // Generate unique ID
  const generateId = () => `element_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

  const createNewPdf = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      pdfDoc.addPage([600, 800]);
      const bytes = await pdfDoc.save();
      dispatch({type: 'SET_TOTAL_PAGES', payload: 1})
      dispatch({type: 'SET_CURRENT_PAGE', payload: 1})
      dispatch({ type: 'SET_PDF_BYTES', payload: bytes })
      dispatch({type: 'SET_CANVAS_ELEMENTS', payload: []})
      dispatch({type: 'SET_PAGE_DIMENSIONS', payload: { 1: { pageWidth: 600, pageHeight: 800 }}})
      dispatch({type: 'SET_SELECTED_TEXT_ELEMENT', payload: null})
    } catch (error) {
      console.error('Error creating new PDF:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {      
      const arrayBuffer = await file.arrayBuffer();
      
      const header = new Uint8Array(arrayBuffer, 0, 5);
      const headerStr = String.fromCharCode(...header);
      
      if (!headerStr.includes('%PDF')) {
        throw new Error('Invalid PDF file: No PDF header found');
      }
      
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();
      
      const dimensions: { [key: number]: PageDimension } = {};
      for (let i = 0; i < pageCount; i++) {
        const page = pdfDoc.getPages()[i];
        const { width, height } = page.getSize();
        dimensions[i + 1] = { pageWidth: width, pageHeight: height };
      }

      dispatch({type: 'SET_TOTAL_PAGES', payload: pageCount})
      dispatch({type: 'SET_CURRENT_PAGE', payload: 1})
      dispatch({ type: 'SET_PDF_BYTES', payload: new Uint8Array(arrayBuffer) })
      dispatch({type: 'SET_CANVAS_ELEMENTS', payload: []})
      dispatch({type: 'SET_PAGE_DIMENSIONS', payload: dimensions})
      dispatch({type: 'SET_SELECTED_TEXT_ELEMENT', payload: null})
      
    } catch (error) {
      console.error('Error loading PDF:', error);
      alert('Failed to load PDF. Please make sure it is a valid PDF file.');
    }
  };

  const handleDragStart = (type: 'text' | 'image' | 'signature') => {
    dispatch({type: 'SET_ACTIVE_TOOL', payload: type})
  };

  const handleDrop = useCallback((x: number, y: number, info: PageDimension, pageNumber: number, type: string) => {
    const elementType = type as 'text' | 'image' | 'signature';

    dispatch({type: 'SET_PAGE_DIMENSIONS', payload: {...pageDimensions, [pageNumber]: info}})

    const defaultSize = {
      text: { width: 200, height: 40 },
      image: { width: 150, height: 100 },
      signature: { width: 150, height: 80 }
    };

    switch (elementType) {
      case 'text':
        const textElement: TextElement = {
          type: 'text',
          id: generateId(),
          x: x - defaultSize.text.width / 2,
          y: y - defaultSize.text.height / 2,
          width: defaultSize.text.width,
          height: defaultSize.text.height,
          content: 'Double click to edit text',
          page: pageNumber,
          fontSize: 12,
          color: '#000000',
          fontWeight: 'normal',
          fontStyle: 'normal',
          textDecoration: 'none',
          textAlign: 'left'
        };
        dispatch({type: 'ADD_CANVAS_ELEMENT', payload: textElement});
        break;

      case 'image':
        const imageElement: ImageElement = {
          type: 'image',
          id: generateId(),
          x: x - defaultSize.image.width / 2,
          y: y - defaultSize.image.height / 2,
          width: defaultSize.image.width,
          height: defaultSize.image.height,
          imageData: '', 
          page: pageNumber
        };
        dispatch({type: 'ADD_CANVAS_ELEMENT', payload: imageElement});
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
        dispatch({type: 'ADD_CANVAS_ELEMENT', payload: signatureElement});
        break;
    }

    dispatch({type: 'SET_ACTIVE_TOOL', payload: null})
  }, []);

  const handleElementUpdate = useCallback((updatedElement: CanvasElement) => {
    dispatch({type: 'UPDATE_CANVAS_ELEMENT', payload: updatedElement});
    
    if (selectedTextElement && selectedTextElement.id === updatedElement.id && updatedElement.type === 'text') {
      dispatch({type: 'SET_SELECTED_TEXT_ELEMENT', payload: updatedElement as TextElement});
    }
  }, [selectedTextElement]);

  const handleElementDelete = useCallback((id: string) => {
    dispatch({type: 'DELETE_CANVAS_ELEMENT', payload: id});
    
    if (selectedTextElement && selectedTextElement.id === id) {
      dispatch({type: 'SET_SELECTED_TEXT_ELEMENT', payload: null});
    }
  }, [selectedTextElement]);

  const handleElementSelect = useCallback((element: CanvasElement) => {
    if (element.type === 'text') {
      dispatch({type: 'SET_SELECTED_TEXT_ELEMENT', payload: element as TextElement});
    } else {
      dispatch({type: 'SET_SELECTED_TEXT_ELEMENT', payload: null});
    }
  }, []);

  const handleImageUpload = useCallback((elementId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png, image/jpeg';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target?.result as string;
          const elementToUpdate = canvasElements.find((el: { id: string; type: string; }) => el.id === elementId && (el.type === 'image' || el.type === 'signature'));
          if (elementToUpdate) {
            dispatch({type: 'UPDATE_CANVAS_ELEMENT', payload: { ...elementToUpdate, imageData }});
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [canvasElements]);

  const handleSignatureDraw = useCallback((elementId: string) => {
    dispatch({type: 'SET_SIGNATURE_FOR_ELEMENT', payload: elementId})
    dispatch({type: 'SET_SIGNATURE_PAD_OPEN', payload: true})
  }, []);

  const handleSaveSignature = (signature: string) => {
    dispatch({type: 'SET_SIGNATURE_PAD_OPEN', payload: false})
    if (signatureForElement) {
      const elementToUpdate = canvasElements.find((el: { id: any; type: string; }) => el.id === signatureForElement && el.type === 'signature');
      if (elementToUpdate) {
        dispatch({type: 'UPDATE_CANVAS_ELEMENT', payload: { ...elementToUpdate, imageData: signature }});
      }
      dispatch({type: 'SET_SIGNATURE_FOR_ELEMENT', payload: null})
    }
  };

  const handleCancelSignature = () => {
    dispatch({type: 'SET_SIGNATURE_PAD_OPEN', payload: false})
    dispatch({type: 'SET_SIGNATURE_FOR_ELEMENT', payload: null})
  };

  const handleCanvasClick = () => {
    dispatch({type: 'SET_SELECTED_TEXT_ELEMENT', payload: null});
  };

  const handleDeletePage = async (pageNumber: number) => {
     if (!pdfBytes || totalPages <= 1) {
        alert("Cannot delete the last page.");
        return;
      }

    try {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      pdfDoc.removePage(pageNumber - 1);
      const newPdfBytes = await pdfDoc.save();
      dispatch({ type: 'SET_PDF_BYTES', payload: newPdfBytes });
      dispatch({type: 'SET_TOTAL_PAGES', payload: pdfDoc.getPageCount()})
      if (currentPage > pdfDoc.getPageCount()) {
        dispatch({type: 'SET_CURRENT_PAGE', payload: pdfDoc.getPageCount()})
      } else if (currentPage > pageNumber) {
        dispatch({type: 'SET_CURRENT_PAGE', payload: currentPage - 1})
      }

      dispatch({type: 'UPDATE_MULTIPLE_ELEMENTS', payload: canvasElements.filter((el: { page: number; }) => el.page !== pageNumber).map((el: { page: number; }) => el.page > pageNumber ? { ...el, page: el.page - 1 } : el)});
      const newPageDimensions: { [key: number]: PageDimension } = {};
      Object.keys(pageDimensions).filter(key => parseInt(key) !== pageNumber).forEach(key => {
          newPageDimensions[parseInt(key) > pageNumber ? parseInt(key) - 1 : parseInt(key)] = pageDimensions[parseInt(key)];
      });
      dispatch({type: 'SET_PAGE_DIMENSIONS', payload: newPageDimensions})

    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Failed to delete the page.');
    }
  };

  const handleAddBlankPage = async (afterPageNumber: number) => {
    if (!pdfBytes) return;

    try {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const newPage = pdfDoc.insertPage(afterPageNumber, [600, 800]);

      const newPdfBytes = await pdfDoc.save();
      dispatch({ type: 'SET_PDF_BYTES', payload: newPdfBytes });
      dispatch({type: 'SET_TOTAL_PAGES', payload: pdfDoc.getPageCount()})

      const updatedElements = canvasElements.map((el: { page: number; }) => {
        if (el.page > afterPageNumber) {
          return { ...el, page: el.page + 1 };
        }
        return el;
      });
      dispatch({type: 'SET_CANVAS_ELEMENTS', payload: updatedElements});

      const newPageDimensions: { [key: number]: PageDimension } = {};
      for (let i = 1; i <= pdfDoc.getPageCount(); i++) {
        if (i <= afterPageNumber) {
          newPageDimensions[i] = pageDimensions[i] || { pageWidth: 600, pageHeight: 800 };
        } else if (i === afterPageNumber + 1) {
          newPageDimensions[i] = { pageWidth: newPage.getWidth(), pageHeight: newPage.getHeight() };
        } else {
          newPageDimensions[i] = pageDimensions[i - 1];
        }
      }
      dispatch({type: 'SET_PAGE_DIMENSIONS', payload: newPageDimensions})
      dispatch({type: 'SET_CURRENT_PAGE', payload: afterPageNumber + 1})

    } catch (error) {
      console.error('Error adding blank page:', error);
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
        const mainDoc = await PDFDocument.load(pdfBytes);
        const uploadedBytes = await file.arrayBuffer();
        const uploadedDoc = await PDFDocument.load(uploadedBytes);

        const copiedPages = await mainDoc.copyPages(uploadedDoc, uploadedDoc.getPageIndices());
        
        let lastInsertedIndex = afterPageNumber;
        for (const copiedPage of copiedPages) {
          mainDoc.insertPage(lastInsertedIndex, copiedPage);
          lastInsertedIndex++;
        }

        const newPdfBytes = await mainDoc.save();
        dispatch({ type: 'SET_PDF_BYTES', payload: newPdfBytes });
        dispatch({type: 'SET_TOTAL_PAGES', payload: mainDoc.getPageCount()})

        const dimensions: { [key: number]: PageDimension } = {};
        mainDoc.getPages().forEach((page, i) => {
          const { width, height } = page.getSize();
          dimensions[i + 1] = { pageWidth: width, pageHeight: height };
        });
        dispatch({type: 'SET_PAGE_DIMENSIONS', payload: dimensions})
        dispatch({type: 'SET_CURRENT_PAGE', payload: afterPageNumber + 1})
        
      } catch (error) {
        console.error('Error inserting PDF pages:', error);
        alert('Failed to insert PDF pages.');
      }
    };
    input.click();
  };

  const exportPdf = async () => {
    if (!pdfBytes) return;
    
    try {
      const pdfBytesCopy = new Uint8Array(pdfBytes);
      const pdfDoc = await PDFDocument.load(pdfBytesCopy);
      
      const fonts = {
        Helvetica: await pdfDoc.embedFont(StandardFonts.Helvetica),
        HelveticaBold: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
        HelveticaOblique: await pdfDoc.embedFont(StandardFonts.HelveticaOblique),
        HelveticaBoldOblique: await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique),
      };

      for (const element of canvasElements) {
        const page = pdfDoc.getPages()[element.page - 1];
        const pageInfo = pageDimensions[element.page];
        
        if (!pageInfo) {
          console.warn(`No page dimensions found for page ${element.page}`);
          continue;
        }

        const pdfPageSize = page.getSize();
        const pdfPageWidth = pdfPageSize.width;
        const pdfPageHeight = pdfPageSize.height;

        const scaleX = pdfPageWidth / pageInfo.pageWidth;
        const scaleY = pdfPageHeight / pageInfo.pageHeight;

        const pdfX = element.x * scaleX;
        const pdfY = pdfPageHeight - (element.y * scaleY) - (element.height * scaleY);
        
        const elementRight = pdfX + (element.width * scaleX);
        const elementBottom = pdfY + (element.height * scaleY);
        
        if (pdfX >= pdfPageWidth || pdfY >= pdfPageHeight || elementRight <= 0 || elementBottom <= 0) {
          console.warn(`Element ${element.id} is outside page bounds, skipping`);
          continue;
        }

        const clampedX = Math.max(0, Math.min(pdfX, pdfPageWidth - 10));
        const clampedY = Math.max(0, Math.min(pdfY, pdfPageHeight - 10));
        const clampedWidth = Math.min(element.width * scaleX, pdfPageWidth - clampedX);
        const clampedHeight = Math.min(element.height * scaleY, pdfPageHeight - clampedY);

        if (element.type === 'text') {
          const textElement = element as TextElement;
          
          let font;
          if (textElement.fontWeight === 'bold' && textElement.fontStyle === 'italic') {
            font = fonts.HelveticaBoldOblique;
          } else if (textElement.fontWeight === 'bold') {
            font = fonts.HelveticaBold;
          } else if (textElement.fontStyle === 'italic') {
            font = fonts.HelveticaOblique;
          } else {
            font = fonts.Helvetica;
          }
          
          const baseFontSize = textElement.fontSize || 12;
          const scaledFontSize = baseFontSize * Math.min(scaleX, scaleY);
          
          const color = textElement.color || '#000000';
          const r = parseInt(color.slice(1, 3), 16) / 255;
          const g = parseInt(color.slice(3, 5), 16) / 255;
          const b = parseInt(color.slice(5, 7), 16) / 255;
          
          const lines = textElement.content.split('\n');
          let currentY = clampedY + (lines.length - 1) * scaledFontSize;

          for (const line of lines) {
            const textWidth = font.widthOfTextAtSize(line, scaledFontSize);
            let textX = clampedX;
            if (textElement.textAlign === 'center') {
              textX = clampedX + (clampedWidth - textWidth) / 2;
            } else if (textElement.textAlign === 'right') {
              textX = clampedX + clampedWidth - textWidth;
            }

            page.drawText(line, {
              x: textX,
              y: currentY,
              font: font,
              size: scaledFontSize,
              color: rgb(r, g, b),
              maxWidth: clampedWidth,
            });
            currentY -= scaledFontSize;
          }
          
          if (textElement.textDecoration === 'underline') {
            const underlineY = clampedY - 2;
            page.drawLine({
              start: { x: clampedX, y: underlineY },
              end: { x: clampedX + clampedWidth, y: underlineY },
              thickness: 1,
              color: rgb(r, g, b),
            });
          }

        } else if ((element.type === 'image' || element.type === 'signature') && element.imageData) {
          try {
            const imageData = element.imageData.split(',')[1];
            if (!imageData) {
              throw new Error('Invalid image data format');
            }
            
            const imageBytes = Uint8Array.from(atob(imageData), c => c.charCodeAt(0));
            
            let image;
            if (element.imageData.startsWith('data:image/jpeg')) {
              image = await pdfDoc.embedJpg(imageBytes);
            } else {
              image = await pdfDoc.embedPng(imageBytes);
            }
            
            const imageDims = image.scale(1);
            const aspectRatio = imageDims.width / imageDims.height;
            
            let finalWidth = clampedWidth;
            let finalHeight = clampedHeight;
            
            if (finalWidth / finalHeight > aspectRatio) {
              finalWidth = finalHeight * aspectRatio;
            } else {
              finalHeight = finalWidth / aspectRatio;
            }
            
            finalWidth = Math.min(finalWidth, clampedWidth);
            finalHeight = Math.min(finalHeight, clampedHeight);
            
            page.drawImage(image, {
              x: clampedX,
              y: clampedY,
              width: finalWidth,
              height: finalHeight,
            });

          } catch (imageError) {
            console.error('Error embedding image:', imageError);
            page.drawRectangle({
              x: clampedX,
              y: clampedY,
              width: clampedWidth,
              height: clampedHeight,
              color: rgb(0.9, 0.9, 0.9),
              borderColor: rgb(0, 0, 0),
              borderWidth: 1,
            });
          }
        }
      }
      
      const finalBytes = await pdfDoc.save();
      const blob = new Blob([finalBytes], { type: 'application/pdf' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document-with-elements.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error exporting PDF. Please try again.');
    }
  };

  return (
    <div className={styles.pdfEditorContainer}>
      {isSignaturePadOpen && (
        <SignaturePad
          onSave={handleSaveSignature}
          onClose={handleCancelSignature}
        />
      )}
      
      <div className={styles.header}>
        <Button className={styles.toolbarItem} onClick={createNewPdf}>
          <Typography className={styles.label} >New Document</Typography>
        </Button>
        <input
          type="file"
          id="pdf-file-upload"
          accept="application/pdf"
          ref={uploadInputRef}
          onChange={handleFileUpload}
          className={styles.toolbarItem}
          style={{ display: 'none' }}
        />
        <Button className={styles.toolbarItem} onClick={() => uploadInputRef.current?.click()}>
          <Typography className={styles.label} >Upload PDF</Typography>
        </Button>
        <Button className={styles.toolbarItem} onClick={exportPdf} disabled={!pdfBytes}>
          <Typography className={styles.label} >Export PDF</Typography>
        </Button>
        <DragDropToolbar 
          onDragStart={handleDragStart}
          activeTool={activeTool}
        />
        {selectedTextElement && (
          <TextPropertiesToolbar
            element={selectedTextElement}
            onUpdate={handleElementUpdate}
          />
        )}
      </div>
      <div className={styles.mainContainer}>
        <ThumbnailSidebar
          pdfBytes={pdfBytes}
          currentPage={currentPage}
          onThumbnailClick={(i: number) => dispatch({type: 'SET_CURRENT_PAGE', payload: i})}
        />
        <div className={styles.editorPanel}>
          <div className={styles.pdfViewerWrapper} >
            <div className={` ${pdfBytes ? styles.pdfViewer : styles.noPdfLoadedWrapper}`}>
              {pdfBytes && totalPages > 0 ? (
                <PDFCanvasViewer
                  key={`page-${currentPage}`}
                  pdfBytes={pdfBytes}
                  pageNumber={currentPage}
                  onDrop={handleDrop}
                  onCanvasClick={handleCanvasClick}
                  onAddBlankPage={handleAddBlankPage}
                  onUploadAndInsertPages={handleUploadAndInsertPages}
                  onDeletePage={handleDeletePage}
                >
                  {canvasElements
                    .filter((el: { page: any; }) => el.page === currentPage)
                    .map((element: CanvasElement) => (
                      <DraggableElement
                        key={element.id}
                        element={element}
                        onUpdate={handleElementUpdate}
                        onDelete={handleElementDelete}
                        onImageUpload={handleImageUpload}
                        onSignatureDraw={handleSignatureDraw}
                        onSelect={handleElementSelect}
                        pageInfo={pageDimensions[currentPage] || { pageWidth: 600, pageHeight: 800 }}
                        scale={1}
                      />
                    ))
                  }
                </PDFCanvasViewer>
              ) : (
                <div className={styles.noPdfLoaded} >
                  <Typography className={styles.noPdfTitle} >No PDF Loaded</Typography>
                  <Typography className={styles.noPdfDescription} >Create a new document or upload a PDF to get started</Typography>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfEditor;