import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { HeadingElement } from '../../types';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
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
        <Typography className={styles.propertyLabel}>Heading Font Size</Typography>
        <div className={styles.inputWithUnit}>
          <input
            type="number"
            value={element.fontSize || 32}
            onChange={(e) => updateElement({ fontSize: parseInt(e.target.value) || 32 })}
            className={styles.propertyInput}
          />
          <span className={styles.unitLabel}>px</span>
        </div>
      </div>

      <div className={styles.propertyGroup}>
        <Typography className={styles.propertyLabel}>Subtitle Font Size</Typography>
        <div className={styles.inputWithUnit}>
          <input
            type="number"
            value={element.subtitleFontSize || 16}
            onChange={(e) => updateElement({ subtitleFontSize: parseInt(e.target.value) || 16 })}
            className={styles.propertyInput}
          />
          <span className={styles.unitLabel}>px</span>
        </div>
      </div>

      <div className={styles.propertyGroup}>
        <Typography className={styles.propertyLabel}>Subtitle Color</Typography>
        <div className={styles.colorInputWrapper}>
          <input
            type="text"
            placeholder="#374151"
            value={element.subtitleColor || ''}
            onChange={(e) => updateElement({ subtitleColor: e.target.value })}
            className={styles.propertyInput}
          />
          <div className={styles.colorPickerIcon} style={{ background: element.subtitleColor || '#374151' }}>
            <CustomIcon iconName="droplet" width={16} height={16} customColor="#fff" />
          </div>
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
