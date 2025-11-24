'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import { RootState } from '../../store/reducer/pdfEditor.reducer';
import { HeadingElement, ImageElement, TableElement, VideoElement } from '../../types';
import HeadingProperties from '../Properties/HeadingProperties';
import ImageProperties from '../Properties/ImageProperties';
import VideoProperties from '../Properties/VideoProperties';
import TableProperties from '../Properties/TableProperties';

const EditorRightSidebar = () => {
  const activeElementId = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.activeElementId);
  const canvasElements = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.canvasElements);

  const activeElement = canvasElements?.find(el => el.id === activeElementId);


  const renderPropertiesPanel = () => {
    if (!activeElement) {
      return (
        <div className={styles.emptyMessage}>
          <div className={styles.iconWrapper}>
            <CustomIcon iconName="settings" width={48} height={48} customColor="#d1d5db" />
          </div>
          <h3 className={styles.title}>No Element Selected</h3>
          <p className={styles.description}>
            Click on an element in the canvas to view and edit its properties
          </p>
        </div>
      );
    }

    switch (activeElement.type) {
      case 'heading':
        return <HeadingProperties element={activeElement as HeadingElement} />;
      case 'image':
        return <ImageProperties element={activeElement as ImageElement} />;
      case 'video':
        return <VideoProperties element={activeElement as VideoElement} />;
      case 'table':
        return <TableProperties element={activeElement as TableElement} />;
      default:
        return (
          <div className={styles.emptyMessage}>
            <div className={styles.iconWrapper}>
              <CustomIcon iconName="settings" width={48} height={48} customColor="#d1d5db" />
            </div>
            <h3 className={styles.title}>No Properties Available</h3>
            <p className={styles.description}>
              This element type doesn't have editable properties yet
            </p>
          </div>
        );
    }
  };

  return (
    <div className={styles.rightSideBarDrawer} >
      <div className={styles.builderRightSideHeaderTitleWrapper}>
        <CustomIcon iconName="settings" width={20} height={20} />
        <Typography fontWeight="600" className={styles.builderRightSideHeaderTitle}>Properties</Typography>
      </div>

      {renderPropertiesPanel()}
    </div>
  );
};

export default EditorRightSidebar;
