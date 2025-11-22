'use client';
import React from 'react';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
// import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
// import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import BlockToolbar from '../Toolbar/BlockToolbar';
import FillableToolbar from '../Toolbar/FillableToolbar';
import { RootState } from '../../store/reducer/pdfEditor.reducer';
import { useSelector } from 'react-redux';

interface ElementsSidebarProps {
  activeTool: string | null;
}

const ElementsSidebar = ({ activeTool }: ElementsSidebarProps) => {

  const pdfBytes = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.pdfBytes);
  const isLoading = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.isLoading);

  const isDraggable = !isLoading && !!pdfBytes;

  return (
    <div className={styles.elementsSidebar}>
      <div className={styles.sidebarHeader}>
        <Typography variant="h6" className={styles.sidebarTitle}>Add an Element</Typography>
      </div>

      <div className={styles.sidebarContent}>
        <div className={styles.elementSection}>
          <Typography variant="caption" className={styles.sectionTitle}>BLOCKS</Typography>
          <div className={styles.elementsGrid}>
            <BlockToolbar activeTool={activeTool} isDraggable={isDraggable} />
          </div>
        </div>

        <div className={styles.elementSection}>
          <Typography variant="caption" className={styles.sectionTitle}>FILLABLE FIELDS</Typography>
          <div className={styles.elementsGrid}>
            <FillableToolbar activeTool={activeTool} isDraggable={isDraggable} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElementsSidebar;
