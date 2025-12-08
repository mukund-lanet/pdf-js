'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { PDFDocument } from 'pdf-lib';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import TextField from '@trenchaant/pkg-ui-component-library/build/Components/TextField';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import { PageDimension } from '../../../utils/interface';
import { RootState } from '../../../store/reducer/contractManagement.reducer';
// import MediaButton from "@trenchaant/common-component/dist/commonComponent/mediaButton";
import MediaButton from "components/commonComponentCode/mediaButton";
import { SET_CANVAS_ELEMENTS, SET_CURRENT_PAGE, SET_IS_LOADING, SET_PAGE_DIMENSIONS, SET_PDF_BYTES, SET_SELECTED_TEXT_ELEMENT, SET_TOTAL_PAGES, updateDocument } from '../../../store/action/contractManagement.actions';

const EditorHeader = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const file = useSelector((state: RootState) => state?.contractManagement?.media);
  const documentType = useSelector((state: RootState) => state?.contractManagement?.documentType);
  const pdfBytes = useSelector((state: RootState) => state?.contractManagement?.pdfBytes);
  const uploadPdfUrl = useSelector((state: RootState) => state?.contractManagement?.uploadPdfUrl);
  const curDocument = useSelector((state: RootState) => state?.contractManagement?.activeDocument);
  
  // Access state for saving
  const canvasElements = useSelector((state: RootState) => state?.contractManagement?.canvasElements);
  const pageDimensions = useSelector((state: RootState) => state?.contractManagement?.pageDimensions);
  const totalPages = useSelector((state: RootState) => state?.contractManagement?.totalPages);

  const [docName, setDocName] = useState<string>(curDocument?.name || '');
  console.log("id: ", curDocument?._id)

  // Handle initial document loading based on documentType
  useEffect(() => {
    const initializeDocument = async () => {
      if (documentType === 'new_document' && !pdfBytes) {
        await createNewPdf();
      } else if (documentType === 'upload-existing') {
        if (uploadPdfUrl) {
           console.log('Loading PDF from URL:', uploadPdfUrl);
           try {
             dispatch({ type: SET_IS_LOADING, payload: true });
             const response = await fetch(uploadPdfUrl);
             const arrayBuffer = await response.arrayBuffer();
             const pdfDoc = await PDFDocument.load(arrayBuffer);
             const pageCount = pdfDoc.getPageCount();

             const dimensions: { [key: number]: PageDimension } = {};
             for (let i = 0; i < pageCount; i++) {
               const page = pdfDoc.getPages()[i];
               const { width, height } = page.getSize();
               dimensions[i + 1] = { pageWidth: width, pageHeight: height };
             }

             dispatch({ type: SET_TOTAL_PAGES, payload: pageCount })
             dispatch({ type: SET_CURRENT_PAGE, payload: 1 })
             dispatch({ type: SET_PDF_BYTES, payload: new Uint8Array(arrayBuffer) })
             dispatch({ type: SET_CANVAS_ELEMENTS, payload: [] })
             dispatch({ type: SET_PAGE_DIMENSIONS, payload: dimensions })
             dispatch({ type: SET_SELECTED_TEXT_ELEMENT, payload: null })
             dispatch({ type: SET_IS_LOADING, payload: false })
           } catch (error) {
             console.error('Error loading PDF from URL:', error);
             dispatch({ type: SET_IS_LOADING, payload: false });
           }
        } else if (pdfBytes) {
          console.log('Uploaded PDF loaded with', pdfBytes.length, 'bytes');
        }
      }
    };

    initializeDocument();
  }, [documentType, uploadPdfUrl]);

  const createNewPdf = async () => {
    try {
      dispatch({ type: SET_IS_LOADING, payload: true })
      const pdfDoc = await PDFDocument.create();
      pdfDoc.addPage([600, 800]);
      const bytes = await pdfDoc.save();
      dispatch({ type: SET_TOTAL_PAGES, payload: 1 })
      dispatch({ type: SET_CURRENT_PAGE, payload: 1 })
      dispatch({ type: SET_PDF_BYTES, payload: bytes })
      dispatch({ type: SET_CANVAS_ELEMENTS, payload: [] })
      dispatch({ type: SET_PAGE_DIMENSIONS, payload: { 1: { pageWidth: 600, pageHeight: 800 } } })
      dispatch({ type: SET_SELECTED_TEXT_ELEMENT, payload: null })
      dispatch({ type: SET_IS_LOADING, payload: false })
    } catch (error) {
      dispatch({ type: SET_IS_LOADING, payload: false })
      console.error('Error creating new PDF:', error);
    }
  };

  const handleFileUpload = async (fileToUpload?: any) => {
    if (!fileToUpload) return;

    try {
      dispatch({ type: SET_IS_LOADING, payload: true });
      
      let arrayBuffer: ArrayBuffer;
      
      // Handle MediaButton media object (has original_url or url)
      if (fileToUpload.original_url || fileToUpload.url) {
        const fileUrl = fileToUpload.original_url || fileToUpload.url;
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch PDF from URL');
        }
        arrayBuffer = await response.arrayBuffer();
      } 
      // Handle direct File object from input
      else if (fileToUpload instanceof File) {
        arrayBuffer = await fileToUpload.arrayBuffer();
      } 
      else {
        throw new Error('Invalid file format');
      }

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

      dispatch({ type: SET_TOTAL_PAGES, payload: pageCount })
      dispatch({ type: SET_CURRENT_PAGE, payload: 1 })
      dispatch({ type: SET_PDF_BYTES, payload: new Uint8Array(arrayBuffer) })
      dispatch({ type: SET_CANVAS_ELEMENTS, payload: [] })
      dispatch({ type: SET_PAGE_DIMENSIONS, payload: dimensions })
      dispatch({ type: SET_SELECTED_TEXT_ELEMENT, payload: null })
    } catch (error) {
      console.error('Error loading PDF:', error);
      alert('Failed to load PDF. Please make sure it is a valid PDF file.');
    } finally {
      dispatch({ type: SET_IS_LOADING, payload: false })
    }
  };

  return (
    <div className={styles.toolbarWrapper} >
      <Button
        variant={"outlined"}
        color={"secondary"}
        startIcon={<CustomIcon iconName='arrow-left' height={16} width={16} /> }
        onClick={() => router.back()}
      >
        <Typography> Previous </Typography>
      </Button>
      {/* <div className={styles.toolbarDragDropBarWrapper} >
        <Button className={styles.toolbarItem} onClick={createNewPdf}>
          <Typography className={styles.label} >New Document</Typography>
        </Button>
        <MediaButton
          classes={{mediaButton: styles.toolbarItem}}
          noBtnIcon
          title="Upload PDF"
          setSelectedMedia={(selectedMedia:any) => {
            dispatch({ type: SET_PDF_MEDIA, payload: selectedMedia });
            if (selectedMedia && selectedMedia.length > 0) {
              handleFileUpload(selectedMedia[0]);
            }
          }}
          allow={true}
          allowFromLocal={true}
          supportedDocTypes="pdf"
        />
      </div> */}
      <TextField 
        variant="outlined"  
        value={docName}
        placeholder="Enter document name"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDocName(e.target.value)}
      />
      <Button
        variant={"contained"}
        color={"primary"}
        startIcon={ <CustomIcon iconName='save' height={16} width={16} variant={"white"} /> }
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
            signingOrder: curDocument?.signingOrder 
          }));
        }}
      >
        <Typography> Save </Typography>
      </Button>
    </div>
  );
};

export default EditorHeader;
