import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TableElement } from '../../types';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import BoxModelControl from './BoxModelControl';
import SpacingControl from './SpacingControl';
import DebouncedColorInput from './DebouncedColorInput';

interface TablePropertiesProps {
  element: TableElement;
}

const TableProperties = ({ element }: TablePropertiesProps) => {
  const dispatch = useDispatch();
  const [activeSide, setActiveSide] = useState<{ type: 'margin' | 'padding'; side: 'top' | 'right' | 'bottom' | 'left' } | null>(null);

  const updateElement = (updates: Partial<TableElement>) => {
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
        <DebouncedColorInput
          label="Background color"
          placeholder="Please enter background color"
          value={element.backgroundColor}
          onChange={(value) => updateElement({ backgroundColor: value })}
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

export default TableProperties;
