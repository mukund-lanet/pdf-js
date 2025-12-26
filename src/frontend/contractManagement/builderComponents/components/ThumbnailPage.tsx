'use client';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import { RootState } from '../../store/reducer/contractManagement.reducer';
import Typography from '@trenchaant/pkg-ui-component-library/build/Components/Typography';
import { SET_CURRENT_PAGE } from '../../store/action/contractManagement.actions';
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
// @ts-ignore
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';

interface ThumbnailPageProps {
  pageNumber: number;
  isLoading: boolean;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
}

const ThumbnailPage = React.memo(({ pageNumber, isLoading, dragHandleProps }: ThumbnailPageProps) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const pages = useSelector((state: RootState) => state?.contractManagement?.pages || []);
  const dispatch = useDispatch();
  const currentPage = useSelector((state: RootState) => state?.contractManagement?.currentPage);

  useEffect(() => {
    if (pages && pages.length > 0 && pageNumber <= pages.length) {
      const pageData = pages[pageNumber - 1]; 
      if (pageData && pageData.pageSrc) {
        setThumbnailUrl(pageData.pageSrc);
        return;
      }
    }

    setThumbnailUrl(null);
  }, [pages, pageNumber]);

  return (
    <div className={styles.thumbnailWrapper}>
      <div className={styles.thumbnailDragHandle} {...dragHandleProps}>
        <Typography className={styles.thumbnailPageNumber}>{pageNumber}</Typography>
        <CustomIcon iconName="grip-vertical" width={16} height={16} variant="white" />
      </div>
      <div className={styles.thumbnailPageContainer}>
        <div
          key={`thumbnail_page_${pageNumber}`}
          className={`${styles.thumbnailItem} ${pageNumber === currentPage ? styles.activeThumbnail : ''}`}
          onClick={() => dispatch({ type: SET_CURRENT_PAGE, payload: pageNumber })}
        >
          <div className={styles.thumbnailContent}>
            {thumbnailUrl && !isLoading && (
              <div
                className={styles.thumbnailImage}
                style={{
                  backgroundImage: `url(${thumbnailUrl})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  width: '201px',
                  height: '255px',
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ThumbnailPage.displayName = 'ThumbnailPage';

export default ThumbnailPage;
