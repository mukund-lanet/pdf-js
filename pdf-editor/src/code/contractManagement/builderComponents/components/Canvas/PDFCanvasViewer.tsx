'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import EmptyMessageComponent from "@trenchaant/pkg-ui-component-library/build/Components/EmptyMessageComponent";
import CustomScrollbar from "@trenchaant/pkg-ui-component-library/build/Components/ScrollBar";
import IconButton from "@trenchaant/pkg-ui-component-library/build/Components/IconButton";
import CustomIcon from "@trenchaant/pkg-ui-component-library/build/Components/CustomIcon";
import SimpleLoading from "@trenchaant/pkg-ui-component-library/build/Components/SimpleLoading";
import PDFPage from './PDFPage';
import { RootState } from '../../../store/reducer/contractManagement.reducer';
import { noPdfDocument } from '../../../utils/utils';
import { SET_CURRENT_PAGE } from '../../../store/action/contractManagement.actions';

const PDFCanvasViewer = () => {
  const pdfBytes = useSelector((state: RootState) => state?.contractManagement?.pdfBytes);
  const totalPages = useSelector((state: RootState) => state?.contractManagement?.totalPages);
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state?.contractManagement?.isLoading);

  const [pdfjsLib, setPdfjsLib] = useState<any>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [renderKey, setRenderKey] = useState(0); 
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const handleScrollToTop = () => {
    dispatch({ type: SET_CURRENT_PAGE, payload: 1 });
    
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={styles.mainPdfContainerWrapperDiv} >
      {pdfBytes && totalPages > 0 ? (
        <CustomScrollbar ref={scrollContainerRef} className={styles.scrollPdfViewerContainer} >
          <div className={styles.pdfViewerContainer} key={`viewer-${renderKey}`}>
            {Array.from({ length: totalPages }, (_, index) => {
              return (<PDFPage
                key={`page_${index + 1}_${renderKey}`}
                pdfDoc={pdfDoc}
                pageNumber={index + 1}
                />)
              })}
          </div>
        </CustomScrollbar>)
        : !isLoading && totalPages === 0 ? (
          <div className={styles.emptyMsgComponentWrapper} >
            <EmptyMessageComponent {...noPdfDocument} />
          </div>
        ) : (
          <div className={styles.loadingWrapper}>
            <SimpleLoading />
          </div>
        )
      }
      <IconButton onClick={handleScrollToTop}>
        <CustomIcon iconName="chevron-up" height={24} width={24} />
      </IconButton>
    </div>
  );
};

export default PDFCanvasViewer;