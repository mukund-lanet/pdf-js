'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import ElementsSidebar from '../Sidebar/ElementsSidebar';
import ThumbnailSidebar from '../Sidebar/ThumbnailSidebar';
import VariablesSidebar from '../Sidebar/VariablesSidebar';
import SettingsSidebar from '../Sidebar/SettingsSidebar';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import { DRAWER_COMPONENT_CATEGORY } from '../../types';
import { RootState } from '../../store/reducer/pdfEditor.reducer';

const EditorLeftDrawer = () => {
  const drawerComponentType = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.drawerComponentCategory);

  return (
    <div className={`${styles.leftSideDrawerWrapper} ${drawerComponentType === DRAWER_COMPONENT_CATEGORY.ADD_ELEMENTS ? styles.leftSideDrawerElement : ''}`}>
      {drawerComponentType === DRAWER_COMPONENT_CATEGORY.ADD_ELEMENTS && (
        <ElementsSidebar />
      )}
      {drawerComponentType === DRAWER_COMPONENT_CATEGORY.PAGES && (
        <ThumbnailSidebar />
      )}
      {drawerComponentType === DRAWER_COMPONENT_CATEGORY.DOCUMENT_VARIABLES && (
        <VariablesSidebar />
      )}
      {drawerComponentType === DRAWER_COMPONENT_CATEGORY.SETTINGS && (
        <SettingsSidebar />
      )}
    </div>
  );
};

export default EditorLeftDrawer;
