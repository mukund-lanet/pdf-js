'use client';
import React from 'react';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Divider from '@trenchaant/pkg-ui-component-library/build/Components/Divider';

interface DragDropToolbarProps {
  onDragStart: (type: 'text' | 'image' | 'signature' | 'video' | 'table' | 'product-list' | 'page-break' | 'text-field' | 'date' | 'initials' | 'checkbox') => void;
  activeTool: string | null;
}

const DragDropToolbar = ({ onDragStart, activeTool }: DragDropToolbarProps) => {
  const handleDragStart = (e: React.DragEvent, type: any) => {
    e.dataTransfer.setData('application/pdf-editor', type);
    onDragStart(type);
  };

  const blocks = [
    { type: 'text', label: 'Text', icon: 'type' },
    { type: 'image', label: 'Image', icon: 'image' },
    { type: 'video', label: 'Video', icon: 'video' },
    { type: 'table', label: 'Table', icon: 'table' },
    { type: 'product-list', label: 'Product list', icon: 'file-text' },
    { type: 'page-break', label: 'Page break', icon: 'scissors' },
  ];

  const fillableFields = [
    { type: 'signature', label: 'Signature', icon: 'pencil-line' },
    { type: 'text-field', label: 'Text Field', icon: 'type' },
    { type: 'date', label: 'Date', icon: 'calendar' },
    { type: 'initials', label: 'Initials', icon: 'type' },
    { type: 'checkbox', label: 'Checkbox', icon: 'check-square' },
  ];

  const renderItem = (item: { type: string; label: string; icon: string }) => (
    <div
      key={item.type}
      className={`${styles.toolbarItem} ${activeTool === item.type ? styles.active : ''}`}
      draggable
      onDragStart={(e: React.DragEvent) => handleDragStart(e, item.type)}
      onClick={() => onDragStart(item.type as any)}
    >
      <div className={styles.iconWrapper}>
        <CustomIcon iconName={item.icon} width={20} height={20} />
      </div>
      <Typography className={styles.label}>{item.label}</Typography>
    </div>
  );

  return (
    <div className={styles.dragDropToolBarWrapper} >
      <div className={styles.sectionTitle}>
        <Typography variant="caption" className={styles.sectionTitleText}>BLOCKS</Typography>
      </div>
      <div className={styles.dragDropToolbarGrid}>
        {blocks.map(renderItem)}
      </div>

      <div className={styles.sectionTitle} style={{ marginTop: '20px' }}>
        <Typography variant="caption" className={styles.sectionTitleText}>FILLABLE FIELDS</Typography>
      </div>
      <div className={styles.dragDropToolbarGrid}>
        {fillableFields.map(renderItem)}
      </div>
    </div>
  );
};

export default DragDropToolbar;