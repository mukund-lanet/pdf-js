import React from 'react';
import Drawer from "@trenchaant/pkg-ui-component-library/build/Components/Drawer";
import Card from "@trenchaant/pkg-ui-component-library/build/Components/Card";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../store";
import { setCreateDocumentDrawerOpen } from "../../store/action/contractManagement.actions";
import styles from "@/app/(after-login)/(with-header)/contract-management/contractManagement.module.scss";

const CreateDocumentDrawer = () => {
  const isDrawerOpen = useSelector((state: RootState) => state?.contractManagement?.createDocumentDrawerOpen);
  const dispatch = useDispatch();

  const handleDrawerClose = () => {
    dispatch(setCreateDocumentDrawerOpen(false));
  }
  
  return (
    <Drawer
      anchor={"right"}
      open={isDrawerOpen}
      label={`New Document`}
      closeIcon={true}
      size="medium"
      cancelBtn={{ onClick: () => { handleDrawerClose() }, label: "Cancel" }}
      onClose={() => { handleDrawerClose() }}
      className={styles.createNewDocumentDrawer}
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
          onCardClick={() => {}}
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
          onCardClick={() => {}}
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

export default CreateDocumentDrawer;