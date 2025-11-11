'use client';
import React, { useEffect, useState } from 'react';
import styles from 'app/(after-login)/(with-header)/pdf-editor/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import EmptyMessageComponent from "@trenchaant/pkg-ui-component-library/build/Components/EmptyMessageComponent";
import PDFPage from './PDFPage';
import { CanvasElement } from './types';

interface PDFCanvasViewerProps {
  pdfBytes: Uint8Array | null;
  onCanvasClick?: (pageNumber: number) => void;
  onDrop?: (x: number, y: number, info: { pageWidth: number; pageHeight: number }, pageNumber: number, type: string) => void;
  onAddBlankPage: (pageNumber: number) => void;
  onUploadAndInsertPages: (pageNumber: number) => void;
  onDeletePage: (pageNumber: number) => void;
  canvasElements: CanvasElement[];
  pageDimensions: { [key: number]: { pageWidth: number; pageHeight: number } };
  onElementUpdate: (updatedElement: CanvasElement) => void;
  onElementDelete: (id: string) => void;
  onImageUpload: (elementId: string) => void;
  onSignatureDraw: (elementId: string) => void;
  onElementSelect: (element: CanvasElement) => void;
}

const PDFCanvasViewer = ({
  pdfBytes,
  onCanvasClick,
  onDrop,
  onAddBlankPage,
  onUploadAndInsertPages,
  onDeletePage,
  canvasElements,
  pageDimensions,
  onElementUpdate,
  onElementDelete,
  onImageUpload,
  onSignatureDraw,
  onElementSelect
}: PDFCanvasViewerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfjsLib, setPdfjsLib] = useState<any>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [renderKey, setRenderKey] = useState(0); // Force re-render when PDF changes

  // Load PDF.js library on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('pdfjs-dist').then((pdfjs) => {
        const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
        pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
        setPdfjsLib(pdfjs);
      }).catch((error) => {
        console.error('Failed to load PDF.js:', error);
        setError('PDF.js library failed to load');
      });
    }
  }, []);

  useEffect(() => {
    const loadPdfDocument = async () => {
      if (!pdfBytes || !pdfjsLib) {
        setPdfDoc(null);
        setTotalPages(0);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Loading PDF document...');
        
        // Create a fresh copy to avoid reference issues
        const pdfBytesCopy = new Uint8Array(pdfBytes);
        const loadingTask = pdfjsLib.getDocument({ data: pdfBytesCopy });
        const pdf = await loadingTask.promise;
        
        console.log(`PDF loaded with ${pdf.numPages} pages`);
        
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setRenderKey(prev => prev + 1); // Force re-render of all pages
        
      } catch (error) {
        console.error('Error loading PDF document:', error);
        setError(`Failed to load PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setPdfDoc(null);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadPdfDocument();
  }, [pdfBytes, pdfjsLib]);

  const noDocument = {
    message: "No documents found",
    description: "There are no documents to display.",
    tipList: [
      "Upload pdf and start editing",
      "Create new document",
      "Add docusign in integration"
    ]
  }

  if (!pdfBytes) {
    return (
      <div className={styles.noPdfLoaded} >
        <Typography>
          No PDF loaded
        </Typography>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.loadingDiv}>
        <Typography>
          Loading PDF...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorDiv} >
        <Typography>
          {error}
        </Typography>
      </div>
    );
  }

  if (!pdfDoc || totalPages === 0) {
    return (
      <div className={styles.noPdfLoaded} >
        <Typography>
          No pages to display
        </Typography>
      </div>
    );
  }

  return (
    <div className={styles.mainPdfContainerWrapperDiv} >
      { pdfBytes && totalPages > 0 ? (
        <div className={styles.pdfViewerContainer} key={`viewer-${renderKey}`}>
          {Array.from({ length: totalPages }, (_, index) => (
            <PDFPage
              key={`page_${index + 1}_${renderKey}`} // Include renderKey to force re-render
              pdfDoc={pdfDoc}
              pageNumber={index + 1}
              onCanvasClick={onCanvasClick}
              onDrop={onDrop}
              onAddBlankPage={onAddBlankPage}
              onUploadAndInsertPages={onUploadAndInsertPages}
              onDeletePage={onDeletePage}
              canvasElements={canvasElements}
              pageDimensions={pageDimensions}
              onElementUpdate={onElementUpdate}
              onElementDelete={onElementDelete}
              onImageUpload={onImageUpload}
              onSignatureDraw={onSignatureDraw}
              onElementSelect={onElementSelect}
            />
          ))}
        </div>)
        : (
          <div className={styles.emptyMsgComponentWrapper} >
            <EmptyMessageComponent
              message={noDocument.message}
              description={noDocument.description}
              iconName={"pen-line"}
              tipsTitle={"Quick tips"}
              tips={noDocument.tipList}
            />
          </div>
        )
      }
      
    </div>
  );
};

export default PDFCanvasViewer;