import React, { useState } from 'react';
import Drawer from "@trenchaant/pkg-ui-component-library/build/Components/Drawer";
import TextField from "@trenchaant/pkg-ui-component-library/build/Components/TextField";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../store";
import { setDialogDrawerState } from "../../store/action/contractManagement.actions";
import { DIALOG_DRAWER_NAMES } from "../../types";
import styles from "@/app/(after-login)/(with-header)/contract-management/contractManagement.module.scss";

const NewDocumentDrawer = () => {
  const dispatch = useDispatch();
  const newDocumentDrawerOpen = useSelector((state: RootState) => state?.contractManagement?.newDocumentDrawerOpen);
  const [newDocumentName, setNewDocumentName] = useState('');

  const handleClose = () => {
    dispatch(setDialogDrawerState(DIALOG_DRAWER_NAMES.NEW_DOCUMENT_DRAWER, false));
    setNewDocumentName('');
  };

  const handleCreateNewDocument = () => {
    if (newDocumentName.trim()) {
      console.log('Creating new document:', newDocumentName);
      // TODO: Navigate to PDF builder or create document logic
      handleClose();
    }
  };
  
  return (
    <Drawer
      anchor={"right"}
      open={newDocumentDrawerOpen}
      label="Create New Document"
      description="Enter a name for your new document"
      closeIcon={true}
      size="medium"
      cancelBtn={{ 
        onClick: handleClose, 
        label: "Cancel" 
      }}
      submitBtn={{ 
        onClick: handleCreateNewDocument, 
        label: "Create Document" 
      }}
      onClose={handleClose}
      className={styles.createDocumentDrawer}
    >
      <div className={styles.docsNameFileWrapper}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={"Enter document name"}
          label="Document Name"
          hideBorder={true}
          name="newDocumentName"
          value={newDocumentName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDocumentName(e.target.value)}
          inputProps={{ className: 'py-10 text-13' }}
          required
        />
      </div>
    </Drawer>
  );
};

export default NewDocumentDrawer;
