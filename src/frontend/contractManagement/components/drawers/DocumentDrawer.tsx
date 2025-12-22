import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
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
import MediaManagerList from "@trenchaant/common-component/dist/commonComponent/mediaManager";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../store";
import { setDialogDrawerState, createNewDocument, updateDocument, setActiveDocument, uploadDocumentPdf, setDocumentDrawerMode, setUploadPdfUrl, SET_DOCUMENT_TYPE } from "../../store/action/contractManagement.actions";
import { DIALOG_DRAWER_NAMES, Signer } from "../../utils/interface";
import styles from "@/app/(after-login)/(with-header)/contract-management/contractManagement.module.scss";

const DocumentDrawer = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const documentDrawerOpen = useSelector((state: RootState) => state?.contractManagement?.documentDrawerOpen);
  const documentDrawerMode = useSelector((state: RootState) => state?.contractManagement?.documentDrawerMode);
  const activeDocument = useSelector((state: RootState) => state?.contractManagement?.activeDocument);
  const business_id = useSelector((state: any) => state?.auth?.business?.id);
  
  const isEditMode = documentDrawerMode === 'edit';
  const isUploadMode = documentDrawerMode === 'upload';
  const isCreateMode = documentDrawerMode === 'create';
  
  const [signingOrderEnabled, setSigningOrderEnabled] = useState(activeDocument?.signingOrder || false);
  const [selectedMenu, setSelectedMenu] = useState("");
  const [mediaManagerSelection, setMediaManagerSelection] = useState<any[]>([]);
  
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      documentName: activeDocument?.name || '',
      file: null as any,
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
    }),
    onSubmit: async (values, { resetForm }) => {
      if (isEditMode && activeDocument) {
       dispatch(updateDocument({
          documentId: activeDocument._id,
          documentName: values.documentName,
          signers: values.signers,
          signingOrder: signingOrderEnabled,
          business_id,
        }));
        handleClose();
        resetForm();
      } else if (isUploadMode && values.file) {

        dispatch(setUploadPdfUrl(values.file.original_url));
        
        dispatch({ type: SET_DOCUMENT_TYPE, payload: 'upload-existing' });
        
        const result = await dispatch(uploadDocumentPdf({
          documentName: values.documentName,
          fileUrl: values.file.original_url,
          signers: values.signers,
          business_id,
        }));
 
        console.log({result})
        
        if (result && result._id) {
          dispatch(setActiveDocument(result));
          
          handleClose();
          resetForm();
        } else {
          console.error('Failed to get document ID from upload response');
        }
      } else if (isCreateMode) {
        dispatch({ type: 'SET_DOCUMENT_TYPE', payload: 'new_document' });
        
        const result = await dispatch(createNewDocument({
          documentName: values.documentName,
          signers: values.signers,
          signingOrder: signingOrderEnabled,
          business_id,
          pages: [{
            imagePath: '',
            imageUrl: '',
            fromPdf: false,
          }]
        }));
        
        if (result && result._id) {
          dispatch(setActiveDocument(result));
          
          handleClose();
          resetForm();
        } else {
          console.error('Failed to get document ID from create response');
        }
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
    setSelectedMenu("");
    setMediaManagerSelection([]);
    formik.resetForm();
  };

  const handleMediaSubmit = () => {
    if (mediaManagerSelection.length > 0) {
      const selectedFile = mediaManagerSelection[0];
      setFieldValue('file', selectedFile);
    }
    setSelectedMenu("");
    setMediaManagerSelection([]);
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
        onClick: handleSubmit, 
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
            <div className={styles.mediaSelectionWrapper}>
              {values.file ? (
                <div className={styles.selectedFileCard}>
                  <div className={styles.fileInfo}>
                    <CustomIcon iconName="file-text" height={24} width={24} variant="gray" />
                    <div className={styles.fileNameWrapper} >
                      <Typography fontWeight="500">{values.file.name}</Typography>
                      <Typography className={styles.fileSize}>
                        {(values.file.file_size / 1024).toFixed(2)} MB
                      </Typography>
                    </div>
                  </div>
                  <IconButton
                    size="small"
                    onClick={() => setFieldValue('file', null)}
                  >
                    <CustomIcon iconName="trash-2" height={16} width={16} customColor="#FF0000" />
                  </IconButton>
                </div>
              ) : (
                <Button
                  fullWidth
                  variant="outlined"
                  color="gray"
                  startIcon={<CustomIcon iconName="folder-open" height={16} width={16} variant="gray" />}
                  onClick={() => setSelectedMenu("mediaManage")}
                  className={styles.selectMediaButton}
                >
                  Select PDF from Media Gallery
                </Button>
              )}
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
      
      <MediaManagerList
        type="drawer"
        anchor="right"
        acceptedFileType="application/pdf"
        filterMediaDisplay
        filterMediaUpload
        showHeader
        showFooter
        showSideBar
        isMediaOpen={selectedMenu === "mediaManage" || false}
        multiSelection={false}
        handleStateChange={(dataObj: any[]) => setMediaManagerSelection(dataObj)}
        selectedMedia={mediaManagerSelection}
        handleSubmit={handleMediaSubmit}
        handleCancel={() => {
          setSelectedMenu("");
          setMediaManagerSelection([]);
        }}
        submitButtonText="Select"
        cancelButtonText="Cancel"
        title="Select PDF Document"
      />
    </Drawer>
  );
};

export default DocumentDrawer;
