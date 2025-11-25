import React from 'react';
import { useDispatch } from 'react-redux';
import { FillableFieldElement } from '../../types';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import TextField from "@trenchaant/pkg-ui-component-library/build/Components/TextField";
import Checkbox from "@trenchaant/pkg-ui-component-library/build/Components/Checkbox";
import Select from "@trenchaant/pkg-ui-component-library/build/Components/Select/SimpleSelect";
import MenuItem from "@trenchaant/pkg-ui-component-library/build/Components/MenuItem";
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";

interface DatePropertiesProps {
  element: FillableFieldElement;
}

const DateProperties = ({ element }: DatePropertiesProps) => {
  const dispatch = useDispatch();

  const updateElement = (updates: Partial<FillableFieldElement>) => {
    dispatch({
      type: 'UPDATE_CANVAS_ELEMENT',
      payload: { ...element, ...updates }
    });
  };

  const mockUser = {
    name: 'John Doe',
    email: 'johndoe12@gmail.com',
    avatar: 'JD',
    role: 'Primary',
    type: 'Signer'
  };

  const dateFormats = [
    'YYYY-MM-DD',
    'MM/DD/YYYY',
    'DD/MM/YYYY',
    'DD-MMM-YYYY',
    'MMM DD, YYYY'
  ];

  return (
    <div className={styles.propertiesContentWrapper}>
      <div className={styles.propertyGroup}>
        <Typography className={styles.propertyLabel}>To be filled by</Typography>
        <Select
          fullWidth
          value={mockUser.name}
          onChange={() => { }}
          size="small"
        >
          <MenuItem value={mockUser.name}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className={styles.userAvatarSmall}>{mockUser.avatar}</div>
              <span>{mockUser.name}</span>
            </div>
          </MenuItem>
        </Select>
      </div>

      <div className={styles.userInfoCard}>
        <div className={styles.userAvatar}>{mockUser.avatar}</div>
        <div className={styles.userDetails}>
          <Typography className={styles.userName}>{mockUser.name}</Typography>
          <Typography className={styles.userEmail}>{mockUser.email}</Typography>
          <div className={styles.userBadges}>
            <span className={styles.badgePrimary}>{mockUser.role}</span>
            <span className={styles.badgeSigner}>{mockUser.type}</span>
          </div>
        </div>
      </div>

      <Typography className={styles.sectionHeader}>OPTIONS</Typography>

      <div className={styles.propertyGroup}>
        <Typography className={styles.propertyLabel}>Placeholder</Typography>
        <TextField
          fullWidth
          variant="outlined"
          hideBorder={true}
          value={element.placeholder || 'Select date'}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateElement({ placeholder: e.target.value })}
          inputProps={{ className: 'py-10 text-13' }}
        />
      </div>

      <div className={styles.propertyGroup}>
        <Typography className={styles.propertyLabel}>Date Formats</Typography>
        <Select
          fullWidth
          value={element.dateFormat || 'YYYY-MM-DD'}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateElement({ dateFormat: e.target.value })}
          size="small"
        >
          {dateFormats.map(format => (
            <MenuItem key={format} value={format}>{format}</MenuItem>
          ))}
        </Select>
      </div>

      <div className={styles.propertyGroup}>
        <Typography className={styles.propertyLabel}>Available Dates</Typography>
        <TextField
          fullWidth
          variant="outlined"
          hideBorder={true}
          value={element.availableDates || 'Any Date'}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateElement({ availableDates: e.target.value })}
          inputProps={{ className: 'py-10 text-13' }}
        />
      </div>

      <div className={styles.propertyGroup}>
        <Checkbox
          checked={element.required || false}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateElement({ required: e.target.checked })}
          label="Required"
        />
      </div>

      <Typography className={styles.sectionHeader}>LINKED FIELDS</Typography>

      <div className={styles.propertyGroup}>
        <Button
          fullWidth
          variant="text"
          className={styles.addCustomFieldsBtn}
        >
          Add custom fields
        </Button>
      </div>
    </div>
  );
};

export default DateProperties;
