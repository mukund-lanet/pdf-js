import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Drawer from "@trenchaant/pkg-ui-component-library/build/Components/Drawer";
import Card from "@trenchaant/pkg-ui-component-library/build/Components/Card";
import Stepper from "@trenchaant/pkg-ui-component-library/build/Components/Stepper";
import TextField from "@trenchaant/pkg-ui-component-library/build/Components/TextField";
import Select from "@trenchaant/pkg-ui-component-library/build/Components/Select/SimpleSelect";
import MenuItem from "@trenchaant/pkg-ui-component-library/build/Components/MenuItem";
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import IconButton from "@trenchaant/pkg-ui-component-library/build/Components/IconButton";
import CustomIcon from "@trenchaant/pkg-ui-component-library/build/Components/CustomIcon";
import Chip from "@trenchaant/pkg-ui-component-library/build/Components/Chip";
import SingleFileDropZone from "@trenchaant/common-component/dist/commonComponent/singleFileDropZone";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../store";
import { setDocumentDrawerOpen, setPdfBuilderDrawerOpen } from "../../store/action/contractManagement.actions";
import styles from "@/app/(after-login)/(with-header)/contract-management/contractManagement.module.scss";

interface Signer {
  name: string;
  email: string;
  type: 'signer' | 'approver' | 'cc';
}

