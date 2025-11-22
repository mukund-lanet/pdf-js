
'use client';
import React, { useEffect, useState } from 'react';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import EmptyMessageComponent from "@trenchaant/pkg-ui-component-library/build/Components/EmptyMessageComponent";
// import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
// import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import SimpleLoading from "@trenchaant/pkg-ui-component-library/build/Components/SimpleLoading";
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducer/pdfEditor.reducer';
import ThumbnailPage from './ThumbnailPage';
import { noDocument } from '../../types';

interface ThumbnailSidebarProps {
  pdfBytes: Uint8Array | null;
  currentPage: number;
  onThumbnailClick: (pageNumber: number) => void;
}

const ThumbnailSidebar = ({ pdfBytes, currentPage, onThumbnailClick }: ThumbnailSidebarProps) => {
  const [pdfjsLib, setPdfjsLib] = useState<any>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
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
        setIsLoading(true);
        const pdfBytesCopy = new Uint8Array(pdfBytes);
        const loadingTask = pdfjsLib.getDocument({ data: pdfBytesCopy });
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
      } catch (error) {
        console.error('Error loading PDF for thumbnails:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPdf();
  }, [pdfBytes, pdfjsLib]);

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
          Array.from(new Array(totalPages), (el, index) => (
            <ThumbnailPage
              key={`thumbnail_page_${index + 1}_${pdfDoc ? pdfDoc._pdfInfo.fingerprint : 'no_pdf'}`}
              pdfDoc={pdfDoc}
              pageNumber={index + 1}
              currentPage={currentPage}
              onThumbnailClick={onThumbnailClick}
              isLoading={isLoading}
            />
          ))
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
