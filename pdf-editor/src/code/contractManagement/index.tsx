'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '@/app/(after-login)/(with-header)/contract-management/contractManagement.module.scss';
import { injectReducer } from '@/components/store';
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import ModuleHeader from "@trenchaant/pkg-ui-component-library/build/Components/ModuleHeader";
import Card from "@trenchaant/pkg-ui-component-library/build/Components/Card";
import Segmented from "@trenchaant/pkg-ui-component-library/build/Components/Segmented";
import Segment from "@trenchaant/pkg-ui-component-library/build/Components/Segment";
import { contractManagementReducer } from './store';
import { setActiveTab } from './store/action/contractManagement.actions';
import { CONTRACT_MANAGEMENT_TAB, RootState } from './types';
import FolderSidebar from './components/FolderSidebar';
import DocumentsViewer from './components/DocumentsViewer';
import ContractsViewer from './components/ContractsViewer';

const ContractManagement = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.contractManagement?.contractManagementReducer?.activeTab);

  useEffect(() => {
    injectReducer('contractManagement', contractManagementReducer);
  }, []);

  const displayCardList = [
    {
      title: 'Total Documents',
      value: 2,
      description: 'All documents',
      iconName: 'file-text',
      iconColor: '#1d4ed8',
      iconBgColor: '#bfdbfe',
    },
    {
      title: 'Active Contracts',
      value: 4,
      description: 'Contracts currently active',
      iconName: 'file-check',
      iconColor: '#15803d',
      iconBgColor: '#dcfce7',
    },
    {
      title: 'Pending Signatures',
      value: 5,
      description: 'Awaiting signature',
      iconName: 'clock',
      iconColor: '#ea580c',
      iconBgColor: '#ffedd5',
    },
    {
      title: 'Contract Value',
      value: `$${10000}`,
      description: 'Total contract value',
      iconName: 'dollar-sign',
      iconColor: '#444444',
      iconBgColor: '#f3f4f6',
    }
  ];

  return (
    <div className={styles.contractManagementContainer}>
      <div className={styles.headerSection}>
        <ModuleHeader 
          title={"E-Signature & Contract Management"}
          description={"Send, sign, and manage documents and contracts electronically with ease."}
          icon={"file-text"}
        />
        <div className={styles.actionsBlock}>
          <Button className={styles.actionBtn}>
            <CustomIcon iconName="settings" width={16} height={16} /> Global Settings
          </Button>
          <Button className={styles.actionBtn}>
            <CustomIcon iconName="shield" width={16} height={16} /> Branding
          </Button>
          <Button className={styles.actionBtn}>
            <CustomIcon iconName="shield" width={16} height={16} /> Identity Verification
          </Button>
          <Button className={`${styles.actionBtn} ${styles.primaryBtn}`}>
            <CustomIcon iconName="plus" width={16} height={16} /> New Document
          </Button>
        </div>
      </div>
      <div className={styles.contractManagementStatsGrid} >
        {displayCardList.map((stat, index) => (
          <Card
            key={index}
            className={styles.cardContentWrapper}
            commonDisplayCard
            hoverEffect
            content={{
              endIcon: {
                iconName: stat.iconName,
                color: stat.iconColor,
                backgroundColor: stat.iconBgColor,
              },
              title: stat.title,
              value: stat.value || "0",
              extraValue: () => (
                <div>
                  <Typography className={styles.cardDescription}>
                    {stat.description}
                  </Typography>
                </div>
              ),
            }}
          />
        ))}
      </div>

      <div className={styles.mainContentSection}>
        <Segmented
          indicatorColor="primary"
          textColor="primary"
          value={activeTab}
          fullWidth
          onChange={(value: CONTRACT_MANAGEMENT_TAB) => {
            console.log({activeTab, value})
            dispatch(setActiveTab(value))
          }}
        >
          <Segment
            key={'documents'}
            icon={<CustomIcon iconName={'file-text'} height={16} width={16} variant='gray' />}
            label={'Documents'}
            value={CONTRACT_MANAGEMENT_TAB.DOCUMENTS}
          />
          <Segment
            key={'contracts'}
            icon={<CustomIcon iconName={'file-text'} height={16} width={16} variant='gray' />}
            label={'Contracts'}
            value={CONTRACT_MANAGEMENT_TAB.CONTRACTS}
          />
        </Segmented>

        <div className={styles.contentBody}>
          <FolderSidebar />
          {activeTab === 'documents' ? <DocumentsViewer /> : <ContractsViewer />}
        </div>
      </div>
    </div>
  );
};

export default ContractManagement;
