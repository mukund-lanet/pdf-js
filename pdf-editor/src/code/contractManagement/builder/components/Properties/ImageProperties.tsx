import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ImageElement } from '../../types';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Button from '@trenchaant/pkg-ui-component-library/build/Components/Button';
import TextField from "@trenchaant/pkg-ui-component-library/build/Components/TextField";
import InputAdornment from "@trenchaant/pkg-ui-component-library/build/Components/InputAdornment";
import BoxModelControl from './BoxModelControl';
import SpacingControl from './SpacingControl';
import ColorInput from './ColorInput';

interface ImagePropertiesProps {
  element: ImageElement;
}

const ImageProperties = ({ element }: ImagePropertiesProps) => {
  const dispatch = useDispatch();
  const [activeSide, setActiveSide] = useState<{ type: 'margin' | 'padding'; side: 'top' | 'right' | 'bottom' | 'left' } | null>(null);

  const updateElement = (updates: Partial<ImageElement>) => {
    dispatch({
      type: 'UPDATE_CANVAS_ELEMENT',
      payload: { ...element, ...updates }
    });
  };

  const handleSpacingChange = (value: number) => {
    if (!activeSide) return;
    const { type, side } = activeSide;
    const currentSpacing = element[type] || { top: 0, right: 0, bottom: 0, left: 0 };
    updateElement({ [type]: { ...currentSpacing, [side]: value } });
  };

  const getActiveValue = () => activeSide ? element[activeSide.type]?.[activeSide.side] || 0 : 0;

  return (
    <div className={styles.propertiesContentWrapper}>
      <div className={styles.propertyGroup}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={"Please enter image url"}
          label="Image URL"
          hideBorder={true}
          value={element.imageUrl}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateElement({ imageUrl: event.target?.value })}
          inputProps={{ className: 'py-10 text-13' }}
          endAdornment={(
            <InputAdornment position="end" >
              <CustomIcon iconName='image' height={20} width={20} variant="grey" />
            </InputAdornment>
          )}
        />
      </div>

      <div className={styles.propertyGroup}>
        <Typography className={styles.propertyLabel}>Align</Typography>
        <div className={styles.buttonGroup}>
          {['left', 'center', 'right'].map((align) => (
            <Button
              key={align}
              className={`${styles.buttonGroupButton} ${element.align === align ? styles.active : ''}`}
              onClick={() => updateElement({ align: align as any })}
            >
              {align.charAt(0).toUpperCase() + align.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className={styles.propertyGroup}>
        <Typography className={styles.propertyLabel}>Image effects</Typography>
        <div className={styles.buttonGroup}>
          <Button
            className={`${styles.buttonGroupButton} ${element.imageEffect !== 'grayscale' ? styles.active : ''}`}
            onClick={() => updateElement({ imageEffect: 'none' })}
          >
            Full color
          </Button>
          <Button
            className={`${styles.buttonGroupButton} ${element.imageEffect === 'grayscale' ? styles.active : ''}`}
            onClick={() => updateElement({ imageEffect: 'grayscale' })}
          >
            Black & White
          </Button>
        </div>
      </div>

      <div className={styles.propertyGroup}>
        <TextField
          fullWidth
          variant="outlined"
          label="Background color"
          placeholder="Enter background color"
          hideBorder={true}
          value={element.backgroundColor || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateElement({ backgroundColor: e.target.value })}
          inputProps={{ className: 'py-10 text-13' }}
          endAdornment={(
            <InputAdornment position="end">
              <ColorInput
                value={element.backgroundColor}
                onChange={(backgroundColor) => updateElement({ backgroundColor })}
                iconName="droplet"
              />
            </InputAdornment>
          )}
        />
      </div>

      <div className={styles.propertyGroup}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={"Please enter height"}
          label="Height"
          hideBorder={true}
          value={element.height}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateElement({ height: parseInt(event.target?.value) || 0 })}
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
          placeholder={"Please enter width"}
          label="Width"
          hideBorder={true}
          value={element.width}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateElement({ width: parseInt(event.target?.value) || 0 })}
          inputProps={{ className: 'py-10 text-13' }}
          endAdornment={(
            <InputAdornment position="end" >
              <span className={styles.unitLabel}>px</span>
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

export default ImageProperties;
