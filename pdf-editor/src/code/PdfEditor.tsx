'use client';
import React, { useRef, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import Divider from '@trenchaant/pkg-ui-component-library/build/Components/Divider';
import EmptyMessageComponent from "@trenchaant/pkg-ui-component-library/build/Components/EmptyMessageComponent";
import SimpleLoading from "@trenchaant/pkg-ui-component-library/build/Components/SimpleLoading"
import styles from './pdfEditor.module.scss';
import { injectReducer } from 'components/store';
import reducer from './store/index'
import { TextElement, ImageElement, SignatureElement, DRAWER_COMPONENT_CATEGORY } from './types';
import { RootState } from './store/reducer/pdfEditor.reducer';
import ThumbnailSidebar from './components/Sidebar/ThumbnailSidebar';
import PDFCanvasViewer from './components/Canvas/PDFCanvasViewer';
import DragDropToolbar from './components/Toolbar/DragDropToolbar';
// import TextPropertiesToolbar from './components/Toolbar/TextPropertiesToolbar';
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Tabs from "@trenchaant/pkg-ui-component-library/build/Components/Tabs";
import Tab from "@trenchaant/pkg-ui-component-library/build/Components/Tab";

interface PageDimension {
  pageWidth: number;
  pageHeight: number;
}

const PdfEditor = () => {
  const dispatch = useDispatch();

  const pdfBytes = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.pdfBytes);
  const totalPages = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.totalPages);
  const currentPage = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.currentPage);
  const activeTool = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.activeTool);
  const pageDimensions = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.pageDimensions);
  const canvasElements = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.canvasElements);
  const selectedTextElement = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.selectedTextElement);
  const isLoading = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.isLoading);
  const drawerComponentType = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.drawerComponentCategory);

  const editorPanelRef = useRef<HTMLDivElement>(null); // Ref for scrolling

  const uploadInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { injectReducer("pdfEditor", reducer) }, [])

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

  const createNewPdf = async () => {
    try {
      dispatch({type: 'SET_IS_LOADING', payload: true})
      const pdfDoc = await PDFDocument.create();
      pdfDoc.addPage([600, 800]);
      const bytes = await pdfDoc.save();
      dispatch({type: 'SET_TOTAL_PAGES', payload: 1})
      dispatch({type: 'SET_CURRENT_PAGE', payload: 1})
      dispatch({ type: 'SET_PDF_BYTES', payload: bytes })
      dispatch({type: 'SET_CANVAS_ELEMENTS', payload: []})
      dispatch({type: 'SET_PAGE_DIMENSIONS', payload: { 1: { pageWidth: 600, pageHeight: 800 }}})
      dispatch({type: 'SET_SELECTED_TEXT_ELEMENT', payload: null})
      dispatch({type: 'SET_IS_LOADING', payload: false})
    } catch (error) {
      dispatch({type: 'SET_IS_LOADING', payload: false})
      console.error('Error creating new PDF:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {      
      dispatch({type: 'SET_IS_LOADING', payload: true})
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
      console.log('Error loading PDF:', error);
      alert('Failed to load PDF. Please make sure it is a valid PDF file.');
    } finally {
      dispatch({type: 'SET_IS_LOADING', payload: false})
    }
  };

  const handleDragStart = (type: 'text' | 'image' | 'signature') => {
    dispatch({type: 'SET_ACTIVE_TOOL', payload: type})
  };

  const handleDrop = useCallback((x: number, y: number, info: PageDimension, pageNumber: number, type: string) => {
    const elementType = type as 'text' | 'image' | 'signature';

    // The dimensions of the page are passed up by the canvas viewer on render
    console.log({x, y, info, pageNumber, type})
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
          content: 'Enter text here...',
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
  }, [pageDimensions]);

  const handleElementDelete = useCallback((id: string) => {
    dispatch({type: 'DELETE_CANVAS_ELEMENT', payload: id});
    
    if (selectedTextElement && selectedTextElement.id === id) {
      dispatch({type: 'SET_SELECTED_TEXT_ELEMENT', payload: null});
    }
  }, [selectedTextElement]);

  const handleCanvasClick = (pageNumber: number) => {
    dispatch({type: 'SET_SELECTED_TEXT_ELEMENT', payload: null});
    dispatch({type: 'SET_CURRENT_PAGE', payload: pageNumber}); 
  };

  const handleDeletePage = async (pageNumber: number) => {
     if (!pdfBytes || totalPages <= 1) {
        alert("Cannot delete the last page.");
        return;
      }

    try {
      dispatch({type: 'SET_IS_LOADING', payload: true})
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

      // Update element page numbers and filter out deleted page elements
      dispatch({type: 'UPDATE_MULTIPLE_ELEMENTS', payload: canvasElements.filter((el: { page: number; }) => el.page !== pageNumber).map((el: { page: number; }) => el.page > pageNumber ? { ...el, page: el.page - 1 } : el)});
      
      // Update page dimensions keys
      const newPageDimensions: { [key: number]: PageDimension } = {};
      Object.keys(pageDimensions).filter(key => parseInt(key) !== pageNumber).forEach(key => {
          newPageDimensions[parseInt(key) > pageNumber ? parseInt(key) - 1 : parseInt(key)] = pageDimensions[parseInt(key)];
      });
      dispatch({type: 'SET_PAGE_DIMENSIONS', payload: newPageDimensions})
      dispatch({type: 'SET_IS_LOADING', payload: false})
    } catch (error) {
      dispatch({type: 'SET_IS_LOADING', payload: false})
      console.error('Error deleting page:', error);
      console.log('Error deleting page:', error);
      alert('Failed to delete the page.');
    }
  };

  // In PdfEditor.tsx - Ensure proper state updates
  const handleAddBlankPage = async (afterPageNumber: number) => {
    if (!pdfBytes) return;

    try {
      dispatch({type: 'SET_IS_LOADING', payload: true})
      const pdfDoc = await PDFDocument.load(pdfBytes);
      pdfDoc.insertPage(afterPageNumber, [600, 800]); 
      const newPdfBytes = await pdfDoc.save();
      
      // Update state in a single batch to prevent multiple re-renders
      dispatch({ type: 'SET_PDF_BYTES', payload: newPdfBytes });
      dispatch({type: 'SET_TOTAL_PAGES', payload: pdfDoc.getPageCount()});

      // Update elements to shift page numbers
      const updatedElements = canvasElements.map((el: { page: number; }) => {
        if (el.page > afterPageNumber) {
          return { ...el, page: el.page + 1 };
        }
        return el;
      });
      dispatch({type: 'SET_CANVAS_ELEMENTS', payload: updatedElements});

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
      
      dispatch({type: 'SET_PAGE_DIMENSIONS', payload: newPageDimensions});
      dispatch({type: 'SET_CURRENT_PAGE', payload: afterPageNumber + 1});
      dispatch({type: 'SET_IS_LOADING', payload: false})
    } catch (error) {
      dispatch({type: 'SET_IS_LOADING', payload: false})
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
        dispatch({type: 'SET_IS_LOADING', payload: true})
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
        dispatch({type: 'SET_TOTAL_PAGES', payload: mainDoc.getPageCount()})

        // Update elements to shift page numbers
        const updatedElements = canvasElements.map((el: { page: number; }) => {
          if (el.page > afterPageNumber) {
            return { ...el, page: el.page + numNewPages };
          }
          return el;
        });
        dispatch({type: 'SET_CANVAS_ELEMENTS', payload: updatedElements});

        // Regenerate all dimensions
        const dimensions: { [key: number]: PageDimension } = {};
        mainDoc.getPages().forEach((page, i) => {
          const { width, height } = page.getSize();
          dimensions[i + 1] = { pageWidth: width, pageHeight: height };
        });
        dispatch({type: 'SET_PAGE_DIMENSIONS', payload: dimensions})
        dispatch({type: 'SET_CURRENT_PAGE', payload: afterPageNumber + 1})
        dispatch({type: 'SET_IS_LOADING', payload: false})
      } catch (error) {
        dispatch({type: 'SET_IS_LOADING', payload: false})
        console.error('Error inserting PDF pages:', error);
        console.log('Error inserting PDF pages:', error);
        alert('Failed to insert PDF pages.');
      }
    };
    input.click();
  };

  const exportPdf = async () => {
    if (!pdfBytes) return;
    
    try {
      // It's crucial to work on a copy of pdfBytes to avoid issues with pdf-lib state
      const pdfBytesCopy = new Uint8Array(pdfBytes); 
      const pdfDoc = await PDFDocument.load(pdfBytesCopy);
      
      const fonts = {
        Helvetica: await pdfDoc.embedFont(StandardFonts.Helvetica),
        HelveticaBold: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
        HelveticaOblique: await pdfDoc.embedFont(StandardFonts.HelveticaOblique),
        HelveticaBoldOblique: await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique),
      };

      for (const element of canvasElements) {
        // Validation: Ensure page number is valid
        if (element.page < 1 || element.page > pdfDoc.getPageCount()) {
            console.warn(`Element ${element.id} has invalid page number ${element.page}, skipping`);
            continue;
        }

        const page = pdfDoc.getPages()[element.page - 1];
        const pageInfo = pageDimensions[element.page];
        
        if (!pageInfo) {
          console.warn(`No page dimensions found for page ${element.page}, skipping element ${element.id}`);
          continue;
        }

        const pdfPageSize = page.getSize();
        const pdfPageWidth = pdfPageSize.width;
        const pdfPageHeight = pdfPageSize.height;

        // Calculate scaling factors based on the canvas dimensions vs. the PDF page dimensions
        const scaleX = pdfPageWidth / pageInfo.pageWidth;
        const scaleY = pdfPageHeight / pageInfo.pageHeight;

        // Convert element coordinates from canvas-space (top-left origin, Y-down)
        // to PDF-space (bottom-left origin, Y-up)
        const pdfX = element.x * scaleX;
        const pdfY = pdfPageHeight - (element.y * scaleY) - (element.height * scaleY);
        
        // Boundary check (simplified)
        const elementRight = pdfX + (element.width * scaleX);
        const elementBottom = pdfY + (element.height * scaleY);
        
        if (pdfX >= pdfPageWidth || pdfY >= pdfPageHeight || elementRight <= 0 || elementBottom <= 0) {
          console.warn(`Element ${element.id} is outside page bounds, skipping`);
          continue;
        }
        
        // Clamp coordinates and dimensions to ensure they stay within the PDF page boundaries
        const clampedX = Math.max(0, pdfX);
        const clampedY = Math.max(0, pdfY);
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
          const scaledFontSize = baseFontSize * Math.min(scaleX, scaleY); // Scale font size consistently
          
          const color = textElement.color || '#000000';
          const r = parseInt(color.slice(1, 3), 16) / 255;
          const g = parseInt(color.slice(3, 5), 16) / 255;
          const b = parseInt(color.slice(5, 7), 16) / 255;
          
          const lines = textElement.content.split('\n');
          // Starting Y position is the bottom of the last line of text
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
            currentY -= scaledFontSize; // Move up for the next line
          }
          
          if (textElement.textDecoration === 'underline') {
            // Underline is usually slightly below the baseline
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
            const base64Data = element.imageData.split(',')[1];
            if (!base64Data) {
              throw new Error('Invalid image data format');
            }
            
            const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
            
            let image;
            if (element.imageData.startsWith('data:image/jpeg')) {
              image = await pdfDoc.embedJpg(imageBytes);
            } else {
              // Assume PNG if not JPEG, covering both image and signature PNGs
              image = await pdfDoc.embedPng(imageBytes); 
            }
            
            const imageDims = image.scale(1);
            const aspectRatio = imageDims.width / imageDims.height;
            
            let finalWidth = clampedWidth;
            let finalHeight = clampedHeight;
            
            // Logic for proportional scaling (contain)
            if (finalWidth / finalHeight > aspectRatio) {
              finalWidth = finalHeight * aspectRatio;
            } else {
              finalHeight = finalWidth / aspectRatio;
            }
            
            // Re-clamp in case proportional scaling overshot the original bounds (shouldn't happen with the current logic, but safe)
            finalWidth = Math.min(finalWidth, clampedWidth);
            finalHeight = Math.min(finalHeight, clampedHeight);
            
            // Center the image within the bounding box (optional, but good practice)
            const centerX = clampedX + (clampedWidth - finalWidth) / 2;
            const centerY = clampedY + (clampedHeight - finalHeight) / 2;

            page.drawImage(image, {
              x: centerX,
              y: centerY,
              width: finalWidth,
              height: finalHeight,
            });

          } catch (imageError) {
            console.error(`Error embedding image for element ${element.id}:`, imageError);
            // Draw a placeholder rectangle on failure
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
      // @ts-ignore
      const blob = new Blob([finalBytes], { type: 'application/pdf' });
      
      // Trigger download
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
      console.log('Error exporting PDF:', error);
      alert('Error exporting PDF. Please try again.');
    }
  };

  const noDocument = {
    message: "No documents found",
    description: "There are no documents to display.",
    tips: [
      "Create new document",
      "Upload pdf and start editing",
      "Add docusign in integration"
    ],
    iconName: "pen-line",
    tipsTitle: "Quick tips"
  }
  
  const tabItems = {
    [DRAWER_COMPONENT_CATEGORY.ADD_ELEMENTS]: {
      name: "Elements",
      icon: "square",
      title: "Add elements",
      description: "Drag components into your document",
    },
    [DRAWER_COMPONENT_CATEGORY.PAGES]: {
      name: "Pages",
      icon: "layers",
      title: "Page Manager",
      description: "Organize and manage document pages",
    },
    [DRAWER_COMPONENT_CATEGORY.DOCUMENT_VARIABLES]: {
      name: "Variables",
      icon: "braces",
      title: "Document Variables",
      description: "Create and manage dynamic variables",
    },
    [DRAWER_COMPONENT_CATEGORY.CONTENT_LIBRARY]: {
      name: "Library",
      icon: "folder",
      title: "Content Library",
      description: "Reuse saved sections and templates",
    },
    [DRAWER_COMPONENT_CATEGORY.SETTINGS]: {
      name: "Settings",
      icon: "settings",
      title: "Document Settings",
      description: "Configure document preferences",
    },
  };

  return (
    <div className={styles.pdfEditorContainer}>
      <div className={styles.toolbarWrapper} >
        <div className={styles.toolbarDragDropBarWrapper} >
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
          {/* <Button className={styles.toolbarItem} onClick={exportPdf} disabled={!pdfBytes}>
            <Typography className={styles.label} >Export PDF</Typography>
          </Button> */}
          {/* {selectedTextElement && (
            <TextPropertiesToolbar
              element={selectedTextElement}
              onUpdate={handleElementUpdate}
            />
          )} */}

          {/* <DragDropToolbar 
            onDragStart={handleDragStart}
            activeTool={activeTool}
          /> */}
        </div>
        <Button
          variant={"contained"}
          color={"primary"}
          startIcon={
            <CustomIcon iconName='save' height={16} width={16} variant={"white"} />
          }
        >
          <Typography> Save </Typography>
        </Button>
      </div>
      <div className={styles.leftSideBarDrawer} >
        <Tabs
          indicatorColor="primary"
          textColor="primary"
          value={drawerComponentType}
          className={styles.leftSideTabs}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => dispatch({type: 'SET_DRAWER_COMPONENT_CATEGORY', payload: event.target.value})}
        >
          {Object.entries(tabItems).map(([value, item]) => (
            <Tab className={styles.leftSideTab} classes={{ root: styles.leftSideTabRoot }} icon={<CustomIcon iconName={item.icon} height={16} width={16} variant='gray'/>} label={item.name} value={value} />
          ))}
        </Tabs>
      </div>

      <Divider orientation="horizontal" className={styles.toolbarDivider} />

      <div className={styles.mainContainer}>
        <div className={styles.leftSideDrawerWrapper} >
          { drawerComponentType === DRAWER_COMPONENT_CATEGORY.ADD_ELEMENTS &&
            <DragDropToolbar 
              onDragStart={handleDragStart}
              activeTool={activeTool}
            />}
          { drawerComponentType === DRAWER_COMPONENT_CATEGORY.PAGES && 
            <ThumbnailSidebar
              pdfBytes={pdfBytes}
              currentPage={currentPage}
              onThumbnailClick={(i: number) => dispatch({type: 'SET_CURRENT_PAGE', payload: i})}
            />}
        </div>
        <div className={styles.editorPanel} ref={editorPanelRef}>
          <div className={styles.pdfViewerWrapper} >
            <div className={` ${pdfBytes ? styles.pdfViewer : styles.noPdfLoadedWrapper}`}>
              { pdfBytes && totalPages > 0 ? (
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
        <div className={styles.rightSideBarDrawer} >
          <div className={styles.builderRightSideHeaderTitleWrapper}>
            <CustomIcon iconName="settings" width={20} height={20} />
            <Typography fontWeight="600" className={styles.builderRightSideHeaderTitle}> Properties </Typography>
          </div>
          <div className={styles.emptyMessage}>
            <div className={styles.iconWrapper}>
              <CustomIcon iconName="settings" width={48} height={48} customColor="#d1d5db" />
            </div>
            <h3 className={styles.title}>No Element Selected</h3>
            <p className={styles.description}>
              Click on an element in the canvas to view and edit its properties
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfEditor;