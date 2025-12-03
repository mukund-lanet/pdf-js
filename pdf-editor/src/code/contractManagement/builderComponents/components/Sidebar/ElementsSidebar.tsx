'use client';
import React from 'react';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import { blocks, fillableFields } from '../../../utils/utils';
import { useDrag } from 'react-dnd';
import { TOOLBAR_ITEM, SET_ACTIVE_TOOL } from '../../../store/action/contractManagement.actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/reducer/contractManagement.reducer';
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import { DraggableBlockItemProps, DraggableToolbarItemProps } from '../../../utils/interface';

const ElementsSidebar: React.FC = () => {

  const dispatch = useDispatch();
  const activeTool = useSelector((state: RootState) => state?.contractManagement?.activeTool);

  const DraggableBlockItem = ({ item, activeTool, dispatch }: DraggableBlockItemProps) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: TOOLBAR_ITEM,
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
        onClick={() => dispatch({ type: SET_ACTIVE_TOOL, payload: item.type })}
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

  const DraggableToolbarItem = ({ item, activeTool, dispatch }: DraggableToolbarItemProps) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: TOOLBAR_ITEM,
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
        onClick={() => dispatch({ type: SET_ACTIVE_TOOL, payload: item.type })}
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

  return (
    <div className={styles.elementsSidebar}>
      <div className={styles.sidebarHeader}>
        <Typography variant="h6" className={styles.sidebarTitle}>Add an Element</Typography>
      </div>

      <div className={styles.sidebarContent}>
        <div className={styles.elementSection}>
          <Typography variant="caption" className={styles.sectionTitle}>BLOCKS</Typography>
          <div className={styles.elementsGrid}>
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
          </div>
        </div>

        <div className={styles.elementSection}>
          <Typography variant="caption" className={styles.sectionTitle}>FILLABLE FIELDS</Typography>
          <div className={styles.elementsGrid}>
            <div className={styles.fillableToolbarWrapper}>
              {fillableFields.map((item) => (
                <DraggableToolbarItem
                  key={item.type}
                  item={item}
                  activeTool={activeTool}
                  dispatch={dispatch}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElementsSidebar;
