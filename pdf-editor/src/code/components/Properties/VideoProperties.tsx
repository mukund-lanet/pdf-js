import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { VideoElement } from '../../types';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import BoxModelControl from './BoxModelControl';
import SpacingControl from './SpacingControl';

interface VideoPropertiesProps {
  element: VideoElement;
}

const VideoProperties = ({ element }: VideoPropertiesProps) => {
  const dispatch = useDispatch();
  const [activeSide, setActiveSide] = useState<{ type: 'margin' | 'padding'; side: 'top' | 'right' | 'bottom' | 'left' } | null>(null);

  const updateElement = (updates: Partial<VideoElement>) => {
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
      <div className={styles.infoBox}>
        <Typography className={styles.infoBoxTitle}>Supported providers:</Typography>
        <Typography className={styles.infoBoxContent}>
          YouTube, Vimeo, Dailymotion, Wistia, Inc., Vidyard, loom
        </Typography>
      </div>

      <div className={styles.propertyGroup}>
        <Typography className={styles.propertyLabel}>Video URL</Typography>
        <input
          type="text"
          placeholder="Paste a video URL"
          value={element.videoUrl || ''}
          onChange={(e) => updateElement({ videoUrl: e.target.value })}
          className={styles.propertyInput}
        />
        <Typography className={styles.helperText}>
          Paste a video URL to embed it in your document. YouTube, Vimeo, Wistia and Vidyard are supported.
        </Typography>
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
        <Typography className={styles.propertyLabel}>Height</Typography>
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
        <Typography className={styles.propertyLabel}>Width</Typography>
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

export default VideoProperties;
