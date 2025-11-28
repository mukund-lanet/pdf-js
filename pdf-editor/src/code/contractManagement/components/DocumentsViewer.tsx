import React from 'react';
import styles from '@/app/(after-login)/(with-header)/contract-management/contractManagement.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { setDocumentActiveFilter, setDocumentDrawerOpen } from '../store/action/contractManagement.actions';
import { noDocument } from '../types';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import EmptyMessageComponent from "@trenchaant/pkg-ui-component-library/build/Components/EmptyMessageComponent";
import {RootState} from "../store/reducer/contractManagement.reducer"

const DocumentsViewer = () => {
  const dispatch = useDispatch();
  const activeFilter = useSelector((state: RootState) => state.contractManagement?.documentActiveFilter);
  const documents = useSelector((state: RootState) => state.contractManagement?.documents);

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
        <Typography fontWeight="600" className={styles.tabElementTitle} >Documents</Typography>
        <div className={styles.filterTabs}>
          {filters.map(filter => (
            <div 
              key={filter.id}
              className={`${styles.filterTab} ${activeFilter === filter.id ? styles.active : ''}`}
              onClick={() => dispatch(setDocumentActiveFilter(filter.id))}
            >
              <Typography>{filter.label}</Typography>
              <span className={styles.count}>{filter.count}</span>
            </div>
          ))}
        </div>
      </div>

      {documents && documents.length > 0 ? (
        <div>
          <Typography>Document list goes here</Typography>
        </div>
      ) : (
        <div className={styles.emptyMsgComponentWrapper} >
            <EmptyMessageComponent 
              {...noDocument} 
              button={{
                label: "Create First Document",
                variant: "contained",
                color: "primary",
                onClick: () => dispatch(setDocumentDrawerOpen(true))
              }} 
            />
        </div>
      )}
    </div>
  );
};

export default DocumentsViewer;
