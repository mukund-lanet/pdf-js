'use client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import EmptyMessageComponent from "@trenchaant/pkg-ui-component-library/build/Components/EmptyMessageComponent";
import PDFPage from './PDFPage';
import { RootState } from '../../store/reducer/pdfEditor.reducer';
import { noDocument } from '../../types';

const PDFCanvasViewer = () => {
  const pdfBytes = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.pdfBytes);
  const totalPages = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.totalPages);

  const [pdfjsLib, setPdfjsLib] = useState<any>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [renderKey, setRenderKey] = useState(0); 

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('pdfjs-dist').then((pdfjs) => {
        const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
        pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
        setPdfjsLib(pdfjs);
      }).catch((error) => {
        console.error('Failed to load PDF.js:', error);
      });
    }
  }, []);

  useEffect(() => {
    const loadPdfDocument = async () => {
      if (!pdfBytes || !pdfjsLib) {
        setPdfDoc(null);
        return;
      }

      try {
        const pdfBytesCopy = new Uint8Array(pdfBytes);
        const loadingTask = pdfjsLib.getDocument({ data: pdfBytesCopy });
        const pdf = await loadingTask.promise;

        setPdfDoc(pdf);
        setRenderKey(prev => prev + 1); // force hht re-rendering of all pages

      } catch (error) {
        console.error('Error loading PDF document:', error);
        setPdfDoc(null);
      }
    };

    loadPdfDocument();
  }, [pdfBytes, pdfjsLib]);

  return (
    <div className={styles.mainPdfContainerWrapperDiv} >
      {pdfBytes && totalPages > 0 ? (
        <div className={styles.pdfViewerContainer} key={`viewer-${renderKey}`}>
          {Array.from({ length: totalPages }, (_, index) => {
            return (<PDFPage
              key={`page_${index + 1}_${renderKey}`}
              pdfDoc={pdfDoc}
              pageNumber={index + 1}
            />)
          })}
        </div>)
        : (
          <div className={styles.emptyMsgComponentWrapper} >
            <EmptyMessageComponent {...noDocument} />
          </div>
        )
      }
    </div>
  );
};

export default PDFCanvasViewer;