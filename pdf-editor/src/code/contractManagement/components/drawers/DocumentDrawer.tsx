import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter, usePathname } from 'next/navigation';
import Drawer from "@trenchaant/pkg-ui-component-library/build/Components/Drawer";
import TextField from "@trenchaant/pkg-ui-component-library/build/Components/TextField";
import Select from "@trenchaant/pkg-ui-component-library/build/Components/Select/SimpleSelect";
import MenuItem from "@trenchaant/pkg-ui-component-library/build/Components/MenuItem";
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import IconButton from "@trenchaant/pkg-ui-component-library/build/Components/IconButton";
import CustomIcon from "@trenchaant/pkg-ui-component-library/build/Components/CustomIcon";
import Chip from "@trenchaant/pkg-ui-component-library/build/Components/Chip";
import Switch from "@trenchaant/pkg-ui-component-library/build/Components/Switch";
import SingleFileDropZone from "components/commonComponentCode/singleFileDropZone";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../store";
import { setDialogDrawerState, createNewDocument, updateDocument, setActiveDocument, uploadDocumentPdf, setDocumentDrawerMode, setUploadPdfUrl } from "../../store/action/contractManagement.actions";
import { DIALOG_DRAWER_NAMES, Signer } from "../../utils/interface";
import styles from "@/app/(after-login)/(with-header)/contract-management/contractManagement.module.scss";

