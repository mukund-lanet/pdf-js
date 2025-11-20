import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ImageElement } from '../../types';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import BoxModelControl from './BoxModelControl';
import SpacingControl from './SpacingControl';

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
        <Typography className={styles.propertyLabel}>Image URL</Typography>
        <div className={styles.colorInputWrapper}>
          <input
            type="text"
            placeholder="Please Input"
            value={element.imageData?.startsWith('data:') ? 'Base64 Image' : element.imageData || ''}
            readOnly
            className={styles.propertyInput}
          />
          <div className={styles.inputIconWrapper}>
            <CustomIcon iconName="image" width={20} height={20} />
          </div>
        </div>
      </div>

      <div className={styles.propertyGroup}>
        <Typography className={styles.propertyLabel}>Align</Typography>
        <div className={styles.buttonGroup}>
          {['left', 'center', 'right'].map((align) => (
            <button
              key={align}
              className={`${styles.buttonGroupButton} ${element.align === align ? styles.active : ''}`}
              onClick={() => updateElement({ align: align as any })}
            >
              {align.charAt(0).toUpperCase() + align.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.propertyGroup}>
        <Typography className={styles.propertyLabel}>Image effects</Typography>
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.buttonGroupButton} ${element.imageEffect !== 'grayscale' ? styles.active : ''}`}
            onClick={() => updateElement({ imageEffect: 'none' })}
          >
            Full color
          </button>
          <button
            className={`${styles.buttonGroupButton} ${element.imageEffect === 'grayscale' ? styles.active : ''}`}
            onClick={() => updateElement({ imageEffect: 'grayscale' })}
          >
            Black & White
          </button>
        </div>
      </div>

      <div className={styles.propertyGroup}>
        <Typography className={styles.propertyLabel}>Background color</Typography>
        <div className={styles.colorInputWrapper}>
          <input
            type="text"
            placeholder="Please Input"
            value={element.backgroundColor || ''}
            onChange={(e) => updateElement({ backgroundColor: e.target.value })}
            className={styles.propertyInput}
          />
          <div className={styles.colorPickerIcon}>
            <CustomIcon iconName="droplet" width={16} height={16} customColor="#fff" />
          </div>
        </div>
      </div>

      <div className={styles.propertyGroup}>
        <Typography className={styles.propertyLabel}>Height <span className={styles.requiredStar}>*</span></Typography>
        <div className={styles.inputWithUnit}>
          <input
            type="number"
            value={element.height}
            onChange={(e) => updateElement({ height: parseInt(e.target.value) || 0 })}
            className={styles.propertyInput}
          />
          <span className={styles.unitLabel}>px</span>
        </div>
      </div>

      <div className={styles.propertyGroup}>
        <Typography className={styles.propertyLabel}>Width <span className={styles.requiredStar}>*</span></Typography>
        <div className={styles.inputWithUnit}>
          <input
            type="number"
            value={element.width || ''}
            placeholder="Auto"
            onChange={(e) => updateElement({ width: parseInt(e.target.value) || undefined })}
            className={styles.propertyInput}
          />
          <span className={styles.unitLabel}>px</span>
        </div>
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
