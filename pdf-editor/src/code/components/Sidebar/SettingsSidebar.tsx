'use client';
import React, { useState } from 'react';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import Switch from "@trenchaant/pkg-ui-component-library/build/Components/Switch"

const SettingsSidebar = () => {
  const [overrideEmail, setOverrideEmail] = useState(false);
  const [enableRedirect, setEnableRedirect] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(false);

  return (
    <div className={styles.settingsSidebar}>
      <div className={styles.settingSection}>
        <div className={styles.switchRow}>
          <Switch
            checked={overrideEmail}
            onChange={(e: any) => setOverrideEmail(e.target.checked)}
            color='primary'
          />
          <Typography className={styles.settingLabel}>Override Email Configuration</Typography>
          <CustomIcon iconName="info" width={16} height={16} variant="gray" />
        </div>

        {overrideEmail && (
          <>
            <div className={styles.inputGroup}>
              <Typography className={styles.inputLabel}>From Name</Typography>
              <input type="text" placeholder="Please Input" className={styles.textInput} />
            </div>
            <div className={styles.inputGroup}>
              <Typography className={styles.inputLabel}>From Email</Typography>
              <input type="text" placeholder="Please Input" className={styles.textInput} />
            </div>
          </>
        )}

        <div className={styles.inputGroup}>
          <Typography className={styles.inputLabel}>Email Subject</Typography>
          <div className={styles.inputWithIcon}>
            <input type="text" defaultValue="{{location.name}} {{document.name}}" className={styles.textInput} />
            <div className={styles.inputIcon}>
              <CustomIcon iconName="tag" width={16} height={16} />
            </div>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <Typography className={styles.inputLabel}>Email Template</Typography>
          <select className={styles.selectInput}>
            <option>Default</option>
          </select>
        </div>
      </div>

      <Divider />

      <div className={styles.settingSection}>
        <div className={styles.switchRow}>
          <Switch
            checked={enableRedirect}
            onChange={(e: any) => setEnableRedirect(e.target.checked)}
            color='primary'
          />
          <Typography className={styles.settingLabel}>Enable redirection to custom URL</Typography>
        </div>

        {enableRedirect && (
          <div className={styles.redirectOptions}>
            <div className={styles.inputGroup}>
              <Typography className={styles.inputLabel}>Enter custom URL</Typography>
              <input
                type="text"
                placeholder="https://example.com"
                className={styles.textInput}
                value={redirectUrl}
                onChange={(e) => setRedirectUrl(e.target.value)}
              />
            </div>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="openTab"
                  checked={!openInNewTab}
                  onChange={() => setOpenInNewTab(false)}
                />
                Open in Existing Tab
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="openTab"
                  checked={openInNewTab}
                  onChange={() => setOpenInNewTab(true)}
                />
                Open in New Tab
              </label>
            </div>
          </div>
        )}
      </div>

      <Divider />

      <div className={styles.settingSection}>
        <div className={styles.sectionTitleRow}>
          <Typography className={styles.settingLabel}>Add Attachments</Typography>
          <CustomIcon iconName="info" width={16} height={16} variant="gray" />
        </div>
        <Button variant="outlined" className={styles.uploadButton} startIcon={<CustomIcon iconName="upload" width={16} height={16} />}>
          Upload
        </Button>
      </div>
    </div>
  );
};

const Divider = () => <div className={styles.divider} />;

export default SettingsSidebar;
