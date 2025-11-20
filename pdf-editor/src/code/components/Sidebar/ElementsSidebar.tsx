'use client';
import React from 'react';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import BlockToolbar from '../Toolbar/BlockToolbar';
import FillableToolbar from '../Toolbar/FillableToolbar';

interface ElementsSidebarProps {
  onDragStart: (type: string) => void;
  activeTool: string | null;
  onClose?: () => void;
}

const ElementsSidebar = ({ onDragStart, activeTool, onClose }: ElementsSidebarProps) => {
  return (
    <div className={styles.elementsSidebar}>
      <div className={styles.sidebarHeader}>
        <Typography variant="h6" className={styles.sidebarTitle}>Add an Element</Typography>
        {onClose && (
          <Button className={styles.closeButton} onClick={onClose}>
            <CustomIcon iconName="x" width={20} height={20} />
          </Button>
        )}
      </div>

      <div className={styles.sidebarContent}>
        <div className={styles.elementSection}>
          <Typography variant="caption" className={styles.sectionTitle}>BLOCKS</Typography>
          <div className={styles.elementsGrid}>
            <BlockToolbar activeTool={activeTool} onDragStart={onDragStart} />
          </div>
        </div>

        <div className={styles.elementSection}>
          <Typography variant="caption" className={styles.sectionTitle}>FILLABLE FIELDS</Typography>
          <div className={styles.elementsGrid}>
            <FillableToolbar activeTool={activeTool} onDragStart={onDragStart} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElementsSidebar;
