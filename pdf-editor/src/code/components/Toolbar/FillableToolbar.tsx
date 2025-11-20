'use client';
import React from 'react';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';

interface FillableToolbarProps {
  activeTool: string | null;
  onDragStart: (type: string) => void;
}

const FillableToolbar = ({ activeTool, onDragStart }: FillableToolbarProps) => {
  const fillableFields = [
    { type: 'signature', label: 'Signature', icon: 'pencil-line' },
    { type: 'text-field', label: 'Text Field', icon: 'type' },
    { type: 'date', label: 'Date', icon: 'calendar' },
    { type: 'initials', label: 'Initials', icon: 'pencil-line' },
    { type: 'checkbox', label: 'Checkbox', icon: 'check-square' },
  ];

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('application/pdf-editor', type);
    onDragStart(type);
  };

  return (
    <div className={styles.fillableToolbarWrapper}>
      {fillableFields.map((item) => (
        <div
          key={item.type}
          className={`${styles.elementCard} ${activeTool === item.type ? styles.activeElement : ''}`}
          draggable
          onDragStart={(e: React.DragEvent) => handleDragStart(e, item.type)}
          onClick={() => onDragStart(item.type)}
        >
          <div className={styles.dragHandle}>
            <CustomIcon iconName="grip-horizontal" width={16} height={16} />
          </div>
          <div className={styles.elementIcon}>
            <CustomIcon iconName={item.icon} width={20} height={20} />
          </div>
          <Typography className={styles.elementLabel}>{item.label}</Typography>
        </div>
      ))}
    </div>
  );
};

export default FillableToolbar;
