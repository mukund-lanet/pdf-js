'use client';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import { useDispatch } from 'react-redux';

interface BlockToolbarProps {
  activeTool: string | null;
  isDraggable: boolean;
}

const BlockToolbar = ({ activeTool, isDraggable }: BlockToolbarProps) => {

  const dispatch = useDispatch();

  const blocks = [
    { type: 'heading', label: 'Heading', icon: 'type' },
    { type: 'image', label: 'Image', icon: 'image' },
    { type: 'video', label: 'Video', icon: 'video' },
    { type: 'table', label: 'Table', icon: 'table' },
  ];

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('application/pdf-editor', type);
    dispatch({ type: 'SET_ACTIVE_TOOL', payload: type });
  };

  return (
    <div className={styles.blockToolbarWrapper}>
      {blocks.map((item, index) => (
        <div
          key={item.type}
          className={`${styles.elementCard} ${activeTool === item.type ? styles.activeElement : ''}`}
          draggable={isDraggable}
          onDragStart={(e) => handleDragStart(e, item.type)}
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

export default BlockToolbar;
