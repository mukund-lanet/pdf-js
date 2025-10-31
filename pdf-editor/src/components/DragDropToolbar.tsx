'use client';
import styles from '../styles/DragDropToolbar.module.scss';

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
    <div className={styles.toolbar}>
      <div 
        className={`${styles.toolbarItem} ${activeTool === 'text' ? styles.active : ''}`}
        draggable
        onDragStart={(e) => handleDragStart(e, 'text')}
        onClick={() => onDragStart('text')}
      >
        📝 Text
      </div>
      
      <div 
        className={`${styles.toolbarItem} ${activeTool === 'image' ? styles.active : ''}`}
        draggable
        onDragStart={(e) => handleDragStart(e, 'image')}
        onClick={() => onDragStart('image')}
      >
        🖼️ Image
      </div>
      
      <div 
        className={`${styles.toolbarItem} ${activeTool === 'signature' ? styles.active : ''}`}
        draggable
        onDragStart={(e) => handleDragStart(e, 'signature')}
        onClick={() => onDragStart('signature')}
      >
        ✍️ Signature
      </div>
    </div>
  );
};

export default DragDropToolbar;