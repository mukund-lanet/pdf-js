import React, { useState, useEffect, useRef } from 'react';
import TextField from "@trenchaant/pkg-ui-component-library/build/Components/TextField";
import InputAdornment from "@trenchaant/pkg-ui-component-library/build/Components/InputAdornment";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';

interface DebouncedColorInputProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const DebouncedColorInput = ({ label, value, onChange, placeholder }: DebouncedColorInputProps) => {
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
    }, 100); // 100ms debounce for smoother feel but still optimized
  };

  return (
    <TextField
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
          <div style={{ position: 'relative', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CustomIcon iconName='droplet' height={20} width={20} variant="grey" />
            <input
              type="color"
              value={localValue.length === 7 ? localValue : '#000000'} // Ensure valid hex for color input
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
        </InputAdornment>
      )}
    />
  );
};

export default DebouncedColorInput;
