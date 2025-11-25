import React, { useState, useEffect, useRef } from 'react';
import TextField from "@trenchaant/pkg-ui-component-library/build/Components/TextField";
import InputAdornment from "@trenchaant/pkg-ui-component-library/build/Components/InputAdornment";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';

interface DebouncedColorInputProps {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isOnlyColor?: boolean;
}

const DebouncedColorInput = ({ label, value, onChange, placeholder, isOnlyColor = false }: DebouncedColorInputProps) => {
  const [localValue, setLocalValue] = useState(value || '#ffffff');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value);
    }
  }, [value]);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
    }, 100);
  };

  const ColorPicker = () => {
    return (
      <div style={{ position: 'relative', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CustomIcon iconName={isOnlyColor ? "baseline" : "droplet"} height={24} width={24} customColor={localValue || '#000000'} />
        <input
          type="color"
          value={localValue.length === 7 ? localValue : '#000000'}
          onChange={(e) => handleChange(e.target.value)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
            padding: 0,
            border: 'none'
          }}
        />
      </div>
    )
  }

  return (
    <>
      {isOnlyColor
        ? <ColorPicker />
        : <TextField
          fullWidth
          variant="outlined"
          placeholder={placeholder}
          label={label}
          hideBorder={true}
          value={localValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
          inputProps={{ className: 'py-10 text-13' }}
          endAdornment={(
            <InputAdornment position="end">
              <ColorPicker />
            </InputAdornment>
          )}
        />}
    </>
  );
};

export default DebouncedColorInput;
