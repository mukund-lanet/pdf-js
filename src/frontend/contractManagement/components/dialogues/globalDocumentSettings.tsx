import React from 'react';
import styles from "app/(after-login)/(with-header)/contract-management/contractManagement.module.scss";
import Card from '@trenchaant/pkg-ui-component-library/build/Components/Card';
import Dialog from '@trenchaant/pkg-ui-component-library/build/Components/Dialog';
import Switch from '@trenchaant/pkg-ui-component-library/build/Components/Switch';
import Divider from '@trenchaant/pkg-ui-component-library/build/Components/Divider';
import TextField from '@trenchaant/pkg-ui-component-library/build/Components/TextField';
import Button from '@trenchaant/pkg-ui-component-library/build/Components/Button';
import Typography from '@trenchaant/pkg-ui-component-library/build/Components/Typography';
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Select from '@trenchaant/pkg-ui-component-library/build/Components/Select/SimpleSelect';
import ScrollBar from "@trenchaant/pkg-ui-component-library/build/Components/ScrollBar";
import MenuItem from '@trenchaant/pkg-ui-component-library/build/Components/MenuItem';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setDialogDrawerState } from '../../store/action/contractManagement.actions';
import { DIALOG_DRAWER_NAMES } from '../../utils/interface';
import { defaultEmailTemplate } from '../../utils/utils';

