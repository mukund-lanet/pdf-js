import React from 'react';
import { TextElement } from './types';
import styles from 'app/(after-login)/(with-header)/pdf-editor/pdfEditor.module.scss';
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import Select from "@trenchaant/pkg-ui-component-library/build/Components/Select/SimpleSelect";
import MenuItem from "@trenchaant/pkg-ui-component-library/build/Components/MenuItem";
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import Divider from '@trenchaant/pkg-ui-component-library/build/Components/Divider';

interface TextPropertiesToolbarProps {
  element: TextElement;
  onUpdate: (element: TextElement) => void;
}

const TextPropertiesToolbar = ({ element, onUpdate }: TextPropertiesToolbarProps) => {
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({
      ...element,
      fontSize: parseInt(e.target.value)
    });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...element,
      color: e.target.value
    });
  };

  const handleBoldToggle = () => {
    onUpdate({
      ...element,
      fontWeight: element.fontWeight === 'bold' ? 'normal' : 'bold'
    });
  };

  const handleItalicToggle = () => {
    onUpdate({
      ...element,
      fontStyle: element.fontStyle === 'italic' ? 'normal' : 'italic'
    });
  };

  const handleUnderlineToggle = () => {
    onUpdate({
      ...element,
      textDecoration: element.textDecoration === 'underline' ? 'none' : 'underline'
    });
  };

  const handleAlignmentChange = (alignment: 'left' | 'center' | 'right') => {
    onUpdate({
      ...element,
      textAlign: alignment
    });
  };

  const fontSizeList = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48];

  return (
      <div 
        className={styles.textPropertiesToolbar}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        onMouseOver={(e) => e.stopPropagation()}
      >
        <div className={styles.toolbarGroup}>
          <Button
            className={`${styles.toolbarBtn} ${element.fontWeight === 'bold' ? styles.active : ''}`}
            onClick={handleBoldToggle}
            onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
            title="Bold"
          >
            <CustomIcon iconName="bold" width={16} height={16} customColor="#000000" />
          </Button>
          <Button
            className={`${styles.toolbarBtn} ${element.fontStyle === 'italic' ? styles.active : ''}`}
            onClick={handleItalicToggle}
            onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
            title="Italic"
          >
            <CustomIcon iconName="italic" width={16} height={16} customColor="#000000" />
          </Button>
          <Button
            className={`${styles.toolbarBtn} ${element.textDecoration === 'underline' ? styles.active : ''}`}
            onClick={handleUnderlineToggle}
            onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
            title="Underline"
          >
            <CustomIcon iconName="underline" width={16} height={16} customColor="#000000" />
          </Button>
        </div>

        <Divider orientation="vertical" className={styles.toolbarDivider} />

        <div className={styles.toolbarGroup}>
          <Button
            className={`${styles.toolbarBtn} ${element.textAlign === 'left' ? styles.active : ''}`}
            onClick={() => handleAlignmentChange('left')}
            onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
            title="Align Left"
          >
            <CustomIcon iconName="align-left" width={16} height={16} customColor="#000000" />
          </Button>
          <Button
            className={`${styles.toolbarBtn} ${element.textAlign === 'center' ? styles.active : ''}`}
            onClick={() => handleAlignmentChange('center')}
            onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
            title="Align Center"
          >
            <CustomIcon iconName="align-center" width={16} height={16} customColor="#000000" />
          </Button>
          <Button
            className={`${styles.toolbarBtn} ${element.textAlign === 'right' ? styles.active : ''}`}
            onClick={() => handleAlignmentChange('right')}
            onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
            title="Align Right"
          >
            <CustomIcon iconName="align-right" width={16} height={16} customColor="#000000" />
          </Button>
        </div>

        <Divider orientation="vertical" className={styles.toolbarDivider} />

        <div className={styles.toolbarGroup}>
          <Select
            value={element.fontSize || 12}
            // margin="dense"
            size="small"
            onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
            onChange={handleFontSizeChange}
            className={styles.fontSizeSelect}
            classes={{ trigger: styles.triggerBtn }}
          >
            {fontSizeList.map((size) => (
              <MenuItem key={size} value={size}>{size}</MenuItem>
            ))}
          </Select>
        </div>

        {/* <Divider orientation="vertical" className={styles.toolbarDivider} /> */}

        <div className={styles.toolbarGroup}>
          <input
            type="color"
            value={element.color || '#000000'}
            onChange={handleColorChange}
            onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
            className={styles.colorPicker}
            title="Text Color"
          />
        </div>
      </div>
  );
};

export default TextPropertiesToolbar;