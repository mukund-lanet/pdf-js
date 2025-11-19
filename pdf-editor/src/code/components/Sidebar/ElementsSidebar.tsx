'use client';
import React from 'react';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";

interface ElementsSidebarProps {
  onDragStart: (type: string) => void;
  activeTool: string | null;
  onClose?: () => void;
}

const ElementsSidebar = ({ onDragStart, activeTool, onClose }: ElementsSidebarProps) => {
  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('application/pdf-editor', type);
    onDragStart(type);
  };

  const blocks = [
    { type: 'text', label: 'Text', icon: 'type' },
    { type: 'image', label: 'Image', icon: 'image' },
    { type: 'video', label: 'Video', icon: 'video' },
    { type: 'table', label: 'Table', icon: 'table' },
    // { type: 'product-list', label: 'Product list', icon: 'file-text' },
    // { type: 'page-break', label: 'Page break', icon: 'scissors' },
  ];

  const fillableFields = [
    { type: 'signature', label: 'Signature', icon: 'pencil-line' },
    { type: 'text-field', label: 'Text Field', icon: 'type' },
    { type: 'date', label: 'Date', icon: 'calendar' },
    { type: 'initials', label: 'Initials', icon: 'type' },
    { type: 'checkbox', label: 'Checkbox', icon: 'check-square' },
  ];

  const renderElement = (item: { type: string; label: string; icon: string }) => (
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
        <CustomIcon iconName={item.icon} width={32} height={32} variant="primary" />
      </div>
      <Typography className={styles.elementLabel}>{item.label}</Typography>
    </div>
  );

  return (
    <div className={styles.elementsSidebar}>
      <div className={styles.sidebarHeader}>
        <Typography variant="h6" className={styles.sidebarTitle}>Add an Element</Typography>
        {onClose && (
          <Button className={styles.closeButton} onClick={onClose}>
            <CustomIcon iconName="x" width={20} height={20} />
          </Button>
        )}
      </div>

      <div className={styles.sidebarContent}>
        <div className={styles.elementSection}>
          <Typography variant="caption" className={styles.sectionTitle}>BLOCKS</Typography>
          <div className={styles.elementsGrid}>
            {blocks.map(renderElement)}
          </div>
        </div>

        <div className={styles.elementSection}>
          <Typography variant="caption" className={styles.sectionTitle}>FILLABLE FIELDS</Typography>
          <div className={styles.elementsGrid}>
            {fillableFields.map(renderElement)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElementsSidebar;
