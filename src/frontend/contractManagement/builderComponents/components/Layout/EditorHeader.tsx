'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import TextField from '@trenchaant/pkg-ui-component-library/build/Components/TextField';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import { PageDimension } from '../../../utils/interface';
import { RootState } from '../../../store/reducer/contractManagement.reducer';
import { SET_CANVAS_ELEMENTS, SET_CURRENT_PAGE, SET_IS_LOADING, SET_PAGE_DIMENSIONS, SET_PAGES, SET_SELECTED_TEXT_ELEMENT, SET_TOTAL_PAGES, updateDocument } from '../../../store/action/contractManagement.actions';

const EditorHeader = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const documentType = useSelector((state: RootState) => state?.contractManagement?.documentType);
  const pages = useSelector((state: RootState) => state?.contractManagement?.pages || []);
  const uploadPdfUrl = useSelector((state: RootState) => state?.contractManagement?.uploadPdfUrl);
  const curDocument = useSelector((state: RootState) => state?.contractManagement?.activeDocument);
  // Access state for saving
  const canvasElements = useSelector((state: RootState) => state?.contractManagement?.canvasElements);
  const pageDimensions = useSelector((state: RootState) => state?.contractManagement?.pageDimensions);
  const totalPages = useSelector((state: RootState) => state?.contractManagement?.totalPages);

  const [docName, setDocName] = useState(curDocument?.name || '');

  useEffect(() => {
    if (curDocument?.name) {
      setDocName(curDocument.name);
    }
  }, [curDocument?.name]);

  // Handle initial document loading based on documentType
  useEffect(() => {
    // If we have pages data, we don't need to initialize the document
    if (pages && pages.length > 0) {
      dispatch({ type: SET_TOTAL_PAGES, payload: pages.length })
      dispatch({ type: SET_CURRENT_PAGE, payload: 1 })
      return;
    }

    const initializeDocument = () => {
      if (documentType === 'new_document') {
        // Create a new blank page
        createNewDocument();
      } else if (documentType === 'upload-existing' && uploadPdfUrl) {
        // For uploaded PDFs, backend should provide pages[] with imagePath
        // No client-side processing needed
        console.log('PDF upload: Waiting for backend to process and provide pages[] with imagePath');
      }
    };

    initializeDocument();
  }, [documentType, uploadPdfUrl, pages]);

  const createNewDocument = () => {
    try {
      dispatch({ type: SET_IS_LOADING, payload: true })
      
      // Create initial blank page
      const newPages = [{}];  // Empty object = blank white page
      dispatch({ type: SET_PAGES, payload: newPages });
      
      dispatch({ type: SET_TOTAL_PAGES, payload: 1 })
      dispatch({ type: SET_CURRENT_PAGE, payload: 1 })
      dispatch({ type: SET_CANVAS_ELEMENTS, payload: [] })
      dispatch({ type: SET_PAGE_DIMENSIONS, payload: { 1: { pageWidth: 600, pageHeight: 800 } } })
      dispatch({ type: SET_SELECTED_TEXT_ELEMENT, payload: null })
      dispatch({ type: SET_IS_LOADING, payload: false })
    } catch (error) {
      dispatch({ type: SET_IS_LOADING, payload: false })
      console.error('Error creating new document:', error);
    }
  };

  return (
    <div className={styles.toolbarWrapper} >
      <Button
        variant={"outlined"}
        color={"secondary"}
        startIcon={<CustomIcon iconName='arrow-left' height={16} width={16} />}
        onClick={() => router.back()}
      >
        <Typography> Previous </Typography>
      </Button>

      <TextField
        variant="outlined"
        value={docName}
        placeholder="Enter document name"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDocName(e.target.value)}
      />
      <Button
        variant={"contained"}
        color={"primary"}
        startIcon={<CustomIcon iconName='save' height={16} width={16} variant={"white"} />}
        onClick={() => {
          if (!curDocument?._id) {
            console.error('No document ID available for save');
            return;
          }

          dispatch(updateDocument({
            documentId: curDocument._id,
            documentName: docName,
            canvasElements: canvasElements || [],
            pageDimensions: pageDimensions || {},
            totalPages: totalPages || 0,
            signers: curDocument?.signers || [],
            signingOrder: curDocument?.signingOrder,
            pages: pages || []
          }));
        }}
      >
        <Typography> Save </Typography>
      </Button>
    </div>
  );
};

export default EditorHeader;
