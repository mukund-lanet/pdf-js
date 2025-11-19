'use client';
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { PDFDocument } from 'pdf-lib';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import { PageDimension } from '../../types';

const EditorHeader = () => {
  const dispatch = useDispatch();
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const createNewPdf = async () => {
    try {
      dispatch({ type: 'SET_IS_LOADING', payload: true })
      const pdfDoc = await PDFDocument.create();
      pdfDoc.addPage([600, 800]);
      const bytes = await pdfDoc.save();
      dispatch({ type: 'SET_TOTAL_PAGES', payload: 1 })
      dispatch({ type: 'SET_CURRENT_PAGE', payload: 1 })
      dispatch({ type: 'SET_PDF_BYTES', payload: bytes })
      dispatch({ type: 'SET_CANVAS_ELEMENTS', payload: [] })
      dispatch({ type: 'SET_PAGE_DIMENSIONS', payload: { 1: { pageWidth: 600, pageHeight: 800 } } })
      dispatch({ type: 'SET_SELECTED_TEXT_ELEMENT', payload: null })
      dispatch({ type: 'SET_IS_LOADING', payload: false })
    } catch (error) {
      dispatch({ type: 'SET_IS_LOADING', payload: false })
      console.error('Error creating new PDF:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      dispatch({ type: 'SET_IS_LOADING', payload: true })
      const arrayBuffer = await file.arrayBuffer();

      const header = new Uint8Array(arrayBuffer, 0, 5);
      const headerStr = String.fromCharCode(...header);

      if (!headerStr.includes('%PDF')) {
        throw new Error('Invalid PDF file: No PDF header found');
      }

      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();

      const dimensions: { [key: number]: PageDimension } = {};
      for (let i = 0; i < pageCount; i++) {
        const page = pdfDoc.getPages()[i];
        const { width, height } = page.getSize();
        dimensions[i + 1] = { pageWidth: width, pageHeight: height };
      }

      dispatch({ type: 'SET_TOTAL_PAGES', payload: pageCount })
      dispatch({ type: 'SET_CURRENT_PAGE', payload: 1 })
      dispatch({ type: 'SET_PDF_BYTES', payload: new Uint8Array(arrayBuffer) })
      dispatch({ type: 'SET_CANVAS_ELEMENTS', payload: [] })
      dispatch({ type: 'SET_PAGE_DIMENSIONS', payload: dimensions })
      dispatch({ type: 'SET_SELECTED_TEXT_ELEMENT', payload: null })
    } catch (error) {
      console.error('Error loading PDF:', error);
      console.log('Error loading PDF:', error);
      alert('Failed to load PDF. Please make sure it is a valid PDF file.');
    } finally {
      dispatch({ type: 'SET_IS_LOADING', payload: false })
    }
  };

  return (
    <div className={styles.toolbarWrapper} >
      <div className={styles.toolbarDragDropBarWrapper} >
        <Button className={styles.toolbarItem} onClick={createNewPdf}>
          <Typography className={styles.label} >New Document</Typography>
        </Button>
        <input
          type="file"
          id="pdf-file-upload"
          accept="application/pdf"
          ref={uploadInputRef}
          onChange={handleFileUpload}
          className={styles.toolbarItem}
          style={{ display: 'none' }}
        />
        <Button className={styles.toolbarItem} onClick={() => uploadInputRef.current?.click()}>
          <Typography className={styles.label} >Upload PDF</Typography>
        </Button>
      </div>
      <Button
        variant={"contained"}
        color={"primary"}
        startIcon={
          <CustomIcon iconName='save' height={16} width={16} variant={"white"} />
        }
      >
        <Typography> Save </Typography>
      </Button>
    </div>
  );
};

export default EditorHeader;
