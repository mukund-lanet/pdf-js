'use client';
import React from 'react';
import { useDrag } from 'react-dnd';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import { useDispatch } from 'react-redux';

interface BlockToolbarProps {
  activeTool: string | null;
}

const BlockToolbar = ({ activeTool }: BlockToolbarProps) => {

  const dispatch = useDispatch();

  const blocks = [
    { type: 'heading', label: 'Heading', icon: 'type' },
    { type: 'image', label: 'Image', icon: 'image' },
    { type: 'video', label: 'Video', icon: 'video' },
    { type: 'table', label: 'Table', icon: 'table' },
  ];

  return (
    <div className={styles.blockToolbarWrapper}>
      {blocks.map((item) => (
        <DraggableBlockItem
          key={item.type}
          item={item}
          activeTool={activeTool}
          dispatch={dispatch}
        />
      ))}
    </div>
  );
};

interface DraggableBlockItemProps {
  item: { type: string; label: string; icon: string };
  activeTool: string | null;
  dispatch: any;
}

const DraggableBlockItem = ({ item, activeTool, dispatch }: DraggableBlockItemProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TOOLBAR_ITEM',
    item: { type: item.type, label: item.label },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [item.type, item.label]);

  return (
    <div
      ref={drag}
      className={`${styles.elementCard} ${activeTool === item.type ? styles.activeElement : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'grab' }}
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
  );
};

export default BlockToolbar;
