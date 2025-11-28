import React, { useState } from 'react';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import { useDispatch } from 'react-redux';

interface CreateVariableDialogProps {
  setIsDialogOpen: (value: boolean) => void;
}

const CreateVariableDialog = ({ setIsDialogOpen }: CreateVariableDialogProps) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const dispatch = useDispatch();

  const handleSaveVariable = (name: string, value: string) => {
    const finalName = name.startsWith('document.') ? name : `document.${name}`;

    dispatch({
      type: 'ADD_DOCUMENT_VARIABLE',
      payload: { name: finalName, value, isSystem: false }
    });
  };

  const onClose = () => setIsDialogOpen(false);

  const handleSave = () => {
    if (name && value) {
      handleSaveVariable(name, value);
      onClose();
    }
  };

  return (
    <div className={styles.dialogOverlay}>
      <div className={styles.dialogContainer}>
        <div className={styles.dialogHeader}>
          <Typography variant="h6">Create Document variable</Typography>
          <Button className={styles.closeButton} onClick={onClose}>
            <CustomIcon iconName="x" width={20} height={20} />
          </Button>
        </div>
        <div className={styles.dialogContent}>
          <Typography className={styles.dialogDescription}>Create variable for your document</Typography>

          <div className={styles.inputGroup}>
            <label>Variable name <span className={styles.required}>*</span></label>
            <input
              type="text"
              placeholder="Variable name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.dialogInput}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Variable value <span className={styles.required}>*</span></label>
            <input
              type="text"
              placeholder="Variable value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className={styles.dialogInput}
            />
          </div>
        </div>
        <div className={styles.dialogFooter}>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateVariableDialog;
