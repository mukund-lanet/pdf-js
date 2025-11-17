'use client';
import React from 'react';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';

interface DragDropToolbarProps {
  onDragStart: (type: 'text' | 'image' | 'signature') => void;
  activeTool: string | null;
}

const DragDropToolbar = ({ onDragStart, activeTool }: DragDropToolbarProps) => {
  const handleDragStart = (e: React.DragEvent, type: 'text' | 'image' | 'signature') => {
    e.dataTransfer.setData('application/pdf-editor', type);
    onDragStart(type);
  };

  return (
    <div className={styles.dragDropToolbar}>
      <div 
        className={`${styles.toolbarItem} ${activeTool === 'text' ? styles.active : ''}`}
        draggable
        onDragStart={(e: React.DragEvent) => handleDragStart(e, 'text')}
        onClick={() => onDragStart('text')}
      >
        <Typography className={styles.label} >
          <CustomIcon iconName="file-text" width={16} height={16}  />
          Text
        </Typography>
      </div>
      
      <div 
        className={`${styles.toolbarItem} ${activeTool === 'image' ? styles.active : ''}`}
        draggable
        onDragStart={(e: React.DragEvent) => handleDragStart(e, 'image')}
        onClick={() => onDragStart('image')}
      >
        <Typography className={styles.label} >
          <CustomIcon iconName="image" width={16} height={16}  />
          Image
        </Typography>
      </div>
      
      <div 
        className={`${styles.toolbarItem} ${activeTool === 'signature' ? styles.active : ''}`}
        draggable
        onDragStart={(e: React.DragEvent) => handleDragStart(e, 'signature')}
        onClick={() => onDragStart('signature')}
      >
        <Typography className={styles.label} >
          <CustomIcon iconName="pencil-line" width={16} height={16}  />
          Signature
        </Typography>
      </div>
    </div>
  );
};

export default DragDropToolbar;