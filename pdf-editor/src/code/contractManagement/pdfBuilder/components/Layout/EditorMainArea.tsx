'use client';
import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import SimpleLoading from "@trenchaant/pkg-ui-component-library/build/Components/SimpleLoading"
import EmptyMessageComponent from "@trenchaant/pkg-ui-component-library/build/Components/EmptyMessageComponent";
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import PDFCanvasViewer from '../Canvas/PDFCanvasViewer';
import { noDocument } from '../../types';
import { RootState } from '../../store/reducer/pdfEditor.reducer';

const EditorMainArea = () => {
  const editorPanelRef = useRef<HTMLDivElement>(null);

  const pdfBytes = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.pdfBytes);
  const totalPages = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.totalPages);
  const currentPage = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.currentPage);
  const isLoading = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.isLoading);

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
        <div className={` ${pdfBytes ? styles.pdfViewer : styles.noPdfLoadedWrapper}`}>
          {pdfBytes && totalPages > 0 ? (
            <PDFCanvasViewer />
          ) : isLoading ? <div className={styles.simpleLoadingWrapper} > <SimpleLoading /> </div>
            : (
              <div className={styles.noPdfLoaded} >
                <EmptyMessageComponent {...noDocument} />
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default EditorMainArea;
