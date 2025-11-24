import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import Select from "@trenchaant/pkg-ui-component-library/build/Components/Select/SimpleSelect";
import MenuItem from "@trenchaant/pkg-ui-component-library/build/Components/MenuItem";
import Divider from '@trenchaant/pkg-ui-component-library/build/Components/Divider';
import { RootState } from '../../store/reducer/pdfEditor.reducer';
import { HeadingElement, TableElement } from '../../types';

const TextFormattingToolbar = () => {
  const dispatch = useDispatch();
  const activeElementId = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.activeElementId);
  const canvasElements = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.canvasElements);

  const activeElement = canvasElements?.find(el => el.id === activeElementId);

  // Only show for heading and table elements
  if (!activeElement || (activeElement.type !== 'heading' && activeElement.type !== 'table')) {
    return null;
  }

  const element = activeElement as HeadingElement | TableElement;

  const updateElement = (updates: Partial<HeadingElement | TableElement>) => {
    dispatch({
      type: 'UPDATE_CANVAS_ELEMENT',
      payload: { ...element, ...updates }
    });
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateElement({ fontSize: parseInt(e.target.value) });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateElement({ color: e.target.value });
  };

  const handleBoldToggle = () => {
    updateElement({
      fontWeight: element.fontWeight === 'bold' ? 'normal' : 'bold'
    });
  };

  const handleItalicToggle = () => {
    updateElement({
      fontStyle: element.fontStyle === 'italic' ? 'normal' : 'italic'
    });
  };

  const handleUnderlineToggle = () => {
    updateElement({
      textDecoration: element.textDecoration === 'underline' ? 'none' : 'underline'
    });
  };

  const handleAlignmentChange = (alignment: 'left' | 'center' | 'right') => {
    updateElement({ textAlign: alignment });
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateElement({ fontFamily: e.target.value });
  };

  const handleHeadingLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tagName = e.target.value as any;
    const updates: any = { tagName };

    // Apply presets based on heading level
    switch (tagName) {
      case 'h1': updates.fontSize = 32; updates.fontWeight = '700'; break;
      case 'h2': updates.fontSize = 24; updates.fontWeight = '700'; break;
      case 'h3': updates.fontSize = 20; updates.fontWeight = '600'; break;
      case 'h4': updates.fontSize = 16; updates.fontWeight = '600'; break;
      case 'h5': updates.fontSize = 14; updates.fontWeight = '600'; break;
      case 'p': updates.fontSize = 16; updates.fontWeight = '400'; break;
    }

    updateElement(updates);
  };

  const fontSizeList = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48];

  const fontFamilyList = [
    { name: 'Open Sans', value: 'Open Sans, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Noto Sans JP', value: '"Noto Sans JP", sans-serif' },
    { name: 'Poppins', value: 'Poppins, sans-serif' },
    { name: 'Roboto Condensed', value: '"Roboto Condensed", sans-serif' },
    { name: 'Inter', value: 'Inter, sans-serif' },
  ];

  const headingLevels = [
    { label: 'Heading 1', value: 'h1' },
    { label: 'Heading 2', value: 'h2' },
    { label: 'Heading 3', value: 'h3' },
    { label: 'Heading 4', value: 'h4' },
    { label: 'Heading 5', value: 'h5' },
    { label: 'Paragraph', value: 'p' },
  ];

  return (
    <div className={styles.textFormattingToolbarWrapper}>
      <div className={styles.textFormattingToolbar}>

        {/* Font Family */}
        <div className={styles.toolbarGroup}>
          <Select
            value={element.fontFamily || 'Open Sans, sans-serif'}
            size="small"
            onChange={handleFontFamilyChange}
            className={styles.fontFamilySelect}
            classes={{ trigger: styles.triggerBtn }}
            style={{ width: 140 }}
          >
            {fontFamilyList.map((font) => (
              <MenuItem key={font.name} value={font.value} style={{ fontFamily: font.value }}>
                {font.name}
              </MenuItem>
            ))}
          </Select>
        </div>

        <Divider orientation="vertical" className={styles.toolbarDivider} />

        {/* Font Size */}
        <div className={styles.toolbarGroup}>
          <Select
            value={element.fontSize || (element.type === 'heading' ? 32 : 14)}
            size="small"
            onChange={handleFontSizeChange}
            className={styles.fontSizeSelect}
            classes={{ trigger: styles.triggerBtn }}
          >
            {fontSizeList.map((size) => (
              <MenuItem key={size} value={size}>{size}px</MenuItem>
            ))}
          </Select>
        </div>

        <Divider orientation="vertical" className={styles.toolbarDivider} />

        {/* Heading Level (Only for Headings) */}
        {element.type === 'heading' && (
          <>
            <div className={styles.toolbarGroup}>
              <Select
                value={element.tagName || 'h1'}
                size="small"
                onChange={handleHeadingLevelChange}
                className={styles.headingLevelSelect}
                classes={{ trigger: styles.triggerBtn }}
                style={{ width: 120 }}
              >
                {headingLevels.map((level) => (
                  <MenuItem key={level.value} value={level.value} className={styles[`headingOption-${level.value}`]}>
                    {level.label}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <Divider orientation="vertical" className={styles.toolbarDivider} />
          </>
        )}

        {/* Bold, Italic, Underline */}
        <div className={styles.toolbarGroup}>
          <Button
            className={`${styles.toolbarBtn} ${element.fontWeight === 'bold' ? styles.active : ''}`}
            onClick={handleBoldToggle}
            title="Bold"
          >
            <CustomIcon iconName="bold" width={16} height={16} customColor="#000000" />
          </Button>
          <Button
            className={`${styles.toolbarBtn} ${element.fontStyle === 'italic' ? styles.active : ''}`}
            onClick={handleItalicToggle}
            title="Italic"
          >
            <CustomIcon iconName="italic" width={16} height={16} customColor="#000000" />
          </Button>
          <Button
            className={`${styles.toolbarBtn} ${element.textDecoration === 'underline' ? styles.active : ''}`}
            onClick={handleUnderlineToggle}
            title="Underline"
          >
            <CustomIcon iconName="underline" width={16} height={16} customColor="#000000" />
          </Button>
        </div>

        <Divider orientation="vertical" className={styles.toolbarDivider} />

        {/* Text Alignment */}
        <div className={styles.toolbarGroup}>
          <Button
            className={`${styles.toolbarBtn} ${element.textAlign === 'left' ? styles.active : ''}`}
            onClick={() => handleAlignmentChange('left')}
            title="Align Left"
          >
            <CustomIcon iconName="align-left" width={16} height={16} customColor="#000000" />
          </Button>
          <Button
            className={`${styles.toolbarBtn} ${element.textAlign === 'center' ? styles.active : ''}`}
            onClick={() => handleAlignmentChange('center')}
            title="Align Center"
          >
            <CustomIcon iconName="align-center" width={16} height={16} customColor="#000000" />
          </Button>
          <Button
            className={`${styles.toolbarBtn} ${element.textAlign === 'right' ? styles.active : ''}`}
            onClick={() => handleAlignmentChange('right')}
            title="Align Right"
          >
            <CustomIcon iconName="align-right" width={16} height={16} customColor="#000000" />
          </Button>
        </div>

        <Divider orientation="vertical" className={styles.toolbarDivider} />

        {/* Text Color */}
        <div className={styles.toolbarGroup}>
          <input
            type="color"
            value={element.color || '#000000'}
            onChange={handleColorChange}
            className={styles.colorPicker}
            title="Text Color"
          />
        </div>
      </div>
    </div>
  );
};

export default TextFormattingToolbar;
