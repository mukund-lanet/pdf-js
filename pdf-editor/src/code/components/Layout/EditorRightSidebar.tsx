'use client';
import React from 'react';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';

const EditorRightSidebar = () => {
  return (
    <div className={styles.rightSideBarDrawer} >
      <div className={styles.builderRightSideHeaderTitleWrapper}>
        <CustomIcon iconName="settings" width={20} height={20} />
        <Typography fontWeight="600" className={styles.builderRightSideHeaderTitle}> Properties </Typography>
      </div>
      <div className={styles.emptyMessage}>
        <div className={styles.iconWrapper}>
          <CustomIcon iconName="settings" width={48} height={48} customColor="#d1d5db" />
        </div>
        <h3 className={styles.title}>No Element Selected</h3>
        <p className={styles.description}>
          Click on an element in the canvas to view and edit its properties
        </p>
      </div>
    </div>
  );
};

export default EditorRightSidebar;
