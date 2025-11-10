
'use client';
import React, { useEffect, useState } from 'react';
import styles from 'app/(after-login)/(with-header)/pdf-editor/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import { useSelector } from 'react-redux';
import { RootState } from './store/reducer/pdfEditor.reducer';
import ThumbnailPage from './ThumbnailPage';

interface ThumbnailSidebarProps {
  pdfBytes: Uint8Array | null;
  currentPage: number;
  onThumbnailClick: (pageNumber: number) => void;
}

const ThumbnailSidebar = ({ pdfBytes, currentPage, onThumbnailClick }: ThumbnailSidebarProps) => {
  const [pdfjsLib, setPdfjsLib] = useState<any>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const totalPages = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.totalPages);

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

  return (
    <div className={styles.thumbnailSidebar}>
        <div className={styles.previewWrapper} >
            <Typography className={styles.previewTitle} >Thumbnails</Typography>
            <div className={styles.previewTexts} >
              <Typography className={styles.label} >Total Pages: {pdfBytes ? totalPages : 0}</Typography>
            </div>
        </div>
      <div className={styles.thumbnailContainer}>
        {pdfDoc && totalPages > 0 ? (
          Array.from(new Array(totalPages), (el, index) => (
            <ThumbnailPage
              key={`thumbnail_page_${index + 1}`}
              pdfDoc={pdfDoc}
              pageNumber={index + 1}
              currentPage={currentPage}
              onThumbnailClick={onThumbnailClick}
            />
          ))
        ) : (
          <Typography className={styles.label}>No PDF Loaded</Typography>
        )}
      </div>
    </div>
  );
};

export default ThumbnailSidebar;
