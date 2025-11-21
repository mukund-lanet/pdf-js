'use client';
import React, { useEffect } from 'react';
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
  const businessName = useSelector((state: any) => state?.auth?.businessName);

  useEffect(() => {
    dispatch({ type: 'UPDATE_DOCUMENT_VARIABLE', payload: { name: "document.subAccountName", value: businessName } })
  }, [businessName]);

  // const handleClose = () => {
  //   dispatch({ type: 'SET_DRAWER_COMPONENT_CATEGORY', payload: undefined });
  // };

  return (
    <div className={`${styles.leftSideDrawerWrapper} ${drawerComponentType === DRAWER_COMPONENT_CATEGORY.ADD_ELEMENTS ? styles.leftSideDrawerElement : ''}`}>
      {drawerComponentType === DRAWER_COMPONENT_CATEGORY.ADD_ELEMENTS && (
        <ElementsSidebar
          activeTool={activeTool}
        // onClose={handleClose}
        />
      )}
      {drawerComponentType === DRAWER_COMPONENT_CATEGORY.PAGES && (
        <ThumbnailSidebar
          pdfBytes={pdfBytes}
          currentPage={currentPage}
          onThumbnailClick={(i: number) => dispatch({ type: 'SET_CURRENT_PAGE', payload: i })}
        // onClose={handleClose}
        />
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
