'use client';
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useDrag } from 'react-dnd';
// @ts-ignore
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { useDispatch } from 'react-redux';
import { FillableFieldElement } from '../../types';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import IconButton from '@trenchaant/pkg-ui-component-library/build/Components/IconButton';
import Popover from "@trenchaant/pkg-ui-component-library/build/Components/Popover";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface DraggableElementProps {
  element: FillableFieldElement;
  isSelected: boolean;
  onSelect: (id: string, multi: boolean) => void;
}

const DraggableElement = React.memo(({
  element,
  isSelected,
  onSelect
}: DraggableElementProps) => {
  const dispatch = useDispatch();
  const [showToolbar, setShowToolbar] = useState(false);
  const [datePickerAnchor, setDatePickerAnchor] = useState<HTMLElement | null>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const dateElementRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const [localSize, setLocalSize] = useState({ width: element.width, height: element.height });

  useEffect(() => {
    setLocalSize({ width: element.width, height: element.height });
  }, [element.width, element.height]);

  const position = { x: element.x, y: element.y };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FILLABLE_ELEMENT',
    item: { id: element.id, type: element.type, x: element.x, y: element.y },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [element.id, element.x, element.y, element.type]);

  drag(targetRef);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    const isMultiSelect = e.ctrlKey || e.metaKey || e.shiftKey;
    onSelect(element.id, isMultiSelect);
    setShowToolbar(true);

    dispatch({
      type: 'SET_ACTIVE_ELEMENT_ID',
      payload: element.id
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: 'DELETE_CANVAS_ELEMENT', payload: element.id });
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const copiedElement = {
      ...element,
      id: `element_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
      x: element.x + 20,
      y: element.y + 20
    };
    dispatch({ type: 'ADD_CANVAS_ELEMENT', payload: copiedElement });
  };

  const handleChecked = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    onSelect(element.id, false);
    setShowToolbar(true);
    dispatch({
      type: 'SET_ACTIVE_ELEMENT_ID',
      payload: element.id
    });

    if (element.type === 'checkbox') {
      dispatch({
        type: 'UPDATE_CANVAS_ELEMENT',
        payload: { ...element, checked: !element.checked },
      });
    }
  };

  const handleDateClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (element.type === 'date' && dateElementRef.current) {
      setDatePickerAnchor(dateElementRef.current);

      onSelect(element.id, false);
      setShowToolbar(true);
      dispatch({
        type: 'SET_ACTIVE_ELEMENT_ID',
        payload: element.id
      });
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && element.type === 'date') {
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });

      dispatch({
        type: 'UPDATE_CANVAS_ELEMENT',
        payload: { ...element, value: formattedDate },
      });
    }
    setDatePickerAnchor(null);
  };

  const handleCloseDatePicker = () => {
    setDatePickerAnchor(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideTarget = targetRef.current && !targetRef.current.contains(event.target as Node);
      const isOutsidePopover = !popoverRef.current || !popoverRef.current.contains(event.target as Node);

      if (isOutsideTarget && isOutsidePopover) {
        setShowToolbar(false);
        setDatePickerAnchor(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useLayoutEffect(() => {
    if (datePickerAnchor && dateElementRef.current && datePickerAnchor !== dateElementRef.current) {
      setDatePickerAnchor(dateElementRef.current);
    }
  }, [showToolbar, datePickerAnchor]);

  const isRequired = () => {
    if (element.type === 'text-field' || element.type === 'date' || element.type === 'checkbox') {
      return element.required === true;
    }
    return false;
  };

  const renderContent = () => {
    switch (element.type) {
      case 'text-field':
        return (
          <div className={`${styles.renderContentCommonDiv} ${isDragging ? styles.isGrabbing : ''} `}>
            <Typography fontWeight="400" className={styles.contentLabel}>
              {element.content || element.placeholder || 'Enter value'}
            </Typography>
          </div>
        );

      case 'signature':
        return (
          <div className={`${styles.renderContentCommonDiv} ${isDragging ? styles.isGrabbing : ''} `}>
            <div className={styles.contentDiv}>
              <CustomIcon iconName="pencil-line" width={24} height={24} customColor="#00acc1" />
              <Typography fontWeight="400" className={styles.contentLabel}>
                {element.content || 'Signature'}
              </Typography>
            </div>
          </div>
        );

      case 'date':
        return (
          <div
            // ref={dateElementRef}
            className={`${styles.renderContentCommonDiv} ${isDragging ? styles.isGrabbing : ''} `}
          >
            <div className={`${styles.contentDiv} ${styles.isDatePicker} `} onClick={handleDateClick} ref={dateElementRef}>
              <CustomIcon iconName="calendar" width={20} height={20} customColor="#00acc1" />
              <Typography fontWeight="400" className={styles.contentLabel}>
                {element.value || element.placeholder || 'Select date'}
              </Typography>
            </div>
          </div>
        );

      case 'initials':
        return (
          <div className={`${styles.renderContentCommonDiv} ${isDragging ? styles.isGrabbing : ''} `}>
            <div className={styles.contentDiv}>
              <CustomIcon iconName="pencil-line" width={20} height={20} customColor="#00acc1" />
              <Typography fontWeight="400" className={styles.contentLabel}>
                {element.content || 'Initials'}
              </Typography>
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div className={`${styles.renderContentCommonDiv} ${isDragging ? styles.isGrabbing : ''} `}>
            <IconButton color="secondary" onClick={handleChecked}>
              <CustomIcon
                iconName={element.checked ? "check-square" : "square"}
                width={24}
                height={24}
                customColor="#00acc1"
              />
            </IconButton>
          </div>
        );

      default:
        return null;
    }
  };

  const elementStyle: React.CSSProperties = {
    position: 'absolute',
    left: position.x,
    top: position.y,
    width: localSize.width,
    height: localSize.height,
    background: 'rgba(255, 255, 255, 0.95)',
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? 100 : 10,
    userSelect: 'none',
    pointerEvents: 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <>
      {showToolbar && isSelected ? (
        <Resizable
          width={localSize.width}
          height={localSize.height}
          onResize={(e: any, data: any) => {
            setLocalSize({ width: data.size.width, height: data.size.height });
          }}
          onResizeStop={(e: any, data: any) => {
            dispatch({
              type: 'UPDATE_CANVAS_ELEMENT',
              payload: {
                ...element,
                width: data.size.width,
                height: data.size.height
              }
            });
          }}
          draggableOpts={{ enableUserSelectHack: false }}
        >
          <div
            ref={targetRef}
            className="draggable-element"
            data-id={element.id}
            style={elementStyle}
            onClick={handleClick}
          >
            {showToolbar && isSelected && (
              <div className={styles.elementToolbar}>
                <Button
                  className={styles.toolbarButton}
                  onClick={handleCopy}
                  onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
                  title="Copy"
                >
                  <CustomIcon iconName="copy" width={14} height={14} customColor="#000000" />
                </Button>
                <Button
                  className={styles.toolbarButton}
                  onClick={handleDelete}
                  onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
                  title="Delete"
                >
                  <CustomIcon iconName="trash-2" width={14} height={14} customColor="#000000" />
                </Button>
              </div>
            )}

            {isRequired() && (
              <div className={styles.requiredIndicator}>*</div>
            )}

            {renderContent()}
          </div>
        </Resizable>
      ) : (
        <div
          ref={targetRef}
          className="draggable-element"
          data-id={element.id}
          style={elementStyle}
          onClick={handleClick}
        >
          {isRequired() && (
            <span className={styles.requiredIndicator}>*</span>
          )}

          {renderContent()}
        </div>
      )}

      {element.type === 'date' && (
        <Popover
          open={Boolean(datePickerAnchor)}
          anchorEl={datePickerAnchor}
          onClose={handleCloseDatePicker}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          disablePortal={false}
          container={document.body}
        >
          <div ref={popoverRef} style={{ padding: '16px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <DayPicker
              mode="single"
              selected={element.value ? new Date(element.value) : undefined}
              onSelect={handleDateSelect}
              showOutsideDays
            />
          </div>
        </Popover>
      )}
    </>
  );
});

DraggableElement.displayName = 'DraggableElement';

export default DraggableElement;