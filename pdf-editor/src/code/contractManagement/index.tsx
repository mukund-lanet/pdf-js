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
import { setActiveTab, setCreateDocumentDrawerOpen } from './store/action/contractManagement.actions';
import { CONTRACT_MANAGEMENT_TAB, RootState } from './types';
import FolderSidebar from './components/FolderSidebar';
import DocumentsViewer from './components/DocumentsViewer';
import ContractsViewer from './components/ContractsViewer';
import { displayCardList } from './types';
import CreateDocumentDrawer from './components/drawers/CreateDocumentDrawer';

const ContractManagement = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state?.contractManagement?.activeTab);

  useEffect(() => {
    injectReducer('contractManagement', contractManagementReducer);
  }, []);

  return (
    <div className={styles.contractManagementContainer}>
      <div className={styles.headerSection}>
        <ModuleHeader 
          title={"E-Signature & Contract Management"}
          description={"Send, sign, and manage documents and contracts electronically with ease."}
          icon={"file-text"}
        />
        <div className={styles.actionsBlock}>
          <Button variant="outlined" color="secondary">
            <CustomIcon iconName="settings" width={16} height={16} /> 
            <Typography>Global Settings</Typography>
          </Button>
          <Button variant="outlined" color="secondary">
            <CustomIcon iconName="shield" width={16} height={16} /> 
            <Typography>Branding</Typography>
          </Button>
          <Button variant="outlined" color="secondary">
            <CustomIcon iconName="shield" width={16} height={16} /> 
            <Typography>Identity Verification</Typography>
          </Button>
          <Button 
            variant="contained"
            color="primary"
            onClick={() => {dispatch(setCreateDocumentDrawerOpen(true))}}
          >
            <CustomIcon iconName="plus" width={16} height={16} variant="white" /> 
            <Typography>New Document</Typography>
          </Button>
          <CreateDocumentDrawer />
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
          {activeTab === CONTRACT_MANAGEMENT_TAB.DOCUMENTS ? <DocumentsViewer /> : <ContractsViewer />}
        </div>
      </div>
    </div>
  );
};

export default ContractManagement;
