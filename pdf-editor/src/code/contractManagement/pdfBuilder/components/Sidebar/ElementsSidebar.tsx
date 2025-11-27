'use client';
import React from 'react';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import BlockToolbar from '../Toolbar/BlockToolbar';
import FillableToolbar from '../Toolbar/FillableToolbar';


const ElementsSidebar = () => {

  return (
    <div className={styles.elementsSidebar}>
      <div className={styles.sidebarHeader}>
        <Typography variant="h6" className={styles.sidebarTitle}>Add an Element</Typography>
      </div>

      <div className={styles.sidebarContent}>
        <div className={styles.elementSection}>
          <Typography variant="caption" className={styles.sectionTitle}>BLOCKS</Typography>
          <div className={styles.elementsGrid}>
            <BlockToolbar />
          </div>
        </div>

        <div className={styles.elementSection}>
          <Typography variant="caption" className={styles.sectionTitle}>FILLABLE FIELDS</Typography>
          <div className={styles.elementsGrid}>
            <FillableToolbar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElementsSidebar;
