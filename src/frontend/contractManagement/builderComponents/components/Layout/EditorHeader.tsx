'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import TextField from '@trenchaant/pkg-ui-component-library/build/Components/TextField';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import { RootState } from '../../../store/reducer/contractManagement.reducer';
import { SET_CANVAS_ELEMENTS, SET_CURRENT_PAGE, SET_IS_LOADING, SET_PAGES, SET_SELECTED_TEXT_ELEMENT, SET_TOTAL_PAGES, setIsUnsaved, upsertDocument } from '../../../store/action/contractManagement.actions';

const EditorHeader: React.FC<{ onPreviousClick?: () => void }> = ({ onPreviousClick }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const documentType = useSelector((state: RootState) => state?.contractManagement?.documentType);
  const pages = useSelector((state: RootState) => state?.contractManagement?.pages || []);
  const uploadPdfUrl = useSelector((state: RootState) => state?.contractManagement?.uploadPdfUrl);
  const curDocument = useSelector((state: RootState) => state?.contractManagement?.activeDocument);
  // Access state for saving
  const canvasElements = useSelector((state: RootState) => state?.contractManagement?.canvasElements);
  const isUnsaved = useSelector((state: RootState) => state?.contractManagement?.isUnsaved);

  const business_id = useSelector((state: any) => state?.auth?.business?.id);

  const [docName, setDocName] = useState(curDocument?.name || '');

  useEffect(() => {
    if (curDocument?.name) {
      setDocName(curDocument.name);
    }
  }, [curDocument?.name]);

  useEffect(() => {
    if (pages && pages.length > 0) {
      return;
    }

    const initializeDocument = () => {
      if (documentType === 'new_document') {
        createNewDocument();
      } else if (documentType === 'upload-existing' && uploadPdfUrl) {
        console.log('PDF upload: Waiting for backend to process and provide pages[] with imagePath');
      }
    };

    initializeDocument();
  }, [documentType, uploadPdfUrl, pages]);

  const createNewDocument = () => {
    try {
      dispatch({ type: SET_IS_LOADING, payload: true })
      
      const newPageId = uuidv4().replace(/-/g, '').substring(0, 24);
      const newPages = [{ _id: newPageId, fromPdf: false }];
      dispatch({ type: SET_PAGES, payload: newPages });
      
      dispatch({ type: SET_TOTAL_PAGES, payload: 1 })
      dispatch({ type: SET_CURRENT_PAGE, payload: 1 })
      dispatch({ type: SET_CANVAS_ELEMENTS, payload: [] })
      dispatch({ type: SET_SELECTED_TEXT_ELEMENT, payload: null })
      dispatch(setIsUnsaved(false))
      dispatch({ type: SET_IS_LOADING, payload: false })
    } catch (error) {
      dispatch({ type: SET_IS_LOADING, payload: false })
      console.error('Error creating new document:', error);
    }
  };

  const handleSaveDocument = () => {
    if (!curDocument?._id) {
      console.error('No document ID available for save');
      return;
    }

    if (isUnsaved) {
      dispatch(upsertDocument({
        id: curDocument._id,
        name: docName,
        signers: curDocument?.signers || [],
        is_signing_order: curDocument?.signingOrder || false,
        canvasElements: canvasElements || [],
        pages: pages || [],
        business_id
      }));
    } 
  };

  // Keyboard shortcut: Ctrl+S / Cmd+S to save
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log({event})
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        event.stopPropagation();
        handleSaveDocument();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [curDocument, docName, canvasElements, pages, business_id]);

  return (
    <div className={styles.toolbarWrapper} >
      <Button
        variant={"outlined"}
        color={"secondary"}
        startIcon={<CustomIcon iconName='arrow-left' height={16} width={16} />}
        onClick={() => onPreviousClick ? onPreviousClick() : router.back()}
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
        onClick={handleSaveDocument}
      >
        <Typography> Save </Typography>
      </Button>
    </div>
  );
};

export default EditorHeader;
