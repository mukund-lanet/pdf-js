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
// import Segmented from "@trenchaant/pkg-ui-component-library/build/Components/Segmented";
// import Segment from "@trenchaant/pkg-ui-component-library/build/Components/Segment";
import CustomScrollbar from "@trenchaant/pkg-ui-component-library/build/Components/ScrollBar";
import { contractManagementReducer, RootState } from './store';
import { getDocuments, setDialogDrawerState } from './store/action/contractManagement.actions';
import { DIALOG_DRAWER_NAMES } from './utils/interface';
import DocumentsViewer from './components/DocumentsViewer';
// import ContractsViewer from './components/ContractsViewer';
import PdfBuilderDrawer from './components/drawers/PdfBuilderDrawer';
import DocumentDrawer from './components/drawers/DocumentDrawer';
import IdentityVerification from './components/dialogues/identityVarification';
import GlobalDocumentSettings from './components/dialogues/globalDocumentSettings';
import BrandingCustomization from './components/dialogues/brandingCustomization';

const ContractManagement = () => {
  const dispatch = useDispatch();
  const documents = useSelector((state: RootState) => state?.contractManagement?.documents);
  const business_id = useSelector((state: any) => state?.auth?.business?.id);

  const callApi = () => {
    dispatch(getDocuments({ business_id }));
  }

  useEffect(() => {
    injectReducer('contractManagement', contractManagementReducer);
    callApi();
  }, []);

  const displayCardList = [
    {
      title: 'Total Documents',
      value: documents?.length,
      description: 'All documents',
      iconName: 'file-text',
      iconColor: '#1d4ed8',
      iconBgColor: '#bfdbfe',
    },
    // {
    //   title: 'Active Contracts',
    //   value: 4,
    //   description: 'Contracts currently active',
    //   iconName: 'file-check',
    //   iconColor: '#15803d',
    //   iconBgColor: '#dcfce7',
    // },
    {
      title: 'Pending Signatures',
      value: documents?.filter((document) => document.status === 'waiting')?.length,
      description: 'Awaiting signature',
      iconName: 'clock',
      iconColor: '#ea580c',
      iconBgColor: '#ffedd5',
    },
    // {
    //   title: 'Contract Value',
    //   value: `$${10000}`,
    //   description: 'Total contract value',
    //   iconName: 'dollar-sign',
    //   iconColor: '#444444',
    //   iconBgColor: '#f3f4f6',
    // }
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
          {/* <Button 
            variant="outlined" 
            color="secondary"
            onClick={() => dispatch(setDialogDrawerState(DIALOG_DRAWER_NAMES.GLOBAL_DOCUMENT_SETTINGS_DIALOG, true))}
          >
            <CustomIcon iconName="settings" width={16} height={16} /> 
            <Typography>Global Settings</Typography>
          </Button>
          <Button 
            variant="outlined" 
            color="secondary"
            onClick={() => dispatch(setDialogDrawerState(DIALOG_DRAWER_NAMES.BRANDING_CUSTOMIZATION_DIALOG, true))}
          >
            <CustomIcon iconName="shield" width={16} height={16} /> 
            <Typography>Branding</Typography>
          </Button>
          <Button 
            variant="outlined"
            color="secondary"
            onClick={() => dispatch(setDialogDrawerState(DIALOG_DRAWER_NAMES.IDENTITY_VERIFICATION_DIALOG, true))}
          >
            <CustomIcon iconName="shield" width={16} height={16} /> 
            <Typography>Identity Verification</Typography>
          </Button> */}
          <Button 
            variant="contained"
            color="primary"
            onClick={() => dispatch(setDialogDrawerState(DIALOG_DRAWER_NAMES.PDF_BUILDER_DRAWER, true))}
          >
            <CustomIcon iconName="plus" width={16} height={16} variant="white" /> 
            <Typography>New Document</Typography>
          </Button>
          <PdfBuilderDrawer />
          <DocumentDrawer />
          <IdentityVerification />
          <GlobalDocumentSettings />
          <BrandingCustomization />
        </div>  
      </div>
      <CustomScrollbar className={styles.scrollActionContractMainSection} >
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
          {/* <Segmented
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
          </Segmented> */}

          <div className={styles.contentBody}>
            {/* {activeTab === CONTRACT_MANAGEMENT_TAB.DOCUMENTS ? <DocumentsViewer /> : <ContractsViewer />} */}
            <DocumentsViewer />
          </div>
        </div>
      </CustomScrollbar>
    </div>
  );
};

export default ContractManagement;
