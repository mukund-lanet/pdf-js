'use client';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/reducer/contractManagement.reducer';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import Avatar from "@trenchaant/pkg-ui-component-library/build/Components/Avatar";
import Switch from "@trenchaant/pkg-ui-component-library/build/Components/Switch";
import TextField from "@trenchaant/pkg-ui-component-library/build/Components/TextField";
import IconButton from "@trenchaant/pkg-ui-component-library/build/Components/IconButton";
import { UPDATE_DOCUMENT } from '../../../store/action/contractManagement.actions';
import { Signer } from '../../../utils/interface';

const RecipientsSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const activeDocument = useSelector((state: RootState) => state?.contractManagement?.activeDocument);
  const [isAddingRecipient, setIsAddingRecipient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSigningOrderChange = (checked: boolean) => {
    if (activeDocument) {
      dispatch({
        type: UPDATE_DOCUMENT,
        payload: {
          ...activeDocument,
          documentId: activeDocument.id,
          documentName: activeDocument.name,
          signers: activeDocument.signers,
          signingOrder: checked
        }
      });
    }
  };

  const handleDeleteSigner = (index: number) => {
    if (activeDocument) {
      const newSigners = [...activeDocument.signers];
      newSigners.splice(index, 1);
      dispatch({
        type: UPDATE_DOCUMENT,
        payload: {
          ...activeDocument,
          documentId: activeDocument.id,
          documentName: activeDocument.name,
          signers: newSigners,
          signingOrder: activeDocument.signingOrder
        }
      });
    }
  };

  return (
    <div className={styles.recipientsSidebar}>
      <div className={styles.sidebarHeader}>
        <Typography variant="h6" className={styles.sidebarTitle}>Recipients</Typography>
      </div>

      <div className={styles.sidebarContent}>
        <div className={styles.signingOrderSection}>
          <div className={styles.signingOrderHeader}>
            <Switch 
              checked={activeDocument?.signingOrder || false} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSigningOrderChange(e.target.checked)}
            />
            <Typography className={styles.signingOrderLabel}>Set signing order</Typography>
          </div>
          <Typography variant="caption" className={styles.signingOrderDescription}>
            Emails are sent sequentially: Next recipient can sign only after the previous one completes their action.
          </Typography>
        </div>

        <div className={styles.recipientsList}>
          {activeDocument?.signers?.map((signer: Signer, index: number) => (
            <div key={index} className={styles.recipientItem}>
              <div className={styles.recipientAvatar}>
                <Avatar>{signer.name.charAt(0).toUpperCase()}</Avatar>
              </div>
              <div className={styles.recipientInfo}>
                <Typography className={styles.recipientName}>{signer.name}</Typography>
                <Typography className={styles.recipientEmail}>{signer.email}</Typography>
                <div className={styles.recipientBadges}>
                  <span className={styles.badgePrimary}>Primary</span>
                  <span className={styles.badgeSigner}>{signer.type}</span>
                </div>
              </div>
              <div className={styles.recipientActions}>
                <IconButton size="small">
                  <CustomIcon iconName="edit-2" height={14} width={14} />
                </IconButton>
                <IconButton size="small" onClick={() => handleDeleteSigner(index)}>
                  <CustomIcon iconName="trash-2" height={14} width={14} />
                </IconButton>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.addRecipientSection}>
            {isAddingRecipient ? (
                <div className={styles.addRecipientForm}>
                    <TextField 
                        placeholder="Search client" 
                        fullWidth 
                        value={searchTerm}
                        onChange={(e: any) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <CustomIcon iconName="search" height={16} width={16} variant="gray" />
                        }}
                    />
                    <div className={styles.addClientLink}>
                        <Typography variant="caption">LIST OF ALL CLIENTS</Typography>
                        <Button variant="text" size="small" color="primary">Add New Client</Button>
                    </div>
                    {/* Mock List */}
                    <div className={styles.clientList}>
                         <div className={styles.clientItem}>
                            <Avatar className={styles.clientAvatar}>RM</Avatar>
                            <div className={styles.clientInfo}>
                                <Typography className={styles.clientName}>Rakholiya Mukund</Typography>
                                <Typography className={styles.clientEmail}>mukurakholiya119@gmail.com</Typography>
                            </div>
                         </div>
                    </div>
                     <Button variant="outlined" fullWidth onClick={() => setIsAddingRecipient(false)}>Cancel</Button>
                </div>
            ) : (
                <Button 
                    variant="outlined" 
                    fullWidth 
                    startIcon={<CustomIcon iconName="plus" height={16} width={16} />}
                    onClick={() => setIsAddingRecipient(true)}
                >
                    Add More Recipients
                </Button>
            )}
        </div>
      </div>
    </div>
  );
};

export default RecipientsSidebar;
