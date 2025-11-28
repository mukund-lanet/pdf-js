import { useState } from 'react';
import Dialog from '@trenchaant/pkg-ui-component-library/build/Components/Dialog';
import Switch from '@trenchaant/pkg-ui-component-library/build/Components/Switch';
import Typography from '@trenchaant/pkg-ui-component-library/build/Components/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setIdentityVerificationDialogOpen } from '../../store/action/contractManagement.actions';
import styles from "app/(after-login)/(with-header)/contract-management/contractManagement.module.scss";

const IdentityVerification = () => {
  const dispatch = useDispatch();
  const dialogOpen = useSelector((state: RootState) => state?.contractManagement?.identityVerificationDialogOpen);
  const [isVarifyOn, setIsVarifyOn] = useState<boolean>(false);

  const handleEmbededClose = () => {
    dispatch(setIdentityVerificationDialogOpen(false));
  };

  return (
    <Dialog
      open={dialogOpen}
      anchor={"right"}
      onClose={() => handleEmbededClose}
      icon="shield"
      iconColor="#344256"
      size="40%"
      label="Identity Verification"
      description="Add an extra layer of security by requiring signers to verify their identity"
      closeIcon
      hidefooter
      submitBtn={{
        onClick: () => handleEmbededClose,
        label: 'Close',
      }}
    >
      <div className={styles.identityVarificationDialog}>
        <div className={styles.identityVarifyInitial}>
          <div className={styles.identityVarifyInitialText} >
            <Typography> Enable Identity Verification </Typography>
            <Typography> Require signers to verify their identity before signing </Typography>
          </div>
          <Switch
            size="small"
            checked={isVarifyOn}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsVarifyOn(e.target.checked)}
            color="primary"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default IdentityVerification;