const GlobalDocumentSettings = () => {
  const dispatch = useDispatch();
  const dialogOpen = useSelector((state: RootState) => state?.contractManagement?.globalDocumentSettingsDialogOpen);

  const [values, setValues] = React.useState({
    senderName: '',
    senderEmail: '',
    emailSubject: '',
    emailTemplate: 'default',
    redirectDateNotification: false,
    dueDateNotification: false,
    completionNotification: false,
    reminderNotification: false,
    daysBeforeDueDate: 3,
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddVariable = (variable: string) => {
    setValues((prev) => ({
      ...prev,
      emailSubject: prev.emailSubject + ` ${variable} `
    }));
  };

  const handleEmbededClose = () => {
    dispatch(setDialogDrawerState(DIALOG_DRAWER_NAMES.GLOBAL_DOCUMENT_SETTINGS_DIALOG, false));
  };

  const handleSaveSettings = () => {
    dispatch(setDialogDrawerState(DIALOG_DRAWER_NAMES.GLOBAL_DOCUMENT_SETTINGS_DIALOG, false));
  };
  
  return (
    <Dialog
      open={dialogOpen}
      anchor={"right"}
      onClose={handleEmbededClose}
      icon="settings"
      iconColor="#2463eb"
      size="60%"
      label="Global Document Settings"
      closeIcon
      submitBtn={{ onClick: () => handleSaveSettings(), label: 'Save Settings' }}
      cancelBtn={{ onClick: () => handleEmbededClose(), label: "Cancel" }}
    >
      <ScrollBar className={styles.scrollBarWrapper} >
        <div className={styles.globalDocumentSettingsDialog} >
          <Card className={styles.defaultEmailConfigCardWrapper} >
            <div className={styles.defaultEmailHeader} >
              <CustomIcon iconName="mail" height={20} width={20} />
              <Typography className={styles.outerHeaderText} > Default Email Configuration </Typography>
            </div>
            <div className={styles.defaultEmailConfigTextField} >
              <TextField
                fullWidth
                variant="outlined"
                placeholder={"Your Company Name"}
                label={"Default Sender Name"}
                hideBorder={true}
                name="senderName"
                value={values.senderName}
                onChange={handleChange}
              />
              <Typography className={styles.textFieldSubDescription} > This name will appear as the sender for all document emails </Typography>
            </div>
            <div className={styles.defaultEmailConfigTextField} >
              <TextField
                fullWidth
                variant="outlined"
                placeholder={"documents@yourcompany.com"}
                label={"Default Sender Email"}
                hideBorder={true}
                name="senderEmail"
                value={values.senderEmail}
                onChange={handleChange}
              />
              <Typography className={styles.textFieldSubDescription} > This email address will be used as the sender for all documents </Typography>
            </div>

            <Divider orientation="horizontal" className={styles.divider} />

            <div className={styles.defaultEmailConfigTextField} >
              <TextField
                fullWidth
                variant="outlined"
                placeholder={"Please sign {document_name}"}
                label={"Default Email Subject"}
                hideBorder={true}
                name="emailSubject"
                value={values.emailSubject}
                onChange={handleChange}
              />
              <div className={styles.emailSubjectButtonsWrapper} >
                <Button 
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleAddVariable('{{document_name}}')}
                >
                  <CustomIcon iconName="plus" width={16} height={16} /> 
                  <Typography>Document name</Typography>
                </Button>
                <Button 
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleAddVariable('{{signer_name}}')}
                >
                  <CustomIcon iconName="plus" width={16} height={16} /> 
                  <Typography>Signer name</Typography>
                </Button>
                <Button 
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleAddVariable('{{company_name}}')}
                  >
                  <CustomIcon iconName="plus" width={16} height={16} /> 
                  <Typography>Company name</Typography>
                </Button>
              </div>
            </div>
            <Select
              label="Default Email Template"
              value={values.emailTemplate}
              margin="dense"
              size="small"
              name="emailTemplate"
              onChange={handleChange}
            >
              {
                defaultEmailTemplate.map((item) => (
                  <MenuItem key={item.key} value={item.value}>
                    {item.value}
                  </MenuItem>
                ))
              }
            </Select>
          </Card>

          <div className={styles.redirectDateNotificationWrapper} >
            <Card className={styles.innerCardWrapper} >
              <div className={styles.innerCardHeader} >
                <CustomIcon iconName="external-link" width={20} height={20} />
                <Typography className={styles.outerHeaderText} > Default Redirect Configuration </Typography>
              </div>
              <div className={styles.innerCardContent} >
                <div className={styles.innerCardContentText} >
                  <Typography className={styles.headerText} > Enable default redirection </Typography>
                  <Typography> Redirect signers to a custom URL after signing </Typography>
                </div>
                <Switch
                  color="primary"
                  checked={values.redirectDateNotification}
                  onChange={handleChange}
                  name="redirectDateNotification"
                />
              </div>
            </Card>
            <Card className={styles.innerCardWrapper} >
              <div className={styles.innerCardHeader} >
                <CustomIcon iconName="calendar" width={20} height={20} />
                <Typography className={styles.outerHeaderText} > Default Due Date Configuration </Typography>
              </div>
              <div className={styles.innerCardContent} >
                <div className={styles.innerCardContentText} >
                  <Typography className={styles.headerText} > Enable default due date </Typography>
                  <Typography> Automatically set a due date for all new documents </Typography>
                </div>
                <Switch
                  color="primary"
                  checked={values.dueDateNotification}
                  onChange={handleChange}
                  name="dueDateNotification"
                />
              </div>
            </Card>
            <Card className={styles.innerCardWrapper} >
              <div className={styles.innerCardHeader} >
                <CustomIcon iconName="mail" width={20} height={20} />
                <Typography className={styles.outerHeaderText} > Notification Settings </Typography>
              </div>
              <div className={styles.innerCardContent} >
                <div className={styles.innerCardContentText} >
                  <Typography className={styles.headerText} > Send completion notifications </Typography>
                  <Typography> Notify you when documents are signed </Typography>
                </div>
                <Switch
                  color="primary"
                  checked={values.completionNotification}
                  onChange={handleChange}
                  name="completionNotification"
                />
              </div>

              <Divider orientation="horizontal" className={styles.divider} />
              
              <div className={styles.innerCardContent} >
                <div className={styles.innerCardContentText} >
                  <Typography className={styles.headerText} > Send reminder notifications </Typography>
                  <Typography> Send reminders to signers before due date </Typography>
                </div>
                <Switch
                  color="primary"
                  checked={values.reminderNotification}
                  onChange={handleChange}
                  name="reminderNotification"
                />
              </div>


              <div className={styles.defaultEmailConfigTextField} >
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder={"Your Company Name"}
                  label={"Days before due date"}
                  hideBorder={true}
                  name="daysBeforeDueDate"
                  value={values.daysBeforeDueDate}
                  onChange={handleChange}
                />
                <Typography className={styles.textFieldSubDescription} > Send reminders this many days before the due date </Typography>
              </div>
            </Card>
          </div>
        </div>
      </ScrollBar>
    </Dialog>
  )
}

export default GlobalDocumentSettings;