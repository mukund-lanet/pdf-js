import React, { useState, useEffect } from 'react';
import ColorPickerComponent from '@trenchaant/pkg-ui-component-library/build/Components/ColorPickerComponent';
import styles from "app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss"

interface ColorInputProps {
  value?: string;
  onChange: (value: string) => void;
}

const ColorInput: React.FC<ColorInputProps> = ({ value, onChange }) => {
  const [localValue, setLocalValue] = useState(value || '#ffffff');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  // yync the localValue when value prop changes
  useEffect(() => {
    if (value !== undefined && value !== localValue) {
      setLocalValue(value);
    }
  }, [value]);

  const handleOpenColorPicker = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseColorPicker = () => {
    setAnchorEl(null);
  };

  const handleColorChange = (color: string) => {
    setLocalValue(color);
    onChange(color);
  };

  return (
    <>
      <div
        className={styles.colorPickerIcon}
        onClick={handleOpenColorPicker}
      >
        <span className={styles.colorViewer} style={{ backgroundColor: localValue }}></span>
      </div>
      {anchorEl && (
        <div onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
          <ColorPickerComponent
            showDialog={true}
            closeDialogAction={() => handleCloseColorPicker()}
            handleColorChange={(color: string) => handleColorChange(color)}
            defaultHexCode={localValue}
            anchorEl={anchorEl}
            mode="popper"
          />
        </div>
      )}
    </>
  );
};

export default ColorInput;

