import { useState } from 'react';
import Dialog from '@trenchaant/pkg-ui-component-library/build/Components/Dialog';
import Divider from '@trenchaant/pkg-ui-component-library/build/Components/Divider';
import Typography from '@trenchaant/pkg-ui-component-library/build/Components/Typography';
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Card from '@trenchaant/pkg-ui-component-library/build/Components/Card';
import TextField from '@trenchaant/pkg-ui-component-library/build/Components/TextField';
import Segmented from "@trenchaant/pkg-ui-component-library/build/Components/Segmented";
import Segment from "@trenchaant/pkg-ui-component-library/build/Components/Segment";
import ColorPickerComponent from "@trenchaant/pkg-ui-component-library/build/Components/ColorPickerComponent";
// import MediaButton from '@trenchaant/common-component/dist/commonComponent/mediaButton';
import MediaButton from 'components/commonComponentCode/mediaButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import styles from "app/(after-login)/(with-header)/contract-management/contractManagement.module.scss";
import { setDialogDrawerState, setBrandingCustomizationSettings } from '../../store/action/contractManagement.actions';
import { brandingTabItems, DIALOG_DRAWER_NAMES } from '../../types';

const brandingCustomization = () => {
  const dispatch = useDispatch();
  const dialogOpen = useSelector((state: RootState) => state?.contractManagement?.brandingCustomizationDialogOpen);

  const [state, setState] = useState({
    activeTab: "visual",
    companyName: "",
    logo: null as any,
    primaryEnchorEl: null,
    accentEncorEl: null,
    primaryColor: "#225ebf",
    accentColor: "#10B981",
    emailSubjectLine: "Please sign: {{document.name}}",
    emailMessage: "Hi {{signer.name}}, \nYou have been sent a document to review and sign. Please click the button below to get started. \nThank you!",
    ctaButtonText: "Review & Sign",
    footerText: "This is a legally binding electronic signature request."
  })

  const handleUploadAndInsert = (file: any) => {
    setState((prev) => ({ ...prev, logo: file }));
  };

  const handleEmbededClose = () => {
    dispatch(setDialogDrawerState(DIALOG_DRAWER_NAMES.BRANDING_CUSTOMIZATION_DIALOG, false));
  };

  const handleSaveSettings = () => {
    dispatch(setBrandingCustomizationSettings({...state}));
    dispatch(setDialogDrawerState(DIALOG_DRAWER_NAMES.BRANDING_CUSTOMIZATION_DIALOG, false));
  };

  const handleCloseColorPicker = () => {
    setState((prev) => ({ ...prev, primaryEnchorEl: null, accentEncorEl: null }));
  };

  const handleColorChange = (color: string, type: string) => {
    setState((prev) => ({ ...prev, [type]: color }));
  };

  const handleOpenColorPicker = (event: React.MouseEvent<HTMLElement>, type: string) => {
    event.stopPropagation();
    event.preventDefault();
    setState((prev) => ({ ...prev, [type]: event.currentTarget }));
  };

  return (
    <Dialog
      open={dialogOpen}
      anchor={"right"}
      onClose={handleEmbededClose}
      icon="shield"
      iconColor="#2463eb"
      size="65%"
      label="Branding & Customization"
      description="Customize the look and feel of your signature requests"
      closeIcon
      submitBtn={{ onClick: () => handleSaveSettings(), label: 'Save Branding' }}
      cancelBtn={{ onClick: () => handleEmbededClose(), label: "Cancel" }}
    >
      <div className={styles.brandingCustomizationDialogContentWrapper} >
        <Segmented
          indicatorColor="primary"
          textColor="primary"
          value={state.activeTab}
          fullWidth
          onChange={(value: string) => setState({ ...state, activeTab: value })}
        >
          { brandingTabItems.map((item) => (
            <Segment
              key={item.name}
              icon={<CustomIcon iconName={item.icon} height={16} width={16} variant='gray' />}
              label={item.title}
              value={item.name}
            />
          ))}
        </Segmented>
        {state.activeTab === "visual" && <div className={styles.visualSegmentContentWrapper} >
          <TextField
            fullWidth
            variant="outlined"
            placeholder={"Your Company"}
            label="Company Name"
            hideBorder={true}
            name="companyName"
            value={state.companyName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, companyName: e.target.value })}
            inputProps={{ className: 'py-10 text-13' }}
          />
          <div className={styles.logoPreviewWrapper}>
            <div className={styles.logoHeader}>
              <CustomIcon iconName="image" height={16} width={16} />
              <Typography className={styles.headerText}>Company Logo</Typography>
            </div>
            
            {state.logo && (
              <div className={styles.logoPreviewContainer}>
                  <img 
                    src={state.logo.thumbnail_url || state.logo.original_url || state.logo.url} 
                    alt="Company Logo" 
                    className={styles.logoImage} 
                  /> 
              </div>
            )}
            
            <div className={styles.uploadSection}>
              <MediaButton
                title="Upload Logo"
                setSelectedMedia={(selectedMedia: any) => {
                  if (selectedMedia && selectedMedia.length > 0) {
                    handleUploadAndInsert(selectedMedia[0]);
                  }
                }}
                allow={true}
                allowFromLocal={true}
                supportedDocTypes="image/*"
                className={styles.uploadlogoBtn}
                iconName="upload"
              />
              <Typography className={styles.helperText}>PNG, JPG up to 2MB. Recommended: 200x60px</Typography>
            </div>
          </div>
          <div className={styles.colorPickerContainer}>
            <div className={styles.labelTColorTextFieldWrapper} >
              <Typography className={styles.labelText}> Primary Color </Typography>
              <div className={styles.colorPickerTextField} >
                <div
                  className={styles.colorPickerIcon}
                  onClick={(e: React.MouseEvent<HTMLElement>) => handleOpenColorPicker(e, "primaryEnchorEl")}
                >
                  <span className={styles.colorViewer} style={{ backgroundColor: state.primaryColor }}></span>
                </div>
                <TextField
                  fullWidth
                  variant="outlined"
                  hideBorder={true}
                  name="primaryColor"
                  value={state.primaryColor}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, primaryColor: e.target.value })}
                  className={styles.textFieldInputColor}
                />
              </div>
            </div>
            {state.primaryEnchorEl && (
              <div onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                <ColorPickerComponent
                  showDialog={true}
                  closeDialogAction={() => handleCloseColorPicker()}
                  handleColorChange={(color: string) => handleColorChange(color, "primary")}
                  defaultHexCode={state.primaryColor}
                  anchorEl={state.primaryEnchorEl}
                  mode="popper"
                />
              </div>
            )}
            <div className={styles.labelTColorTextFieldWrapper} >
              <Typography className={styles.labelText}> Accent Color </Typography>
              <div className={styles.colorPickerTextField} >
                <div
                  className={styles.colorPickerIcon}
                  onClick={(e: React.MouseEvent<HTMLElement>) => handleOpenColorPicker(e, "accentEncorEl")}
                >
                  <span className={styles.colorViewer} style={{ backgroundColor: state.accentColor }}></span>
                </div>
                <TextField
                  fullWidth
                  variant="outlined"
                  hideBorder={true}
                  name="accentColor"
                  value={state.accentColor}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, accentColor: e.target.value })}
                  className={styles.textFieldInputColor}
                />
              </div>
            </div>
            {state.accentEncorEl && (
              <div onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                <ColorPickerComponent
                  showDialog={true}
                  closeDialogAction={() => handleCloseColorPicker()}
                  handleColorChange={(color: string) => handleColorChange(color, "accent")}
                  defaultHexCode={state.accentColor}
                  anchorEl={state.accentEncorEl}
                  mode="popper"
                />
              </div>
            )}
          </div>
        </div>}
        
        {state.activeTab === "email" && <div className={styles.emailSegmentContentWrapper} >
          <div className={styles.emailTextFieldHelperWrapper} >
            <TextField
              fullWidth
              variant="outlined"
              placeholder={"Please sign: {{document.name}}"}
              label="Email Subject Line"
              hideBorder={true}
              name="emailSubjectLine"
              value={state.emailSubjectLine}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, emailSubjectLine: e.target.value })}
              inputProps={{ className: 'py-10 text-13' }}
            />
            <Typography variant="body2" className={styles.emailTextFieldHelper}>
              Use {"{{document.name}}"} for document name, {"{{signer.name}}"} for recipient name
            </Typography>
          </div>
          <div className={styles.emailTextFieldHelperWrapper} >
            <TextField
              fullWidth
              variant="outlined"
              placeholder={"Hi {{signer.name}}, \nYou have been sent a document to review and sign. Please click the button below to get started. \nThank you!"}
              label="Email Message"
              hideBorder={true}
              name="emailMessage"
              value={state.emailMessage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, emailMessage: e.target.value })}
              inputProps={{ className: 'py-10 text-13' }}
              multiline
              rows={6}
            />
            <Typography variant="body2" className={styles.emailTextFieldHelper}>
              Available variables: {"{{signer.name}}"}, {"{{document.name}}"}, {"{{sender.name}}"}
            </Typography>
          </div>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={"Review & Sign"}
            label="Call-to-Action Button Text"
            hideBorder={true}
            name="ctaButtonText"
            value={state.ctaButtonText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, ctaButtonText: e.target.value })}
            inputProps={{ className: 'py-10 text-13' }}
          />
          <TextField
            fullWidth
            variant="outlined"
            placeholder={"This is a legally binding electronic signature request."}
            label="Footer Text"
            hideBorder={true}
            name="footerText"
            value={state.footerText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, footerText: e.target.value })}
            inputProps={{ className: 'py-10 text-13' }}
          />
        </div>}

        {state.activeTab === "preview" && <div className={styles.previewSegmentContentWrapper} >
          <Card className={styles.previewCard} >
            <div className={styles.previewHeaderBar} style={{ backgroundColor: state.accentColor || '#f97316' }} />
            <div className={styles.previewContent} >
              {state.logo && (
                <div className={styles.previewLogoWrapper}>
                  <img 
                    src={state.logo.thumbnail_url || state.logo.original_url || state.logo.url} 
                    alt="Company Logo" 
                    className={styles.previewLogo} 
                  />
                </div>
              )}
              
              <Typography className={styles.previewSubject}>
                {state.emailSubjectLine.replace('{{document.name}}', 'Sample Document').replace('{{signer.name}}', 'John Doe')}
              </Typography>
              
              <Typography className={styles.previewBody}>
                {state.emailMessage.replace('{{signer.name}}', 'John Doe').replace('{{document.name}}', 'Sample Document').replace('{{sender.name}}', 'Sender Name')}
              </Typography>
              
              <div className={styles.previewButtonWrapper}>
                <button 
                  className={styles.previewCtaButton}
                  style={{ backgroundColor: state.accentColor || '#f97316' }}
                >
                  {state.ctaButtonText}
                </button>
              </div>
              
              <Divider className={styles.previewDivider} />
              
              <div className={styles.previewFooter}>
                <Typography className={styles.footerText}>{state.footerText}</Typography>
                <Typography className={styles.copyrightText}>© 2025 . All rights reserved.</Typography>
              </div>
            </div>
          </Card>
        </div>}
      </div>
    </Dialog>
  )
}

export default brandingCustomization