const CreateDocumentDrawer = () => {
  const dispatch = useDispatch();
  const documentDrawerOpen = useSelector((state: RootState) => state?.contractManagement?.documentDrawerOpen);
  const pdfBuilderDrawerOpen = useSelector((state: RootState) => state?.contractManagement?.pdfBuilderDrawerOpen);
  const [progress, setProgress] = useState<number>(0);

  // Formik setup with Yup validation
  const formik = useFormik({
    enableReinitialize: false,
    initialValues: {
      documentName: '',
      file: null as File | null,
      signers: [] as Signer[],
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
          // Only validate file on step 0
          if (progress === 0) {
            return value !== null;
          }
          return true;
        }),
      currentSignerName: Yup.string()
        .test('signerNameRequired', 'Signer name is required', function(value) {
          // Only validate on step 1 when adding a signer
          if (progress === 1) {
            return value ? value.length >= 2 : true;
          }
          return true;
        }),
      currentSignerEmail: Yup.string()
        .email('Invalid email address')
        .test('signerEmailRequired', 'Signer email is required', function(value) {
          // Only validate on step 1 when adding a signer
          if (progress === 1) {
            return value ? Yup.string().email().isValidSync(value) : true;
          }
          return true;
        }),
      signers: Yup.array()
        .min(1, 'At least one signer is required')
        .test('signersRequired', 'Please add at least one signer', function(value) {
          // Only validate signers array on step 1 when submitting
          if (progress === 1) {
            return value && value.length > 0;
          }
          return true;
        }),
    }),
    onSubmit: async (values, { setFieldValue, setValues }) => {
      // Handle form submission based on current step
      if (progress === 0) {
        // Validate step 0 before moving to step 1
        const step0Errors = await formik.validateForm();
        if (!step0Errors.documentName && !step0Errors.file) {
          setProgress(1);
        }
      } else if (progress === 1) {
        // Final submission
        console.log('Submitting document:', values);
        // TODO: Add your submission logic here
        // dispatch(createDocument(values));
        handleDocumentDrawerClose();
        // Reset form
        formik.resetForm();
        setProgress(0);
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
    setValues,
  } = formik;

  const handleDocumentDrawerClose = () => {
    dispatch(setDocumentDrawerOpen(false));
    formik.resetForm();
    setProgress(0);
  }

  const handlePdfBuilderDrawerClose = () => {
    dispatch(setPdfBuilderDrawerOpen(false));
  }

  const steps = [
    { label: "Upload Files", description: "Add documents & media" },
    { label: "Add Signers", description: "Assign recipients" },
  ]

  const onPrevCancelClick = () => {
    if (progress === 0) {
      handleDocumentDrawerClose();
    } else {
      setProgress(progress - 1);
    }
  }

  const onNextSubmitClick = async () => {
    if (progress === 0) {
      // Validate step 0 fields
      const step0Errors = await formik.validateForm();
      if (!step0Errors.documentName && !step0Errors.file) {
        setProgress(1);
      } else {
        formik.setTouched({
          documentName: true,
          file: true,
        });
      }
    } else if (progress === 1) {
      // Validate signers array before submission
      const step1Errors = await formik.validateForm();
      if (!step1Errors.signers) {
        handleSubmit();
      } else {
        formik.setTouched({
          signers: {} as any,
        });
      }
    }
  }

  const handleAddSigner = async () => {
    // Validate current signer fields
    const errors = await formik.validateForm();
    
    if (!errors.currentSignerName && !errors.currentSignerEmail && 
        values.currentSignerName && values.currentSignerEmail) {
      const newSigner: Signer = {
        name: values.currentSignerName,
        email: values.currentSignerEmail,
        type: values.currentSignerType,
      };
      
      setFieldValue('signers', [...values.signers, newSigner]);
      // Reset current signer fields
      setFieldValue('currentSignerName', '');
      setFieldValue('currentSignerEmail', '');
      setFieldValue('currentSignerType', 'signer');
    } else {
      formik.setTouched({
        currentSignerName: true,
        currentSignerEmail: true,
      });
    }
  }

  const handleRemoveSigner = (index: number) => {
    const updatedSigners = values.signers.filter((_, i) => i !== index);
    setFieldValue('signers', updatedSigners);
  }

  console.log({errors})
  
  return (
    <Drawer
      anchor={"right"}
      open={documentDrawerOpen || pdfBuilderDrawerOpen}
      label={ documentDrawerOpen? "Create New Document" : "New Document"}
      description={ documentDrawerOpen? "Upload documents and files for e-signature" : null}
      closeIcon={true}
      size="medium"
      cancelBtn={ documentDrawerOpen && { 
        onClick: onPrevCancelClick, 
        label: progress === 0 ? "Cancel" : "Previous" 
      }}
      submitBtn={ documentDrawerOpen && { 
        onClick: onNextSubmitClick, 
        label: progress === 0 ? "Next" : "Submit" 
      }}
      onClose={() => { documentDrawerOpen ? handleDocumentDrawerClose() : handlePdfBuilderDrawerClose() }}
      className={styles.createDocumentDrawer}
    >
      {pdfBuilderDrawerOpen 
        ? (<div className={styles.createNewDocumentOptionsWrapper}>
          <Card
            commonselection
            iconName={"sparkles"}
            variant="primary"
            color="#9F49EC"
            borderColor="#c084fc"
            backgroundColor="#faf5ff80"
            label={"Create with AI"}
            description={"Describe your contract and let AI generate it for you"}
            className={styles.documentScratchTextField}
            onCardClick={() => {}}
            classes={{
              iconBox: styles.createWithAiCard,
            }}
          />
          <Card
            commonselection
            iconName={"mouse-pointer"}
            variant="primary"
            color="#2563eb"
            label={"New Document"}
            description={"Create a proposal, estimate or contract from scratch"}
            className={styles.documentScratchTextField}
            onCardClick={() => {}}
            classes={{
              iconBox: styles.newDocumentCard,
            }}
          />
          <Card
            commonselection
            iconName="code"
            color="#16a34a"
            borderColor="#4ade80"
            backgroundColor="#f0fdf480"
            label={"Upload existing PDF's"}
            description={"Only PDF files are supported for upload"}
            className={styles.documentScratchTextField}
            onCardClick={() => {}}
            classes={{
              iconBox: styles.uploadPdfCard,
            }}
          />
          <Card
            commonselection
            iconName="file-text"
            color="#EA580C"
            borderColor="#EA580C"
            backgroundColor="#faf5ff80"
            label={"Import from template library"}
            description={"Import a document from a large collection of templates from the template library."}
            className={styles.documentScratchTextField}
            onCardClick={() => {}}
            classes={{
              iconBox: styles.importTemplateCard,
            }}
          />
        </div>)
        : (<Stepper
            steps={steps}
            activeStep={progress}
            labelPlacement="start"
            hidefooter
            classes={{ mainRoot: styles.stepperRoot }}
          >
            { progress === 0 && <div className={styles.docsNameFileWrapper} >
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
              <div>
                <SingleFileDropZone
                  file={values.file ? [values.file] : []}
                  setFiles={(updaterOrValue: any) => {
                    // SingleFileDropZone uses a functional state update: setFiles(prev => ({...prev, file: files}))
                    // We need to handle this function to get the actual file data
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
                  handlePreview={() => { }}
                  validation={"application/pdf"}
                />
                {touched.file && errors.file && (
                  <Typography className={styles.errorText} >
                    {errors.file}
                  </Typography>
                )}
              </div>
            </div>}
            { progress === 1 && <div className={styles.signersNameEmailSelectWrapper}>
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
              <div className={styles.addSignerBtnWrapper} >
                <Button
                  fullWidth
                  variant="outlined"
                  className={styles.addCustomFieldsBtn}
                  onClick={handleAddSigner}
                >
                  <Typography> Add Signer </Typography>
                </Button>
                {touched.signers && errors.signers && (
                  <Typography className={styles.errorText} >
                    {errors.signers}
                  </Typography>
                )}
              </div>

              {/* Display added signers */}
              {values.signers.length > 0 && (
                <div className={styles.displaySignersWrapper} >
                  <Typography fontWeight="600" >Added Signers:</Typography>
                  {values.signers.map((signer, index) => (
                    <div key={index} className={styles.displaySignerItem}>
                      <div>
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
            </div>}
          </Stepper>)
      }
    </Drawer>
  );
};

export default CreateDocumentDrawer;