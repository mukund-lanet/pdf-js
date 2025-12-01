import { useState } from 'react';
import Dialog from '@trenchaant/pkg-ui-component-library/build/Components/Dialog';
import Switch from '@trenchaant/pkg-ui-component-library/build/Components/Switch';
import Divider from '@trenchaant/pkg-ui-component-library/build/Components/Divider';
import Chip from '@trenchaant/pkg-ui-component-library/build/Components/Chip';
import Typography from '@trenchaant/pkg-ui-component-library/build/Components/Typography';
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Radio from '@trenchaant/pkg-ui-component-library/build/Components/Radio';
import RadioGroup from '@trenchaant/pkg-ui-component-library/build/Components/RadioGroup';
import Card from '@trenchaant/pkg-ui-component-library/build/Components/Card';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setDialogDrawerState, setIdentityVerificationSettings } from '../../store/action/contractManagement.actions';
import styles from "app/(after-login)/(with-header)/contract-management/contractManagement.module.scss";
import { radioGroupList, DIALOG_DRAWER_NAMES } from '../../types';

const IdentityVerification = () => {
  const dispatch = useDispatch();
  const dialogOpen = useSelector((state: RootState) => state?.contractManagement?.identityVerificationDialogOpen);
  const [identityState, setIdentityState] = useState({
    isVarifyOn: false,
    verificationMethod: "",
    isRequireAllSigners: false,
    isRequirePhone: false
  });

  const handleEmbededClose = () => {
    dispatch(setDialogDrawerState(DIALOG_DRAWER_NAMES.IDENTITY_VERIFICATION_DIALOG, false));
  };

  const handleSaveSettings = () => { 
    dispatch(setIdentityVerificationSettings(identityState));
    handleEmbededClose();
  };

  return (
    <Dialog
      open={dialogOpen}
      anchor={"right"}
      onClose={handleEmbededClose}
      icon="shield"
      iconColor="#2463eb"
      size="50%"
      label="Identity Verification"
      description="Add an extra layer of security by requiring signers to verify their identity"
      closeIcon
      submitBtn={{ onClick: () => handleSaveSettings(), label: 'Save Settings' }}
      cancelBtn={{ onClick: () => handleEmbededClose(), label: "Cancel" }}
    >
      <div className={styles.identityVarificationDialog}>
        <div className={styles.identityVarifyInitial}>
          <div className={styles.identityVarifyInitialText} >
            <Typography> Enable Identity Verification </Typography>
            <Typography> Require signers to verify their identity before signing </Typography>
          </div>
          <Switch
            size="small"
            checked={identityState.isVarifyOn}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIdentityState({...identityState, isVarifyOn: e.target.checked})}
            color="primary"
          />
        </div>
        { identityState.isVarifyOn && 
          <>
            <div className={styles.verificationMethodWrapper} >
              <Divider orientation="horizontal" className={styles.divider} />
              <Typography className={styles.verificationMethodTitle} > Verification Method </Typography>
              <RadioGroup row aria-label="Gender" name="Gender"
                value={identityState.verificationMethod}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIdentityState({...identityState, verificationMethod: e.target.value})}
              >
                <div className={styles.radioGroupWrapper} >
                  {radioGroupList.map(item => (
                    <Radio
                      key={item.value}
                      className={styles.smsVerificationRadio}
                      value={item.value}
                      size="small"
                      label={
                        <div className={styles.smsVerifyHeadSubtitileWrapper}>
                          <div className={styles.smsVerificationChipWrapper}>
                            <Typography fontWeight="500" >{item.title}</Typography>

                            {item.chip && (
                              <Chip
                                className={styles.chipBorder}
                                label={item.chip}
                                variant="default"
                              />
                            )}
                          </div>

                          <Typography>
                            {item.description}
                          </Typography>

                          {item.subDescription && (
                            <div className={styles.icnonSubtitileWrapper}>
                              {item.icon && (
                                <CustomIcon
                                  iconName={item.icon}
                                  height={12}
                                  width={12}
                                />
                              )}
                              <Typography>{item.subDescription}</Typography>
                            </div>
                          )}
                        </div>
                      }
                    />
                  ))}
                </div>
              </RadioGroup>
            </div>
            <Divider orientation="horizontal" className={styles.divider} />
            <div className={styles.identityVarifyDownWrapper} >
              <div className={styles.identityVarifyInitial}>
                <div className={styles.identityVarifyInitialText} >
                  <Typography> Require for all signers </Typography>
                  <Typography> All signers must complete identity verification </Typography>
                </div>
                <Switch
                  size="small"
                  checked={identityState.isRequireAllSigners}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIdentityState({...identityState, isRequireAllSigners: e.target.checked})}
                  color="primary"
                />
              </div>
              <div className={styles.identityVarifyInitial}>
                <div className={styles.identityVarifyInitialText} >
                  <Typography> Require phone number </Typography>
                  <Typography> Signers must provide phone number when signing </Typography>
                </div>
                <Switch
                  size="small"
                  checked={identityState.isRequirePhone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIdentityState({...identityState, isRequirePhone: e.target.checked})}
                  color="primary"
                />
              </div>
              <Card className={styles.enhancedSecurityWrapper} >
                <CustomIcon iconName="circle-check-big" height={20} width={20} customColor="#1d4ed8" />
                <div className={styles.enhancedSecurityTextWrapper} >
                  <Typography className={styles.titleText} > Enhanced Security </Typography>
                  <Typography className={styles.subtitleText} > Identity verification adds an extra layer of security and helps meet compliance requirements. Verification events are included in the certificate of completion. </Typography>
                </div>
              </Card>
            </div>
          </>
        }
      </div>
    </Dialog>
  );
};

export default IdentityVerification;