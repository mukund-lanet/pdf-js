import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { HeadingElement } from '../../types';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Button from '@trenchaant/pkg-ui-component-library/build/Components/Button';
import TextField from "@trenchaant/pkg-ui-component-library/build/Components/TextField";
import InputAdornment from "@trenchaant/pkg-ui-component-library/build/Components/InputAdornment";
import BoxModelControl from './BoxModelControl';
import SpacingControl from './SpacingControl';

interface HeadingPropertiesProps {
  element: HeadingElement;
}

const HeadingProperties = ({ element }: HeadingPropertiesProps) => {
  const dispatch = useDispatch();
  const [activeSide, setActiveSide] = useState<{ type: 'margin' | 'padding'; side: 'top' | 'right' | 'bottom' | 'left' } | null>(null);

  const updateElement = (updates: Partial<HeadingElement>) => {
    dispatch({
      type: 'UPDATE_CANVAS_ELEMENT',
      payload: { ...element, ...updates }
    });
  };

  const handleSpacingChange = (value: number) => {
    if (!activeSide) return;

    const { type, side } = activeSide;
    const currentSpacing = element[type] || { top: 0, right: 0, bottom: 0, left: 0 };

    updateElement({
      [type]: {
        ...currentSpacing,
        [side]: value
      }
    });
  };

  const getActiveValue = () => {
    if (!activeSide) return 0;
    const { type, side } = activeSide;
    return element[type]?.[side] || 0;
  };

  return (
    <div className={styles.propertiesContentWrapper}>
      <div className={styles.propertyGroup}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={"Please enter heading font size"}
          label="Heading font size"
          required
          hideBorder={true}
          value={element.fontSize}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateElement({ fontSize: parseInt(event.target.value) || 32 })}
          inputProps={{ className: 'py-10 text-13' }}
          endAdornment={(
            <InputAdornment position="end" >
              <span className={styles.unitLabel}>px</span>
            </InputAdornment>
          )}
        />
      </div>

      <div className={styles.propertyGroup}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={"Please enter subtitle font size"}
          label="Subtitle font size"
          required
          hideBorder={true}
          value={element.subtitleFontSize}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateElement({ subtitleFontSize: parseInt(event.target.value) || 16 })}
          inputProps={{ className: 'py-10 text-13' }}
          endAdornment={(
            <InputAdornment position="end" >
              <span className={styles.unitLabel}>px</span>
            </InputAdornment>
          )}
        />
      </div>

      <div className={styles.propertyGroup}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={"Please enter subtitle color"}
          label="Subtitle color"
          hideBorder={true}
          value={element.subtitleColor}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateElement({ subtitleColor: event.target?.value })}
          inputProps={{ className: 'py-10 text-13' }}
          endAdornment={(
            <InputAdornment position="end" >
              <CustomIcon iconName='droplet' height={20} width={20} variant="grey" />
            </InputAdornment>
          )}
        />
      </div>

      <div className={styles.propertyGroup}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={"Please enter background color"}
          label="Background color"
          hideBorder={true}
          value={element.backgroundColor}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateElement({ backgroundColor: event.target?.value })}
          inputProps={{ className: 'py-10 text-13' }}
          endAdornment={(
            <InputAdornment position="end" >
              <CustomIcon iconName='droplet' height={20} width={20} variant="grey" />
            </InputAdornment>
          )}
        />
      </div>

      <BoxModelControl
        margin={element.margin}
        padding={element.padding}
        onSelectSide={(type, side) => setActiveSide({ type, side })}
        activeSide={activeSide}
      />

      {activeSide && (
        <SpacingControl
          label={`${activeSide.type} ${activeSide.side}`}
          value={getActiveValue()}
          onChange={handleSpacingChange}
          onReset={() => handleSpacingChange(0)}
        />
      )}
    </div>
  );
};

export default HeadingProperties;
