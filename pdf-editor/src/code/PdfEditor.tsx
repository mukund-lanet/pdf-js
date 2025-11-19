'use client';
import React, { useEffect } from 'react';
import Divider from '@trenchaant/pkg-ui-component-library/build/Components/Divider';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import { injectReducer } from 'components/store';
import reducer from './store/index'
import EditorHeader from './components/Layout/EditorHeader';
import EditorLeftSidebar from './components/Layout/EditorLeftSidebar';
import EditorLeftDrawer from './components/Layout/EditorLeftDrawer';
import EditorMainArea from './components/Layout/EditorMainArea';
import EditorRightSidebar from './components/Layout/EditorRightSidebar';

const PdfEditor = () => {
  useEffect(() => { injectReducer("pdfEditor", reducer) }, [])

  return (
    <div className={styles.pdfEditorContainer}>
      <EditorHeader />

      <div className={styles.leftSideBarDrawer} >
        <EditorLeftSidebar />
      </div>

      <Divider orientation="horizontal" className={styles.toolbarDivider} />

      <div className={styles.mainContainer}>
        <EditorLeftDrawer />
        <EditorMainArea />
        <EditorRightSidebar />
      </div>
    </div>
  );
};

export default PdfEditor;