import React from 'react';
import styles from '@/app/(after-login)/(with-header)/contract-management/contractManagement.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFolder } from '../store/action/contractManagement.actions';
import { RootState } from '../types';
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";

const FolderSidebar = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.contractManagement?.contractManagementReducer?.activeTab);
  const expandedFolders = useSelector((state: RootState) => state.contractManagement?.contractManagementReducer?.expandedFolders);

  const isDocs = activeTab === 'documents';
  const rootId = isDocs ? 'my-docs' : 'my-contracts';
  const rootLabel = isDocs ? 'My Documents' : 'My Contracts';

  const handleToggle = (id: string) => {
    dispatch(toggleFolder(id) as any);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <Typography fontWeight="600" className={styles.sidebarTitle}>Folders</Typography>
        <Button>
          <CustomIcon iconName="plus" width={14} height={14} /> New
        </Button>
      </div>

      <div className={`${styles.navItem} ${styles.active}`}>
        <CustomIcon iconName="folder" width={18} height={18} />
        <Typography>All Items</Typography>
      </div>

      <div className={styles.navItem} onClick={() => handleToggle(rootId)}>
        {expandedFolders?.[rootId] ? (
          <CustomIcon iconName="chevron-down" width={14} height={14} className={styles.arrow} />
        ) : (
          <CustomIcon iconName="chevron-right" width={14} height={14} className={styles.arrow} />
        )}
        <CustomIcon iconName="folder" width={18} height={18} />
        <Typography>{rootLabel}</Typography>
      </div>

      {expandedFolders?.[rootId] && (
        <div className={styles.subItems}>
          {isDocs ? (
            <>
              <div className={styles.subItem}>
                <CustomIcon iconName="folder" width={16} height={16} /> 
                <Typography>Pending Signatures</Typography>
              </div>
              <div className={styles.subItem}>
                <CustomIcon iconName="folder" width={16} height={16} /> 
                <Typography>Completed</Typography>
              </div>
            </>
          ) : (
            <>
              <div className={styles.subItem}>
                <CustomIcon iconName="folder" width={16} height={16} /> 
                <Typography>Active Contracts</Typography>
              </div>
              <div className={styles.subItem}>
                <CustomIcon iconName="folder" width={16} height={16} /> 
                <Typography>Draft Contracts</Typography>
              </div>
            </>
          )}
        </div>
      )}

      <div className={styles.navItem}>
        <CustomIcon iconName="folder" width={18} height={18} />
        <Typography>Shared</Typography>
      </div>
    </div>
  );
};

export default FolderSidebar;
