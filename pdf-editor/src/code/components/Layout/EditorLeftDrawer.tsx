'use client';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ElementsSidebar from '../Sidebar/ElementsSidebar';
import ThumbnailSidebar from '../Sidebar/ThumbnailSidebar';
import VariablesSidebar from '../Sidebar/VariablesSidebar';
import SettingsSidebar from '../Sidebar/SettingsSidebar';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import { DRAWER_COMPONENT_CATEGORY } from '../../types';
import { RootState } from '../../store/reducer/pdfEditor.reducer';

const EditorLeftDrawer = () => {
  const dispatch = useDispatch();
  const drawerComponentType = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.drawerComponentCategory);
  const activeTool = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.activeTool);
  const pdfBytes = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.pdfBytes);
  const currentPage = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.currentPage);

  const handleDragStart = (type: string) => {
    dispatch({ type: 'SET_ACTIVE_TOOL', payload: type })
  };

  const handleClose = () => {
    dispatch({ type: 'SET_DRAWER_COMPONENT_CATEGORY', payload: undefined });
  };

  return (
    <div className={`${styles.leftSideDrawerWrapper} ${drawerComponentType === DRAWER_COMPONENT_CATEGORY.ADD_ELEMENTS ? styles.leftSideDrawerElement : ''}`}>
      {drawerComponentType === DRAWER_COMPONENT_CATEGORY.ADD_ELEMENTS && (
        <ElementsSidebar
          onDragStart={handleDragStart}
          activeTool={activeTool}
          onClose={handleClose}
        />
      )}
      {drawerComponentType === DRAWER_COMPONENT_CATEGORY.PAGES && (
        <ThumbnailSidebar
          pdfBytes={pdfBytes}
          currentPage={currentPage}
          onThumbnailClick={(i: number) => dispatch({ type: 'SET_CURRENT_PAGE', payload: i })}
          onClose={handleClose}
        />
      )}
      {drawerComponentType === DRAWER_COMPONENT_CATEGORY.DOCUMENT_VARIABLES && (
        <VariablesSidebar onClose={handleClose} />
      )}
      {drawerComponentType === DRAWER_COMPONENT_CATEGORY.SETTINGS && (
        <SettingsSidebar onClose={handleClose} />
      )}
    </div>
  );
};

export default EditorLeftDrawer;
