'use client';
import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import SimpleLoading from "@trenchaant/pkg-ui-component-library/build/Components/SimpleLoading"
import EmptyMessageComponent from "@trenchaant/pkg-ui-component-library/build/Components/EmptyMessageComponent";
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import PDFCanvasViewer from '../Canvas/PDFCanvasViewer';
import { noPdfDocument } from '../../../utils/utils';
import { RootState } from '../../../store/reducer/contractManagement.reducer';

const EditorMainArea = () => {
  const editorPanelRef = useRef<HTMLDivElement>(null);

  const pages = useSelector((state: RootState) => state?.contractManagement?.pages || []);
  const totalPages = useSelector((state: RootState) => state?.contractManagement?.totalPages);
  const currentPage = useSelector((state: RootState) => state?.contractManagement?.currentPage);
  const isLoading = useSelector((state: RootState) => state?.contractManagement?.isLoading);

  useEffect(() => {
    if (editorPanelRef.current) {
      const pageElement = editorPanelRef.current.querySelector(`#pdf-page-${currentPage}`);
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [currentPage]);

  return (
    <div className={styles.editorPanel} ref={editorPanelRef}>
      <div className={styles.pdfViewerWrapper} >
        <div className={` ${(pages && pages.length > 0) ? styles.pdfViewer : styles.noPdfLoadedWrapper}`}>
          {(pages && pages.length > 0) && totalPages > 0 ? (
            <PDFCanvasViewer />
          ) : isLoading ? <div className={styles.simpleLoadingWrapper} > <SimpleLoading /> </div>
            : (
              <div className={styles.noPdfLoaded} >
                <EmptyMessageComponent {...noPdfDocument} />
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default EditorMainArea;
