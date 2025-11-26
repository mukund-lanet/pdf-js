import React from 'react';
import styles from '@/app/(after-login)/(with-header)/contract-management/contractManagement.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveFilter } from '../store/action/contractManagement.actions';
import { RootState } from '../types';
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";

const ContractsViewer = () => {
  const dispatch = useDispatch();
  const activeFilter = useSelector((state: RootState) => state.contractManagement?.contractManagementReducer?.activeFilter);
  const contracts = useSelector((state: RootState) => state.contractManagement?.contractManagementReducer?.contracts);

  const filters = [
    { id: 'all', label: 'All', count: 0 },
    { id: 'active', label: 'Active Contracts', count: 0 },
    { id: 'draft', label: 'Draft Contracts', count: 0 },
    { id: 'shared', label: 'Shared', count: 0 },
  ];

  return (
    <div className={styles.viewerArea}>
      <div className={styles.viewerHeader}>
        <Typography variant="h2" fontWeight="600">Contracts</Typography>
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

      {contracts && contracts.length > 0 ? (
        <div>
          {/* Render contract list here */}
          <Typography>Contract list goes here</Typography>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <CustomIcon iconName="check-square" width={32} height={32} />
          </div>
          <Typography fontWeight="600" className={styles.emptyTitle}>No contracts yet</Typography>
          <Typography className={styles.emptyDesc}>Create your first contract to get started.</Typography>
          <Button className={styles.createBtn}>
            Create First Contract
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContractsViewer;
