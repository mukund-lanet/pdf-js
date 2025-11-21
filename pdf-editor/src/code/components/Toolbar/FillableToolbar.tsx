'use client';
import React from 'react';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import { useDispatch } from 'react-redux';

interface FillableToolbarProps {
  activeTool: string | null;
  isDraggable: boolean;
}

const FillableToolbar = ({ activeTool, isDraggable }: FillableToolbarProps) => {

  const dispatch = useDispatch();

  const fillableFields = [
    { type: 'signature', label: 'Signature', icon: 'pencil-line' },
    { type: 'text-field', label: 'Text Field', icon: 'type' },
    { type: 'date', label: 'Date', icon: 'calendar' },
    { type: 'initials', label: 'Initials', icon: 'pencil-line' },
    { type: 'checkbox', label: 'Checkbox', icon: 'check-square' },
  ];

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('application/pdf-editor', type);
    dispatch({ type: 'SET_ACTIVE_TOOL', payload: type });
  };

  return (
    <div className={styles.fillableToolbarWrapper}>
      {fillableFields.map((item) => (
        <div
          key={item.type}
          className={`${styles.elementCard} ${activeTool === item.type ? styles.activeElement : ''}`}
          draggable={isDraggable}
          onDragStart={(e: React.DragEvent) => handleDragStart(e, item.type)}
          onClick={() => dispatch({ type: 'SET_ACTIVE_TOOL', payload: item.type })}
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
