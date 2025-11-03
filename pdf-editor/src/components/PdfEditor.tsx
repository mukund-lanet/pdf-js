'use client';
import { useState, useRef, useCallback } from 'react';
import styles from '../styles/PdfEditor.module.scss';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import SignaturePad from './SignaturePad';
import PDFCanvasViewer from './PDFCanvasViewer';
import DragDropToolbar from './DragDropToolbar';
import DraggableElement from './DraggableElement';
import { CanvasElement, TextElement, ImageElement, SignatureElement } from '../types';

interface PageDimension {
  pageWidth: number;
  pageHeight: number;
}

const PdfEditor = () => {
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [isSignaturePadOpen, setIsSignaturePadOpen] = useState(false);
  const [signatureForElement, setSignatureForElement] = useState<string | null>(null);

  const [activeTool, setActiveTool] = useState<null | 'text' | 'image' | 'signature'>(null);
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [pageDimensions, setPageDimensions] = useState<{ [key: number]: PageDimension }>({});

  // Generate unique ID
  const generateId = () => `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const createNewPdf = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]);
      const bytes = await pdfDoc.save();
      setTotalPages(1);
      setPdfBytes(bytes);
      setCanvasElements([]);
      setPageDimensions({ 1: { pageWidth: 600, pageHeight: 800 } });
    } catch (error) {
      console.error('Error creating new PDF:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {      
      const arrayBuffer = await file.arrayBuffer();
      
      // Validate PDF header
      const header = new Uint8Array(arrayBuffer, 0, 5);
      const headerStr = String.fromCharCode(...header);
      
      if (!headerStr.includes('%PDF')) {
        throw new Error('Invalid PDF file: No PDF header found');
      }
      
      // Load with pdf-lib to get page info
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();
      
      // Get dimensions of all pages
      const dimensions: { [key: number]: PageDimension } = {};
      for (let i = 0; i < pageCount; i++) {
        const page = pdfDoc.getPages()[i];
        const { width, height } = page.getSize();
        dimensions[i + 1] = { pageWidth: width, pageHeight: height };
      }
      
      setTotalPages(pageCount);
      // Create a fresh copy to avoid detached ArrayBuffer
      setPdfBytes(new Uint8Array(arrayBuffer));
      setCanvasElements([]);
      setPageDimensions(dimensions);
      
    } catch (error) {
      console.error('Error loading PDF:', error);
      alert('Failed to load PDF. Please make sure it is a valid PDF file.');
    }
  };

  const openFileUpload = () => uploadInputRef.current?.click();

  const handleDragStart = (type: 'text' | 'image' | 'signature') => {
    setActiveTool(type);
  };

  const handleDrop = useCallback((x: number, y: number, info: PageDimension, pageNumber: number, type: string) => {
    const elementType = type as 'text' | 'image' | 'signature';

    // Update page dimensions
    setPageDimensions(prev => ({
      ...prev,
      [pageNumber]: info
    }));

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
          x: x,
          y: y, // Use direct Y coordinate (not inverted)
          width: defaultSize.text.width,
          height: defaultSize.text.height,
          content: 'Double click to edit text',
          page: pageNumber
        };
        setCanvasElements(prev => [...prev, textElement]);
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
        setCanvasElements(prev => [...prev, imageElement]);
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
        setCanvasElements(prev => [...prev, signatureElement]);
        break;
    }

    setActiveTool(null);
  }, []);

  const handleElementUpdate = useCallback((updatedElement: CanvasElement) => {
    setCanvasElements(prev => 
      prev.map(el => el.id === updatedElement.id ? updatedElement : el)
    );
  }, []);

  const handleElementDelete = useCallback((id: string) => {
    console.log('Deleting element:', id);
    setCanvasElements(prev => prev.filter(el => el.id !== id));
  }, []);

  const handleImageUpload = useCallback((elementId: string) => {
    console.log('Image upload for element:', elementId);
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png, image/jpeg';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target?.result as string;
          setCanvasElements(prev => 
            prev.map(el => 
              el.id === elementId && (el.type === 'image' || el.type === 'signature') 
                ? { ...el, imageData } 
                : el
            )
          );
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, []);

  const handleSignatureDraw = useCallback((elementId: string) => {
    console.log('Signature draw for element:', elementId);
    setSignatureForElement(elementId);
    setIsSignaturePadOpen(true);
  }, []);

  const handleSaveSignature = (signature: string) => {
    setIsSignaturePadOpen(false);
    if (signatureForElement) {
      setCanvasElements(prev => 
        prev.map(el => 
          el.id === signatureForElement && el.type === 'signature'
            ? { ...el, imageData: signature }
            : el
        )
      );
      setSignatureForElement(null);
    }
  };

  const handleCancelSignature = () => {
    setIsSignaturePadOpen(false);
    setSignatureForElement(null);
  };

  // Export PDF with all elements
  const exportPdf = async () => {
    if (!pdfBytes) return;
    
    try {
      // Create a fresh copy to avoid detached ArrayBuffer
      const pdfBytesCopy = new Uint8Array(pdfBytes);
      const pdfDoc = await PDFDocument.load(pdfBytesCopy);
      
      // Add all canvas elements to the PDF
      for (const element of canvasElements) {
        const page = pdfDoc.getPages()[element.page - 1];
        const pageInfo = pageDimensions[element.page];
        
        if (!pageInfo) continue;

        if (element.type === 'text') {
          const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
          page.drawText(element.content, {
            x: element.x,
            y: pageInfo.pageHeight - element.y - element.height, // Invert Y for PDF coordinate system
            font: helveticaFont,
            size: 12,
            color: rgb(0, 0, 0),
            maxWidth: element.width,
          });
        } else if ((element.type === 'image' || element.type === 'signature') && element.imageData) {
          const b64 = element.imageData.split(',')[1];
          const binStr = atob(b64);
          const uint8 = new Uint8Array(binStr.length);
          for (let i = 0; i < binStr.length; i++) uint8[i] = binStr.charCodeAt(i);
          
          let image;
          if (element.imageData.startsWith('data:image/jpeg')) {
            image = await pdfDoc.embedJpg(uint8);
          } else {
            image = await pdfDoc.embedPng(uint8);
          }
          
          page.drawImage(image, {
            x: element.x,
            y: pageInfo.pageHeight - element.y - element.height, // Invert Y for PDF coordinate system
            width: element.width,
            height: element.height,
          });
        }
      }
      
      const finalBytes = await pdfDoc.save();
      const blob = new Blob([finalBytes], { type: 'application/pdf' });
      
      // Download the PDF
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
    <div className={styles.container}>
      {isSignaturePadOpen && (
        <SignaturePad
          onSave={handleSaveSignature}
          onClose={handleCancelSignature}
        />
      )}
      <div className={styles.header}>
        <button className={styles.button} onClick={createNewPdf}>
          New Document
        </button>
        <input
          type="file"
          accept="application/pdf"
          ref={uploadInputRef}
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <button className={styles.button} onClick={openFileUpload}>
          Upload PDF
        </button>
        <button className={styles.button} onClick={exportPdf} disabled={!pdfBytes}>
          Export PDF
        </button>
      </div>
      <div className={styles.main}>
        <div className={styles.previewPanel}>
          <h2>Preview</h2>
          <div style={{ padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
            <p>Total Pages: {totalPages}</p>
            <p>Elements: {canvasElements.length}</p>
            <p>PDF Loaded: {pdfBytes ? 'Yes' : 'No'}</p>
          </div>
        </div>
        <div className={styles.editorPanel}>
          <DragDropToolbar 
            onDragStart={handleDragStart}
            activeTool={activeTool}
          />

          <div className={styles.pdfViewer} style={{ 
            background: '#fff', 
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            minHeight: '600px'
          }}>
            {pdfBytes ? (
              Array.from({ length: totalPages }, (_, i) => {
                const pageNum = i + 1;
                const pageInfo = pageDimensions[pageNum] || { pageWidth: 600, pageHeight: 800 };
                
                // console.log(`Rendering page ${pageNum} with dimensions:`, pageInfo);
                
                return (
                  <PDFCanvasViewer
                    key={`page-${pageNum}`}
                    pdfBytes={pdfBytes}
                    pageNumber={pageNum}
                    onDrop={handleDrop}
                  >
                    {/* Render draggable elements for this page */}
                    {canvasElements
                      .filter(el => el.page === pageNum)
                      .map(element => (
                        <DraggableElement
                          key={element.id}
                          element={element}
                          onUpdate={handleElementUpdate}
                          onDelete={handleElementDelete}
                          onImageUpload={handleImageUpload}
                          onSignatureDraw={handleSignatureDraw}
                          pageInfo={pageInfo}
                          scale={1}
                        />
                      ))
                    }
                  </PDFCanvasViewer>
                );
              })
            ) : (
              <div style={{ 
                padding: '60px 20px', 
                textAlign: 'center', 
                color: '#666',
                border: '2px dashed #ccc',
                borderRadius: '8px'
              }}>
                <h3>No PDF Loaded</h3>
                <p>Create a new document or upload a PDF to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfEditor;