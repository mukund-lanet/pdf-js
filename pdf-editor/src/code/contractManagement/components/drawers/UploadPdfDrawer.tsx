import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Drawer from "@trenchaant/pkg-ui-component-library/build/Components/Drawer";
import Stepper from "@trenchaant/pkg-ui-component-library/build/Components/Stepper";
import TextField from "@trenchaant/pkg-ui-component-library/build/Components/TextField";
import Select from "@trenchaant/pkg-ui-component-library/build/Components/Select/SimpleSelect";
import MenuItem from "@trenchaant/pkg-ui-component-library/build/Components/MenuItem";
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import IconButton from "@trenchaant/pkg-ui-component-library/build/Components/IconButton";
import CustomIcon from "@trenchaant/pkg-ui-component-library/build/Components/CustomIcon";
import Chip from "@trenchaant/pkg-ui-component-library/build/Components/Chip";
import SingleFileDropZone from "components/commonComponentCode/singleFileDropZone";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../store";
import { setDialogDrawerState } from "../../store/action/contractManagement.actions";
import { DIALOG_DRAWER_NAMES } from "../../types";
import styles from "@/app/(after-login)/(with-header)/contract-management/contractManagement.module.scss";

interface Signer {
  name: string;
  email: string;
  type: 'signer' | 'approver' | 'cc';
}

const UploadPdfDrawer = () => {
  const dispatch = useDispatch();
  const uploadPdfDocumentDrawerOpen = useSelector((state: RootState) => state?.contractManagement?.uploadPdfDocumentDrawerOpen);

  const formik = useFormik({
    enableReinitialize: false,
    initialValues: {
      documentName: '',
      file: null as File | null,
      signers: [] as Signer[],
      currentSignerName: '',
      currentSignerEmail: '',
      currentSignerType: 'signer' as 'signer' | 'approver' | 'cc',
      progress: 0,
    },
    validationSchema: Yup.object({
      progress: Yup.number(),
      documentName: Yup.string()
        .required('Document name is required')
        .min(3, 'Document name must be at least 3 characters'),
      file: Yup.mixed()
        .nullable()
        .test('fileRequired', 'Please upload a PDF file', function(value) {
          const { progress } = this.parent as any;
          if (progress === 0) {
            return value !== null;
          }
          return true;
        }),
      currentSignerName: Yup.string()
        .test('signerNameRequired', 'Signer name is required', function(value) {
          const { progress } = this.parent as any;
          if (progress === 1) {
            return value ? value.length >= 2 : true;
          }
          return true;
        }),
      currentSignerEmail: Yup.string()
        .email('Invalid email address')
        .test('signerEmailRequired', 'Signer email is required', function(value) {
          const { progress } = this.parent as any;
          if (progress === 1) {
            return value ? Yup.string().email().isValidSync(value) : true;
          }
          return true;
        }),
      signers: Yup.array()
        .min(1, 'At least one signer is required')
        .test('signersRequired', 'Please add at least one signer', function(value) {
          const { progress } = this.parent as any;
          if (progress === 1) {
            return value && value.length > 0;
          }
          return true;
        }),
    }),
    onSubmit: async (values, { setFieldValue }) => {
      if (values.progress === 1) {
        console.log('Submitting document:', values);
        // TODO: Add your submission logic here
        handleClose();
        formik.resetForm();
        setFieldValue("progress", 0);
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
    dispatch(setDialogDrawerState(DIALOG_DRAWER_NAMES.UPLOAD_PDF_DOCUMENT_DRAWER, false));
    formik.resetForm();
    setFieldValue("progress", 0);
  };

  const steps = [
    { label: "Upload Files", description: "Add documents & media" },
    { label: "Add Signers", description: "Assign recipients" },
  ];

  const onPrevCancelClick = () => {
    if (values.progress === 0) {
      handleClose();
    } else {
      setFieldValue("progress", values.progress - 1);
    }
  };
  
  const onNextSubmitClick = async () => {
    if (values.progress === 0) {
      const step0Errors = await formik.validateForm();
      if (!step0Errors.documentName && !step0Errors.file) {
        setFieldValue("progress", 1);
      } else {
        formik.setTouched({
          documentName: true,
          file: true,
        });
      }
    } else if (values.progress === 1) {
      const step1Errors = await formik.validateForm();
      if (!step1Errors.signers) {
        handleSubmit();
      } else {
        formik.setTouched({
          signers: {} as any,
        });
      }
    }
  };

  const handleAddSigner = async () => {
    const errors = await formik.validateForm();
    
    if (!errors.currentSignerName && !errors.currentSignerEmail && 
        values.currentSignerName && values.currentSignerEmail) {
      const newSigner: Signer = {
        name: values.currentSignerName,
        email: values.currentSignerEmail,
        type: values.currentSignerType,
      };
      
      setFieldValue('signers', [...values.signers, newSigner]);
      setFieldValue('currentSignerName', '');
      setFieldValue('currentSignerEmail', '');
      setFieldValue('currentSignerType', 'signer');
    } else {
      formik.setTouched({
        currentSignerName: true,
        currentSignerEmail: true,
      });
    }
  };

  const handleRemoveSigner = (index: number) => {
    const updatedSigners = values.signers.filter((_, i) => i !== index);
    setFieldValue('signers', updatedSigners);
  };
  
  return (
    <Drawer
      anchor={"right"}
      open={uploadPdfDocumentDrawerOpen}
      label="Upload PDF Document"
      description="Upload documents and files for e-signature"
      closeIcon={true}
      size="medium"
      cancelBtn={{ 
        onClick: onPrevCancelClick, 
        label: values.progress === 0 ? "Cancel" : "Previous" 
      }}
      submitBtn={{ 
        onClick: onNextSubmitClick, 
        label: values.progress === 0 ? "Next" : "Submit" 
      }}
      onClose={handleClose}
      className={styles.createDocumentDrawer}
    >
      <Stepper
        steps={steps}
        activeStep={values.progress}
        labelPlacement="start"
        hidefooter
        classes={{ mainRoot: styles.stepperRoot }}
      >
        {values.progress === 0 && <div className={styles.docsNameFileWrapper}>
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
                {errors.file}
              </Typography>
            )}
          </div>
        </div>}
        {values.progress === 1 && <div className={styles.signersNameEmailSelectWrapper}>
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
                {errors.signers}
              </Typography>
            )}
          </div>

          {/* Display added signers */}
          {values.signers.length > 0 && (
            <div className={styles.displaySignersWrapper}>
              <Typography fontWeight="600">Added Signers:</Typography>
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
      </Stepper>
    </Drawer>
  );
};

export default UploadPdfDrawer;
