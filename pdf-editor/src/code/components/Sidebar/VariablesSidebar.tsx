'use client';
import React, { useState } from 'react';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";

const VariablesSidebar = ({ onClose }: { onClose?: () => void }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const variables = [
    { key: 'document.createdDate', value: 'November 19, 2025' },
    { key: 'document.refNumber', value: 'P10003' },
    { key: 'document.subAccountName', value: 'Star Industries' },
  ];

  const filteredVariables = variables.filter(v =>
    v.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  return (
    <div className={styles.variablesSidebar}>
      <div className={styles.sidebarHeader}>
        <Typography variant="h6" className={styles.sidebarTitle}>Document variables</Typography>
        {onClose && (
          <Button className={styles.closeButton} onClick={onClose}>
            <CustomIcon iconName="x" width={20} height={20} />
          </Button>
        )}
      </div>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search"
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button className={styles.addButton} variant="outlined">
          <CustomIcon iconName="plus" width={20} height={20} />
        </Button>
      </div>

      <div className={styles.variablesList}>
        {filteredVariables.map((variable) => (
          <div key={variable.key} className={styles.variableItem}>
            <Typography className={styles.variableKey}>{variable.key}</Typography>
            <div className={styles.variableValueContainer}>
              <div className={styles.variableValue}>{variable.value}</div>
              <Button className={styles.copyButton} onClick={() => handleCopy(variable.value)}>
                <CustomIcon iconName="copy" width={16} height={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VariablesSidebar;
