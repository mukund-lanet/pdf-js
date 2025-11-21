'use client';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/reducer/pdfEditor.reducer';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import CreateVariableDialog from './CreateVariableDialog';

// const VariablesSidebar = ({ onClose }: { onClose?: () => void }) => {
const VariablesSidebar = () => {
  const dispatch = useDispatch();
  const variables = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.documentVariables);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredVariables = variables.filter(v =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleDelete = (name: string) => {
    dispatch({
      type: 'DELETE_DOCUMENT_VARIABLE',
      payload: name
    });
  };

  const handleSaveVariable = (name: string, value: string) => {
    // Ensure name starts with document. if not present
    const finalName = name.startsWith('document.') ? name : `document.${name}`;

    dispatch({
      type: 'ADD_DOCUMENT_VARIABLE',
      payload: { name: finalName, value, isSystem: false }
    });
  };

  return (
    <div className={styles.variablesSidebar}>
      <div className={styles.sidebarHeader}>
        <Typography variant="h6" className={styles.sidebarTitle}>Document variables</Typography>
        {/* {onClose && (
          <Button className={styles.closeButton} onClick={onClose}>
            <CustomIcon iconName="x" width={20} height={20} />
          </Button>
        )} */}
      </div>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search"
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          className={styles.addButton}
          variant="outlined"
          onClick={() => setIsDialogOpen(true)}
        >
          <CustomIcon iconName="plus" width={20} height={20} />
        </Button>
      </div>

      <div className={styles.variablesList}>
        <div className={styles.variableItemsWrapper} >
          {filteredVariables.map((variable) => (
            <div key={variable.name} className={styles.variableItem}>
              <Typography className={styles.variableKey}>{variable.name}</Typography>
              <div className={styles.variableValueContainer}>
                <div className={styles.variableValue}>{variable.value}</div>
                <div className={styles.variableActions}>
                  <Button className={styles.copyButton} onClick={() => handleCopy(variable.value)}>
                    <CustomIcon iconName="copy" width={16} height={16} />
                  </Button>
                  {!variable.isSystem && (
                    <Button className={styles.deleteButton} onClick={() => handleDelete(variable.name)}>
                      <CustomIcon iconName="trash2" width={16} height={16} />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isDialogOpen && (
        <CreateVariableDialog
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSaveVariable}
        />
      )}
    </div>
  );
};

export default VariablesSidebar;
