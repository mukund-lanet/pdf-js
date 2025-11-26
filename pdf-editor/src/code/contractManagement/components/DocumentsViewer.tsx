import React from 'react';
import styles from '@/app/(after-login)/(with-header)/contract-management/contractManagement.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveFilter } from '../store/action/contractManagement.actions';
import { RootState } from '../types';
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";

const DocumentsViewer = () => {
  const dispatch = useDispatch();
  const activeFilter = useSelector((state: RootState) => state.contractManagement?.contractManagementReducer?.activeFilter);
  const documents = useSelector((state: RootState) => state.contractManagement?.contractManagementReducer?.documents);

  const filters = [
    { id: 'all', label: 'All', count: 0 },
    { id: 'draft', label: 'Draft', count: 0 },
    { id: 'waiting', label: 'Waiting for others', count: 0 },
    { id: 'completed', label: 'Completed', count: 0 },
    { id: 'payments', label: 'Payments', count: 0 },
    { id: 'archived', label: 'Archived', count: 0 },
  ];

  return (
    <div className={styles.viewerArea}>
      <div className={styles.viewerHeader}>
        <Typography variant="h2" fontWeight="600">Documents</Typography>
        <div className={styles.filterTabs}>
          {filters.map(filter => (
            <div 
              key={filter.id}
              className={`${styles.filterTab} ${activeFilter === filter.id ? styles.active : ''}`}
              onClick={() => dispatch(setActiveFilter(filter.id) as any)}
            >
              <Typography>{filter.label}</Typography>
              <span className={styles.count}>{filter.count}</span>
            </div>
          ))}
        </div>
      </div>

      {documents && documents.length > 0 ? (
        <div>
          {/* Render document list here */}
          <Typography>Document list goes here</Typography>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <CustomIcon iconName="file-text" width={32} height={32} />
          </div>
          <Typography fontWeight="600" className={styles.emptyTitle}>No documents yet</Typography>
          <Typography className={styles.emptyDesc}>Create your first document to get started with e-signatures.</Typography>
          <Button className={styles.createBtn}>
            Create First Document
          </Button>
        </div>
      )}
    </div>
  );
};

export default DocumentsViewer;
