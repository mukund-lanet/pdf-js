import React from 'react';
import styles from '@/app/(after-login)/(with-header)/contract-management/contractManagement.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { setContractActiveFilter, setCreateContractDrawerOpen } from '../store/action/contractManagement.actions';
import { noContracts } from '../types';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import EmptyMessageComponent from "@trenchaant/pkg-ui-component-library/build/Components/EmptyMessageComponent";
import { RootState } from "../store/reducer/contractManagement.reducer";
import CreateContractDrawer from './drawers/createContractDrawer';

const ContractsViewer = () => {
  const dispatch = useDispatch();
  const activeFilter = useSelector((state: RootState) => state.contractManagement?.contractActiveFilter);
  const contracts = useSelector((state: RootState) => state.contractManagement?.contracts);

  const filters = [
    { id: 'all', label: 'All', count: 0 },
    { id: 'active', label: 'Active Contracts', count: 0 },
    { id: 'draft', label: 'Draft Contracts', count: 0 },
    { id: 'shared', label: 'Shared', count: 0 },
  ];

  return (
    <div className={styles.viewerArea}>
      <div className={styles.viewerHeader}>
        <Typography variant="h2" fontWeight="600" className={styles.tabElementTitle} >Contracts</Typography>
        <div className={styles.filterTabs}>
          {filters.map(filter => (
            <div 
              key={filter.id}
              className={`${styles.filterTab} ${activeFilter === filter.id ? styles.active : ''}`}
              onClick={() => dispatch(setContractActiveFilter(filter.id) as any)}
            >
              <Typography>{filter.label}</Typography>
              <span className={styles.count}>{filter.count}</span>
            </div>
          ))}
        </div>
      </div>

      <CreateContractDrawer />
      
      {contracts && contracts.length > 0 ? (
        <div>
          <Typography>Contract list goes here</Typography>
        </div>
      ) : (
        <div className={styles.emptyMsgComponentWrapper} >
            <EmptyMessageComponent 
              {...noContracts} 
              button={{
                label: "Create First Contract",
                variant: "contained",
                color: "primary",
                onClick: () => {dispatch(setCreateContractDrawerOpen(true))}
              }} 
            />
        </div>
      )}
    </div>
  );
};

export default ContractsViewer;
