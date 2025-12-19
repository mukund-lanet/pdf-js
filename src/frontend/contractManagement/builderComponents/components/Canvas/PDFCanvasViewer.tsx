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
  const totalPages = useSelector((state: RootState) => state?.contractManagement?.totalPages);
  const pages = useSelector((state: RootState) => state?.contractManagement?.pages || []);
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state?.contractManagement?.isLoading);


  const scrollContainerRef = useRef<HTMLDivElement>(null);


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
      {(pages && pages.length > 0) && totalPages > 0 ? (
        <CustomScrollbar ref={scrollContainerRef} className={styles.scrollPdfViewerContainer} >
          <div className={styles.pdfViewerContainer}>
            {Array.from({ length: totalPages }, (_, index) => {
              return (<PDFPage
                key={`page_${index + 1}`}
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