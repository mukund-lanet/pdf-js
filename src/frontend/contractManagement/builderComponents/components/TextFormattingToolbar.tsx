import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import Select from "@trenchaant/pkg-ui-component-library/build/Components/Select/SimpleSelect";
import MenuItem from "@trenchaant/pkg-ui-component-library/build/Components/MenuItem";
import Divider from '@trenchaant/pkg-ui-component-library/build/Components/Divider';
import { RootState } from '../../store/reducer/contractManagement.reducer';
import { HeadingElement, TableElement } from '../../utils/interface';
import ColorInput from './Properties/ColorInput';
import { fontSizeList, fontFamilyList, headingLevels } from '../../utils/utils';
import { UPDATE_CANVAS_ELEMENT } from '../../store/action/contractManagement.actions';

const TextFormattingToolbar: React.FC = () => {
  const dispatch = useDispatch();
  const activeElementId = useSelector((state: RootState) => state?.contractManagement?.activeElementId);
  const canvasElements = useSelector((state: RootState) => state?.contractManagement?.canvasElements);

  const activeElement = activeElementId ? canvasElements?.[activeElementId] : undefined;

  if (!activeElement || (activeElement.type !== 'heading' && activeElement.type !== 'table')) {
    return null;
  }

  const element = activeElement as HeadingElement | TableElement;

  const updateElement = (updates: Partial<HeadingElement | TableElement>) => {
    dispatch({
      type: UPDATE_CANVAS_ELEMENT,
      payload: { ...element, ...updates }
    });
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateElement({ fontSize: parseInt(e.target.value) });
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

  return (
    <div className={styles.textFormattingToolbarWrapper}>
      <div className={styles.textFormattingToolbar}>
        <Select
          value={element.fontFamily || 'Open Sans, sans-serif'}
          size="small"
          onChange={handleFontFamilyChange}
          className={styles.fontFamilySelect}
          classes={{ trigger: styles.triggerBtn }}
        >
          {fontFamilyList.map((font) => (
            <MenuItem key={font.name} value={font.value} style={{ fontFamily: font.value }}>
              {font.name}
            </MenuItem>
          ))}
        </Select>

        <Divider orientation="vertical" className={styles.toolbarDivider} />
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

        <Divider orientation="vertical" className={styles.toolbarDivider} />

        {element.type === 'heading' && (
          <>
            <Select
              value={element.tagName || 'h1'}
              size="small"
              onChange={handleHeadingLevelChange}
              className={styles.headingLevelSelect}
              classes={{ trigger: styles.triggerBtn }}
            >
              {headingLevels.map((level) => (
                <MenuItem key={level.value} value={level.value} className={styles[`headingOption-${level.value}`]}>
                  {level.label}
                </MenuItem>
              ))}
            </Select>
            <Divider orientation="vertical" className={styles.toolbarDivider} />
          </>
        )}

        <div className={styles.toolbarGroup}>
          <Button
            className={`${styles.toolbarBtn} ${element.fontWeight === 'bold' ? styles.active : ''}`}
            onClick={handleBoldToggle}
            title="Bold"
            variant="contained"
          >
            <CustomIcon iconName="bold" width={16} height={16} customColor="#000000" />
          </Button>
          <Button
            className={`${styles.toolbarBtn} ${element.fontStyle === 'italic' ? styles.active : ''}`}
            onClick={handleItalicToggle}
            title="Italic"
            variant="contained"
          >
            <CustomIcon iconName="italic" width={16} height={16} customColor="#000000" />
          </Button>
          <Button
            className={`${styles.toolbarBtn} ${element.textDecoration === 'underline' ? styles.active : ''}`}
            onClick={handleUnderlineToggle}
            title="Underline"
            variant="contained"
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
            variant="contained"
          >
            <CustomIcon iconName="align-left" width={16} height={16} customColor="#000000" />
          </Button>
          <Button
            className={`${styles.toolbarBtn} ${element.textAlign === 'center' ? styles.active : ''}`}
            onClick={() => handleAlignmentChange('center')}
            title="Align Center"
            variant="contained"
          >
            <CustomIcon iconName="align-center" width={16} height={16} customColor="#000000" />
          </Button>
          <Button
            className={`${styles.toolbarBtn} ${element.textAlign === 'right' ? styles.active : ''}`}
            onClick={() => handleAlignmentChange('right')}
            title="Align Right"
            variant="contained"
          >
            <CustomIcon iconName="align-right" width={16} height={16} customColor="#000000" />
          </Button>
        </div>

        <Divider orientation="vertical" className={styles.toolbarDivider} />

        <div className={styles.toolbarGroup}>
          <ColorInput
            value={element.color || '#000000'}
            onChange={(color) => updateElement({ color })}
          />
        </div>
      </div>
    </div>
  );
};

export default TextFormattingToolbar;
