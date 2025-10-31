import { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
import styles from '../styles/PDFCanvasViewer.module.scss';

interface PDFCanvasViewerProps {
  pdfBytes: Uint8Array | null;
  pageNumber: number;
  onCanvasClick?: (x: number, y: number, info: { pageWidth: number; pageHeight: number }) => void;
}

const PDFCanvasViewer = ({ pdfBytes, onCanvasClick, pageNumber }: PDFCanvasViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pageSizeRef = useRef<{ pageWidth: number; pageHeight: number }>({ pageWidth: 0, pageHeight: 0 });

  useEffect(() => {
    if (!pdfBytes || !canvasRef.current) return;
    let renderTask: any = null;
    let cancelled = false;
    const renderPage = async () => {
      const clonedBytes = new Uint8Array(pdfBytes);
      const loadingTask = pdfjsLib.getDocument({ data: clonedBytes });
      const pdf = await loadingTask.promise;
      if (pageNumber < 1 || pageNumber > pdf.numPages) return;
      const page = await pdf.getPage(pageNumber);
      const maxDisplayWidth = 900;
      const originalViewport = page.getViewport({ scale: 1 });
      const scale = maxDisplayWidth / originalViewport.width;
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      pageSizeRef.current = { pageWidth: viewport.width, pageHeight: viewport.height };
      renderTask = page.render({ canvasContext: context, viewport });
      try {
        await renderTask.promise;
      } catch { }
    };
    renderPage();
    return () => {
      cancelled = true;
      if (renderTask && renderTask.cancel) renderTask.cancel();
    };
  }, [pdfBytes, pageNumber]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onCanvasClick || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onCanvasClick(x, y, pageSizeRef.current);
  };

  return (
    <div className={styles.viewerWrapper}>
      <canvas
        ref={canvasRef}
        className={styles.pdfCanvas}
        onClick={handleCanvasClick}
      />
    </div>
  );
};

export default PDFCanvasViewer;
