'use client';
import styles from 'app/(after-login)/(with-header)/pdf-editor/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";

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
        onDragStart={(e) => handleDragStart(e, 'text')}
        onClick={() => onDragStart('text')}
      >
        <Typography className={styles.label} >📝 Text</Typography>
      </div>
      
      <div 
        className={`${styles.toolbarItem} ${activeTool === 'image' ? styles.active : ''}`}
        draggable
        onDragStart={(e) => handleDragStart(e, 'image')}
        onClick={() => onDragStart('image')}
      >
        <Typography className={styles.label} >📷 Image</Typography>
      </div>
      
      <div 
        className={`${styles.toolbarItem} ${activeTool === 'signature' ? styles.active : ''}`}
        draggable
        onDragStart={(e) => handleDragStart(e, 'signature')}
        onClick={() => onDragStart('signature')}
      >
        <Typography className={styles.label} >✍️ Signature</Typography>
      </div>
    </div>
  );
};

export default DragDropToolbar;