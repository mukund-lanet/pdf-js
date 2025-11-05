'use client';
import { useEffect, useRef, useState } from 'react';
import styles from 'app/(after-login)/(with-header)/pdf-editor/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";

interface PDFCanvasViewerProps {
  pdfBytes: Uint8Array | null;
  pageNumber: number;
  onCanvasClick?: (x: number, y: number, info: { pageWidth: number; pageHeight: number }) => void;
  onDrop?: (x: number, y: number, info: { pageWidth: number; pageHeight: number }, pageNumber: number, type: string) => void;
  children?: React.ReactNode;
}

const PDFCanvasViewer = ({ pdfBytes, onCanvasClick, onDrop, pageNumber, children }: PDFCanvasViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pageSize, setPageSize] = useState<{ pageWidth: number; pageHeight: number }>({ pageWidth: 600, pageHeight: 800 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfjsLib, setPdfjsLib] = useState<any>(null);

  // Load PDF.js library on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('pdfjs-dist').then((pdfjs) => {
        const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
        pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
        
        console.log('PDF.js worker configured with:', workerSrc);
        setPdfjsLib(pdfjs);
      }).catch((error) => {
        console.error('Failed to load PDF.js:', error);
        setError('PDF.js library failed to load');
      });
    }
  }, []);

  useEffect(() => {
    const renderPDF = async () => {
      if (!pdfBytes || !pdfjsLib || !canvasRef.current) {
        renderPlaceholder();
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
                
        // Create a fresh copy of the ArrayBuffer to prevent detachment issues
        const pdfBytesCopy = new Uint8Array(pdfBytes);
        
        const loadingTask = pdfjsLib.getDocument({ data: pdfBytesCopy });
        const pdf = await loadingTask.promise;
                
        if (pageNumber < 1 || pageNumber > pdf.numPages) {
          throw new Error(`Page ${pageNumber} is out of range. Total pages: ${pdf.numPages}`);
        }
        
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.5 });
        
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('Could not get canvas context');
        }
        
        // Set canvas dimensions
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        // Clear canvas
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        
        setPageSize({ 
          pageWidth: viewport.width, 
          pageHeight: viewport.height 
        });
        
        await page.render(renderContext).promise;
        setIsLoading(false);
        
      } catch (error) {
        console.error('Error rendering PDF:', error);
        setError(`Failed to render PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
        renderPlaceholder();
      }
    };

    const renderPlaceholder = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 600;
      const height = 800;
      
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Clear canvas
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);
      
      // Draw border
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, width, height);
      
      // Draw page content
      ctx.fillStyle = '#333';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      
      if (pdfBytes) {
        ctx.fillText(`PDF Page ${pageNumber}`, width / 2, height / 2 - 40);
        ctx.font = '16px Arial';
        ctx.fillStyle = '#666';
        
        if (error) {
          ctx.fillStyle = '#ff4444';
          ctx.fillText('Error loading PDF', width / 2, height / 2);
          ctx.font = '12px Arial';
          ctx.fillText(error, width / 2, height / 2 + 30);
        } else if (isLoading) {
          ctx.fillText('Loading PDF...', width / 2, height / 2);
        } else {
          ctx.fillText('PDF content will appear here', width / 2, height / 2);
        }
      } else {
        ctx.fillText(`PDF Page ${pageNumber}`, width / 2, height / 2 - 40);
        ctx.font = '16px Arial';
        ctx.fillStyle = '#666';
        ctx.fillText('PDF rendering placeholder', width / 2, height / 2);
        ctx.font = '14px Arial';
        ctx.fillText('Upload a PDF to see actual content', width / 2, height / 2 + 30);
      }
      
      // Draw a simple document outline
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 1;
      ctx.strokeRect(50, 100, width - 100, height - 200);
      
      ctx.fillStyle = '#999';
      ctx.font = '12px Arial';
      ctx.fillText('Document content area', width / 2, 90);

      setPageSize({ pageWidth: width, pageHeight: height });
      setIsLoading(false);
    };

    renderPDF();
  }, [pdfBytes, pageNumber, pdfjsLib, error]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!onDrop || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const type = e.dataTransfer.getData('application/pdf-editor');
    
    console.log(`Drop at: ${x}, ${y} on page ${pageNumber}, type: ${type}`);
    
    if (type) {
      onDrop(x, y, pageSize, pageNumber, type);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };


  if (!pdfBytes) {
    return (
      <div className={styles.noPdfLoaded} >
        <Typography>
          No PDF loaded
        </Typography>
      </div>
    );
  }

  return (
    <div className={styles.pdfCanvasViewer} >
      <div 
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={onCanvasClick}
        className={styles.canvasContainer}
      >
        {isLoading && (
          <Typography className={styles.loadingDiv}>
            Loading page {pageNumber}...
          </Typography>
        )}
        
        {error && (
          <Typography className={styles.errorDiv} >
            {error}
          </Typography>
        )}
        
        <canvas
          ref={canvasRef}
          className={styles.canvasWrapper}
        />
        {children}
      </div>
      <Typography className={styles.pagesDiv} >
        Page {pageNumber}
        {pageSize.pageWidth > 0 && (
          <span className={styles.pageSpan} >
            ({Math.round(pageSize.pageWidth)} × {Math.round(pageSize.pageHeight)})
          </span>
        )}
      </Typography>
    </div>
  );
};

export default PDFCanvasViewer;