const DocumentDrawer = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const documentDrawerOpen = useSelector((state: RootState) => state?.contractManagement?.documentDrawerOpen);
  const documentDrawerMode = useSelector((state: RootState) => state?.contractManagement?.documentDrawerMode);
  const activeDocument = useSelector((state: RootState) => state?.contractManagement?.activeDocument);
  
  const isEditMode = documentDrawerMode === 'edit';
  const isUploadMode = documentDrawerMode === 'upload';
  const isCreateMode = documentDrawerMode === 'create';
  
  // Extract business name from pathname (e.g., /new-mukund/contract-management -> new-mukund)
  const businessName = pathname?.split('/')[1] || '';
  
  const [signingOrderEnabled, setSigningOrderEnabled] = React.useState(activeDocument?.signingOrder || false);
  
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      documentName: activeDocument?.name || '',
      file: null as File | null,
      signers: activeDocument?.signers || ([] as Signer[]),
      currentSignerName: '',
      currentSignerEmail: '',
      currentSignerType: 'signer' as 'signer' | 'approver' | 'cc',
    },
    validationSchema: Yup.object({
      documentName: Yup.string()
        .required('Document name is required')
        .min(3, 'Document name must be at least 3 characters'),
      file: Yup.mixed()
        .nullable()
        .test('fileRequired', 'Please upload a PDF file', function(value) {
          if (isUploadMode) {
            return value !== null;
          }
          return true;
        }),
      currentSignerName: Yup.string()
        .test('signerNameRequired', 'Signer name is required', function(value) {
           return true; 
        }),
      currentSignerEmail: Yup.string()
        .email('Invalid email address')
        .test('signerEmailRequired', 'Signer email is required', function(value) {
            return true;
        }),
      signers: Yup.array()
        // .min(1, 'At least one signer is required')
    }),
    onSubmit: async (values, { resetForm }) => {
      if (isEditMode && activeDocument) {
        // Update existing document
       dispatch(updateDocument({
          documentId: activeDocument.id,
          documentName: values.documentName,
          signers: values.signers,
          signingOrder: signingOrderEnabled
        }));
        handleClose();
        resetForm();
      } else if (isUploadMode && values.file) {
        // Upload PDF document and navigate to editor
        const fileReader = new FileReader();
        fileReader.onload = async (e) => {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const pdfBytes = new Uint8Array(arrayBuffer);
          
          const newDoc = {
            id: 'temp-id', // In a real app, this would come from the backend
            name: values.documentName,
            status: 'draft',
            date: new Date().toISOString(),
            signers: values.signers,
            progress: 0,
            dueDate: 'No due date',
            createdBy: 'Current User',
          };

          dispatch(uploadDocumentPdf({
            documentName: values.documentName,
            file: values.file as File,
            signers: values.signers,
            pdfBytes
          }));
          
          dispatch(setActiveDocument(newDoc));

          // Create blob URL for the file
          const blobUrl = URL.createObjectURL(values.file as File);
          dispatch(setUploadPdfUrl(blobUrl));
          
          // Set document type for PDF editor
          dispatch({ type: 'SET_DOCUMENT_TYPE', payload: 'upload-existing' });
          
          handleClose();
          resetForm();
          
          // Navigate to PDF editor (preserve business name in URL)
          router.push(`/${businessName}/pdf-editor`);
        };
        fileReader.readAsArrayBuffer(values.file);
      } else if (isCreateMode) {
        // Create new document and navigate to editor
        const newDoc = {
          id: 'temp-id', // In a real app, this would come from the backend
          name: values.documentName,
          status: 'draft',
          date: new Date().toISOString(),
          signers: values.signers,
          progress: 0,
          dueDate: 'No due date',
          createdBy: 'Current User',
          signingOrder: signingOrderEnabled,
        };

        // Create new document and navigate to editor
        dispatch(createNewDocument({
          documentName: values.documentName,
          signers: values.signers,
          signingOrder: signingOrderEnabled
        }));

        dispatch(setActiveDocument(newDoc));
        
        // Set document type for PDF editor
        dispatch({ type: 'SET_DOCUMENT_TYPE', payload: 'new_document' });
        
        handleClose();
        resetForm();
        
        // Navigate to PDF editor (preserve business name in URL)
        router.push(`/${businessName}/pdf-editor`);
      }
    },
  });

  const {
    values,
    handleChange,
    handleBlur,
    touched,
    handleSubmit,
    errors,
    setFieldValue,
  } = formik;

  const handleClose = () => {
    dispatch(setDialogDrawerState(DIALOG_DRAWER_NAMES.DOCUMENT_DRAWER, false));
    dispatch(setActiveDocument(null));
    dispatch(setDocumentDrawerMode(null));
    setSigningOrderEnabled(false);
    formik.resetForm();
  };

  const handleAddSigner = async () => {
    if (!values.currentSignerName || values.currentSignerName.length < 2) {
        formik.setFieldError('currentSignerName', 'Signer name is required');
        formik.setFieldTouched('currentSignerName', true);
        return;
    }
    if (!values.currentSignerEmail || !Yup.string().email().isValidSync(values.currentSignerEmail)) {
        formik.setFieldError('currentSignerEmail', 'Valid signer email is required');
        formik.setFieldTouched('currentSignerEmail', true);
        return;
    }

    const newSigner: Signer = {
      name: values.currentSignerName,
      email: values.currentSignerEmail,
      type: values.currentSignerType,
    };
    
    setFieldValue('signers', [...values.signers, newSigner]);
    setFieldValue('currentSignerName', '');
    setFieldValue('currentSignerEmail', '');
    setFieldValue('currentSignerType', 'signer');
    
    formik.setFieldError('currentSignerName', undefined);
    formik.setFieldError('currentSignerEmail', undefined);
  };

  const handleRemoveSigner = (index: number) => {
    const updatedSigners = values.signers.filter((_, i) => i !== index);
    setFieldValue('signers', updatedSigners);
  };

  const moveSignerUp = (index: number) => {
    if (index === 0) return;
    const newSigners = [...values.signers];
    [newSigners[index - 1], newSigners[index]] = [newSigners[index], newSigners[index - 1]];
    setFieldValue('signers', newSigners);
  };

  const moveSignerDown = (index: number) => {
    if (index === values.signers.length - 1) return;
    const newSigners = [...values.signers];
    [newSigners[index], newSigners[index + 1]] = [newSigners[index + 1], newSigners[index]];
    setFieldValue('signers', newSigners);
  };

  const getDrawerTitle = () => {
    if (isEditMode) return "Edit Document";
    if (isUploadMode) return "Upload PDF Document";
    return "Create New Document";
  };

  const getDrawerDescription = () => {
    if (isEditMode) return "Update document name and signers";
    if (isUploadMode) return "Upload documents and files for e-signature";
    return "Create a new document and add signers";
  };

  const getSubmitLabel = () => {
    if (isEditMode) return "Update Document";
    if (isUploadMode) return "Upload Document";
    return "Create Document";
  };

  return (
    <Drawer
      anchor={"right"}
      open={documentDrawerOpen}
      label={getDrawerTitle()}
      description={getDrawerDescription()}
      closeIcon={true}
      icon="file-text"
      size="60%"
      cancelBtn={{ 
        onClick: handleClose, 
        label: "Cancel" 
      }}
      submitBtn={{ 
        onClick: () => handleSubmit(), 
        label: getSubmitLabel(),
        // loading: loading state here and the user will wait.
      }}
      onClose={handleClose}
      className={styles.createDocumentDrawer}
      isForForm
    >
      <div className={styles.documentDrawerWrapper} >
        <div className={styles.docsNameFileWrapper}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={"Enter document name"}
            label="Document Name"
            hideBorder={true}
            name="documentName"
            value={values.documentName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.documentName && Boolean(errors.documentName)}
            helperText={touched.documentName && errors.documentName}
            inputProps={{ className: 'py-10 text-13' }}
            required
          />
          
          {isUploadMode && (
            <div>
              <SingleFileDropZone
                file={values.file ? [values.file] : []}
                setFiles={(updaterOrValue: any) => {
                  let result;
                  if (typeof updaterOrValue === 'function') {
                    result = updaterOrValue({});
                  } else {
                    result = updaterOrValue;
                  }

                  if (result?.file && Array.isArray(result.file) && result.file.length > 0) {
                    setFieldValue('file', result.file[0]);
                  }
                }}
                containerHeightClass="h-128"
                handleDelete={() => setFieldValue('file', null)}
                handlePreview={() => {}}
                validation={"application/pdf"}
              />
              {touched.file && errors.file && (
                <Typography className={styles.errorText}>
                  {typeof errors.file === 'string' ? errors.file : 'Please upload a file'}
                </Typography>
              )}
            </div>
          )}
        </div>

        <div className={styles.signersNameEmailSelectWrapper}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={"Signer name"}
            label="Add Signers"
            hideBorder={true}
            name="currentSignerName"
            value={values.currentSignerName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.currentSignerName && Boolean(errors.currentSignerName)}
            helperText={touched.currentSignerName && errors.currentSignerName}
            inputProps={{ className: 'py-10 text-13' }}
          />
          <TextField
            fullWidth
            variant="outlined"
            placeholder={"Signer email"}
            hideBorder={true}
            name="currentSignerEmail"
            value={values.currentSignerEmail}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.currentSignerEmail && Boolean(errors.currentSignerEmail)}
            helperText={touched.currentSignerEmail && errors.currentSignerEmail}
            inputProps={{ className: 'py-10 text-13' }}
          />
          <Select
            fullWidth
            name="currentSignerType"
            value={values.currentSignerType}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue('currentSignerType', e.target.value)}
            size="small"
          >
            <MenuItem value={"signer"}>Signer</MenuItem>
            <MenuItem value={"approver"}>Approver</MenuItem>
            <MenuItem value={"cc"}>CC</MenuItem>
          </Select>
          <div className={styles.addSignerBtnWrapper}>
            <Button
              fullWidth
              variant="outlined"
              className={styles.addCustomFieldsBtn}
              onClick={handleAddSigner}
            >
              <Typography>Add Signer</Typography>
            </Button>
            {touched.signers && errors.signers && (
              <Typography className={styles.errorText}>
                {typeof errors.signers === 'string' ? errors.signers : 'Please add at least one signer'}
              </Typography>
            )}
          </div>
        </div>
        {values.signers.length > 0 && (
          <div className={styles.displaySignersWrapper}>
            <div className={styles.signingOrderHeader}>
              <Typography fontWeight="600">Added Signers{signingOrderEnabled && ` (${values.signers.length})`}:</Typography>
              <div className={styles.signingOrderToggle}>
                <Typography>Signing Order</Typography>
                <Switch 
                  checked={signingOrderEnabled}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSigningOrderEnabled(e.target.checked)}
                  size="small"
                />
              </div>
            </div>
            {signingOrderEnabled && (
              <Typography className={styles.signingOrderDescription}>
                Documents will be sent in the order shown below
              </Typography>
            )}
            {values.signers.map((signer, index) => (
              <div key={index} className={`${styles.displaySignerItem} ${signingOrderEnabled ? styles.withOrder : ''}`}>
                {signingOrderEnabled && (
                  <div className={styles.signerOrderControls}>
                    <Typography className={styles.orderNumber}>#{index + 1}</Typography>
                    <div className={styles.reorderButtons}>
                      <IconButton
                        size="small"
                        onClick={() => moveSignerUp(index)}
                        disabled={index === 0}
                      >
                        <CustomIcon iconName="chevron-up" height={16} width={16} customColor={index === 0 ? "#ccc" : "#666"} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => moveSignerDown(index)}
                        disabled={index === values.signers.length - 1}
                      >
                        <CustomIcon iconName="chevron-down" height={16} width={16} customColor={index === values.signers.length - 1 ? "#ccc" : "#666"} />
                      </IconButton>
                    </div>
                  </div>
                )}
                <div className={styles.signerInfo}>
                  <Typography fontWeight="500">{signer.name}</Typography>
                  <Typography className={styles.signerEmail}>{signer.email}</Typography>
                  <Typography className={styles.signerType}>
                    <Chip className={styles.signerChip} label={signer.type} />
                  </Typography>
                </div>
                <IconButton
                  variant="text"
                  color="error"
                  onClick={() => handleRemoveSigner(index)}
                >
                  <CustomIcon iconName="trash-2" height={16} width={16} customColor="#FF0000" />
                </IconButton>
              </div>
            ))}
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default DocumentDrawer;
