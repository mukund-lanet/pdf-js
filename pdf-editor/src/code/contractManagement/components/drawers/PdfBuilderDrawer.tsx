import React from 'react';
import Drawer from "@trenchaant/pkg-ui-component-library/build/Components/Drawer";
import Card from "@trenchaant/pkg-ui-component-library/build/Components/Card";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../store";
import { setDialogDrawerState, setDocumentDrawerMode } from "../../store/action/contractManagement.actions";
import { DIALOG_DRAWER_NAMES } from "../../types";
import styles from "@/app/(after-login)/(with-header)/contract-management/contractManagement.module.scss";

const PdfBuilderDrawer = () => {
  const dispatch = useDispatch();
  const pdfBuilderDrawerOpen = useSelector((state: RootState) => state?.contractManagement?.pdfBuilderDrawerOpen);

  const handleClose = () => {
    dispatch(setDialogDrawerState(DIALOG_DRAWER_NAMES.PDF_BUILDER_DRAWER, false));
  };

  const handleNewDocumentClick = () => {
    dispatch(setDocumentDrawerMode('create'));
    dispatch(setDialogDrawerState(DIALOG_DRAWER_NAMES.DOCUMENT_DRAWER, true));
    dispatch(setDialogDrawerState(DIALOG_DRAWER_NAMES.PDF_BUILDER_DRAWER, false));
  };

  const handleUploadPdfClick = () => {
    dispatch(setDocumentDrawerMode('upload'));
    dispatch(setDialogDrawerState(DIALOG_DRAWER_NAMES.DOCUMENT_DRAWER, true));
    dispatch(setDialogDrawerState(DIALOG_DRAWER_NAMES.PDF_BUILDER_DRAWER, false));
  };
  
  return (
    <Drawer
      anchor={"right"}
      open={pdfBuilderDrawerOpen}
      label="Create New Document"
      description="Choose how you want to create your document"
      closeIcon={true}
      size="medium"
      onClose={handleClose}
      className={styles.createDocumentDrawer}
    >
      <div className={styles.createNewDocumentOptionsWrapper}>
        <Card
          commonselection
          iconName={"sparkles"}
          variant="primary"
          color="#9F49EC"
          borderColor="#c084fc"
          backgroundColor="#faf5ff80"
          label={"Create with AI"}
          description={"Describe your contract and let AI generate it for you"}
          className={styles.documentScratchTextField}
          onCardClick={() => {}}
          classes={{
            iconBox: styles.createWithAiCard,
          }}
        />
        <Card
          commonselection
          iconName={"mouse-pointer"}
          variant="primary"
          color="#2563eb"
          label={"New Document"}
          description={"Create a proposal, estimate or contract from scratch"}
          className={styles.documentScratchTextField}
          onCardClick={handleNewDocumentClick}
          classes={{
            iconBox: styles.newDocumentCard,
          }}
        />
        <Card
          commonselection
          iconName="code"
          color="#16a34a"
          borderColor="#4ade80"
          backgroundColor="#f0fdf480"
          label={"Upload existing PDF's"}
          description={"Only PDF files are supported for upload"}
          className={styles.documentScratchTextField}
          onCardClick={handleUploadPdfClick}
          classes={{
            iconBox: styles.uploadPdfCard,
          }}
        />
        <Card
          commonselection
          iconName="file-text"
          color="#EA580C"
          borderColor="#EA580C"
          backgroundColor="#faf5ff80"
          label={"Import from template library"}
          description={"Import a document from a large collection of templates from the template library."}
          className={styles.documentScratchTextField}
          onCardClick={() => {}}
          classes={{
            iconBox: styles.importTemplateCard,
          }}
        />
      </div>
    </Drawer>
  );
};

export default PdfBuilderDrawer;
