'use client';
import React, { useRef, useEffect } from 'react';
import { useDrop, useDragLayer } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
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

  // Helper to generate ID
  const generateId = () => `element_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

  const { isDragging } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
  }));

  const [, drop] = useDrop({
    accept: ['FILLABLE_ELEMENT', 'TOOLBAR_ITEM'],
    drop: (item: { id?: string; type: string; x?: number; y?: number; label?: string }, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const clientOffset = monitor.getClientOffset();

      // Handle existing element move
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

      // Handle new element creation from toolbar
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

        // Calculate order for block elements (if needed, though blocks are usually appended or inserted)
        // For now, we append to end of page list
        // We need access to all canvas elements to calculate order correctly, but here we only have fillableElements
        // We can dispatch an action that handles order calculation in reducer, or fetch all elements.
        // Let's assume we can dispatch ADD_CANVAS_ELEMENT and let reducer handle order if missing?
        // Actually, the reducer usually just adds it. We should calculate order here if possible.
        // But we don't have all elements.
        // Let's use a selector to get all elements for this page to calculate order.

        // Wait, we can't use hooks inside the callback easily if dependencies change.
        // But we can dispatch a thunk or custom action.
        // Or we can just pass the current max order + 1.
        // Since we don't have all elements in props, let's try to get them or use a safe default.
        // Actually, let's just dispatch the element with a placeholder order and let the reducer or a saga fix it?
        // No, let's just use a large number or 0.
        // Better: The previous logic in PDFPage used `canvasElements` from Redux.
        // We can select all elements in this component too.

        const elementType = type as 'text-field' | 'image' | 'signature' | 'date' | 'initials' | 'checkbox' | 'heading' | 'video' | 'table';

        const getNextOrder = () => {
          const pageBlocks = allElements.filter(el => ['heading', 'image', 'video', 'table'].includes(el.type));
          return pageBlocks.length > 0
            ? Math.max(...pageBlocks.map((el: any) => el.order || 0)) + 1
            : 0;
        };

        switch (elementType) {
          case 'heading':
            // We need to calculate order. Let's fetch all elements in the component body.
            // See below for the selector update.
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

  // Attach drop ref to the container div
  // We need to combine refs if containerRef is used elsewhere, but here it seems passed from parent.
  // However, useDrop returns a ref function.
  // We can just use a wrapper div or merge refs.
  // Since containerRef is passed from props, let's assume we can attach drop to the internal div.

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
