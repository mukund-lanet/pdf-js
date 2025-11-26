'use client';
import React from 'react';
import { useDrop, useDragLayer } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import DraggableElement from './DraggableElement';
import { FillableFieldElement, CanvasElement, isFillableElement } from '../../types';
import { RootState } from '../../store/reducer/pdfEditor.reducer';

interface FillableContainerProps {
  pageNumber: number;
  containerRef: React.RefObject<HTMLDivElement>;
}

const FillableContainer = ({
  pageNumber,
  containerRef
}: FillableContainerProps) => {
  const dispatch = useDispatch();
  const allElements = useSelector((state: RootState) =>
    state.pdfEditor.pdfEditorReducer.canvasElements.filter(el => el.page === pageNumber)
  );
  const fillableElements = allElements.filter(el => isFillableElement(el)) as FillableFieldElement[];

  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const generateId = () => `element_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

  const { isDragging } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
  }));

  const [, drop] = useDrop({
    accept: ['FILLABLE_ELEMENT', 'TOOLBAR_ITEM'],
    drop: (item: { id?: string; type: string; x?: number; y?: number; label?: string }, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const clientOffset = monitor.getClientOffset();

      // handle the existing element move
      if (monitor.getItemType() === 'FILLABLE_ELEMENT' && delta && item.id && item.x !== undefined && item.y !== undefined) {
        const element = fillableElements.find(el => el.id === item.id);
        if (!element) return;

        const newX = Math.round(item.x + delta.x);
        const newY = Math.round(item.y + delta.y);

        dispatch({
          type: 'UPDATE_CANVAS_ELEMENT',
          payload: {
            ...element,
            x: newX,
            y: newY
          }
        });
        return;
      }

      if (monitor.getItemType() === 'TOOLBAR_ITEM' && clientOffset && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientOffset.x - rect.left;
        const y = clientOffset.y - rect.top;
        const type = item.type;

        const defaultSize = {
          heading: { height: 115 },
          'text-field': { width: 200, height: 40 },
          image: { height: 300 },
          signature: { width: 150, height: 80 },
          date: { width: 150, height: 40 },
          initials: { width: 100, height: 60 },
          checkbox: { width: 40, height: 40 },
          video: { height: 300 },
          table: { height: 200 }
        };

        const elementType = type as 'text-field' | 'image' | 'signature' | 'date' | 'initials' | 'checkbox' | 'heading' | 'video' | 'table';

        const getNextOrder = () => {
          const pageBlocks = allElements.filter(el => ['heading', 'image', 'video', 'table'].includes(el.type));
          return pageBlocks.length > 0
            ? Math.max(...pageBlocks.map((el: any) => el.order || 0)) + 1
            : 0;
        };

        switch (elementType) {
          case 'heading':
            dispatch({
              type: 'ADD_CANVAS_ELEMENT',
              payload: {
                type: 'heading',
                id: generateId(),
                order: getNextOrder(),
                height: defaultSize.heading.height,
                content: 'Heading',
                page: pageNumber,
                fontSize: 32,
                fontWeight: '700'
              }
            });
            break;

          case 'text-field':
            dispatch({
              type: 'ADD_CANVAS_ELEMENT',
              payload: {
                type: 'text-field',
                id: generateId(),
                x: x - defaultSize['text-field'].width / 2,
                y: y - defaultSize['text-field'].height / 2,
                width: defaultSize['text-field'].width,
                height: defaultSize['text-field'].height,
                content: 'Enter text here...',
                page: pageNumber,
                fontSize: 12,
                color: '#000000',
                fontWeight: 'normal',
                fontStyle: 'normal',
                textDecoration: 'none',
                textAlign: 'left'
              }
            });
            break;

          case 'image':
            dispatch({
              type: 'ADD_CANVAS_ELEMENT',
              payload: {
                type: 'image',
                id: generateId(),
                order: getNextOrder(),
                height: defaultSize.image.height,
                imageData: '',
                page: pageNumber
              }
            });
            break;

          case 'video':
            dispatch({
              type: 'ADD_CANVAS_ELEMENT',
              payload: {
                type: 'video',
                id: generateId(),
                order: getNextOrder(),
                height: defaultSize.video.height,
                videoUrl: '',
                page: pageNumber
              }
            });
            break;

          case 'table':
            dispatch({
              type: 'ADD_CANVAS_ELEMENT',
              payload: {
                type: 'table',
                id: generateId(),
                order: getNextOrder(),
                height: defaultSize.table.height,
                rows: 2,
                columns: 2,
                page: pageNumber
              }
            });
            break;

          case 'signature':
            dispatch({
              type: 'ADD_CANVAS_ELEMENT',
              payload: {
                type: 'signature',
                id: generateId(),
                x: x - defaultSize.signature.width / 2,
                y: y - defaultSize.signature.height / 2,
                width: defaultSize.signature.width,
                height: defaultSize.signature.height,
                imageData: '',
                page: pageNumber
              }
            });
            break;

          case 'date':
            dispatch({
              type: 'ADD_CANVAS_ELEMENT',
              payload: {
                type: 'date',
                id: generateId(),
                x: x - defaultSize.date.width / 2,
                y: y - defaultSize.date.height / 2,
                width: defaultSize.date.width,
                height: defaultSize.date.height,
                value: '',
                page: pageNumber
              }
            });
            break;

          case 'initials':
            dispatch({
              type: 'ADD_CANVAS_ELEMENT',
              payload: {
                type: 'initials',
                id: generateId(),
                x: x - defaultSize.initials.width / 2,
                y: y - defaultSize.initials.height / 2,
                width: defaultSize.initials.width,
                height: defaultSize.initials.height,
                content: '',
                page: pageNumber
              }
            });
            break;

          case 'checkbox':
            dispatch({
              type: 'ADD_CANVAS_ELEMENT',
              payload: {
                type: 'checkbox',
                id: generateId(),
                x: x - defaultSize.checkbox.width / 2,
                y: y - defaultSize.checkbox.height / 2,
                width: defaultSize.checkbox.width,
                height: defaultSize.checkbox.height,
                checked: false,
                page: pageNumber
              }
            });
            break;
        }

        dispatch({ type: 'SET_ACTIVE_TOOL', payload: null });
      }
    },
  });

  const handleSelect = (id: string, multi: boolean) => {
    if (multi) {
      setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    } else {
      setSelectedIds([id]);
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedIds([]);
    }
  };

  return (
    <div
      ref={drop}
      className={styles.fillableContainer}
      onClick={handleContainerClick}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: isDragging ? 'auto' : 'none'
      }}
    >
      {fillableElements.map(element => (
        <div key={element.id} className={styles.fillableElementWrapper}>
          <DraggableElement
            element={element}
            isSelected={selectedIds.includes(element.id)}
            onSelect={handleSelect}
          />
        </div>
      ))}
    </div>
  );
};

export default FillableContainer;
