'use client';
import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { useDrag } from 'react-dnd';
// @ts-ignore
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { useDispatch } from 'react-redux';
import { FillableElements } from '../../../utils/interface'; // Use correct type
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import IconButton from '@trenchaant/pkg-ui-component-library/build/Components/IconButton';
import Popover from "@trenchaant/pkg-ui-component-library/build/Components/Popover";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { SET_ACTIVE_ELEMENT_ID, UPDATE_ELEMENT_IN_PAGE, DELETE_ELEMENT_FROM_PAGE, ADD_ELEMENT_TO_PAGE, FILLABLE_ELEMENT } from '../../../store/action/contractManagement.actions';

interface DraggableElementProps {
  element: FillableElements;
  pageNumber: number;
  isSelected: boolean;
  onSelect: (id: string, multi: boolean) => void;
}

const DraggableElement = React.memo(({
  element,
  pageNumber,
  isSelected,
  onSelect
}: DraggableElementProps) => {
  const dispatch = useDispatch();
  const [showToolbar, setShowToolbar] = useState(false);
  const [datePickerAnchor, setDatePickerAnchor] = useState<HTMLElement | null>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const dateElementRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // --- Helper to safely get styles from GHL structure ---
  const getStyles = useCallback(() => {
    const largeStyles = element.responsiveStyles?.large;
    const pos = largeStyles?.position || { left: 0, top: 0, width: 100, height: 50 };
    return {
      x: pos.left,
      y: pos.top,
      width: pos.width || 100,
      height: pos.height || 50
    };
  }, [element.responsiveStyles?.large]);

  const { x, y, width, height } = getStyles();
  const [localSize, setLocalSize] = useState({ width, height });

  // Update local size when element updates (e.g. undo/redo or external change)
  useEffect(() => {
    setLocalSize({ width, height });
  }, [width, height]);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: FILLABLE_ELEMENT,
    item: { id: element.id, type: element.type, x, y },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [element.id, element.type, x, y]);

  drag(targetRef);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isMultiSelect = e.ctrlKey || e.metaKey || e.shiftKey;
    onSelect(element.id, isMultiSelect);
    setShowToolbar(true);
    dispatch({ type: SET_ACTIVE_ELEMENT_ID, payload: element.id });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({
      type: DELETE_ELEMENT_FROM_PAGE,
      payload: { pageNumber, elementId: element.id }
    });
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Deep copy and offset position
    const newId = `element_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const copiedElement = JSON.parse(JSON.stringify(element));
    copiedElement.id = newId;
    if (copiedElement.component?.options) {
        copiedElement.component.options.fieldId = newId;          
    }
    
    // Offset position
    if (copiedElement.responsiveStyles?.large?.position) {
      copiedElement.responsiveStyles.large.position.left += 20;
      copiedElement.responsiveStyles.large.position.top += 20;
    }

    dispatch({
      type: ADD_ELEMENT_TO_PAGE,
      payload: { pageNumber, element: copiedElement }
    });
  };

  const handleChecked = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(element.id, false);
    setShowToolbar(true);
    dispatch({ type: SET_ACTIVE_ELEMENT_ID, payload: element.id });

    if (element.type === 'Checkbox') {
      const currentChecked = (element.component.options as any).preChecked || false;
      dispatch({
        type: UPDATE_ELEMENT_IN_PAGE,
        payload: {
          pageNumber,
          element: {
            ...element,
            component: {
              ...element.component,
              options: {
                ...element.component.options,
                preChecked: !currentChecked
              }
            }
          }
        },
      });
    }
  };

  const handleDateClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (element.type === 'DateField') {
      onSelect(element.id, false);
      setShowToolbar(true);
      dispatch({ type: SET_ACTIVE_ELEMENT_ID, payload: element.id });
      setTimeout(() => {
        if (dateElementRef.current) setDatePickerAnchor(dateElementRef.current);
      }, 0);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && element.type === 'DateField') {
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric', month: '2-digit', day: '2-digit'
      });
       dispatch({
        type: UPDATE_ELEMENT_IN_PAGE,
        payload: {
          pageNumber,
          element: {
            ...element,
            component: {
              ...element.component,
              options: {
                ...element.component.options,
                text: formattedDate, 
                value: formattedDate 
              }
            }
          }
        },
      });
    }
    setDatePickerAnchor(null);
  };

  const handleCloseDatePicker = () => setDatePickerAnchor(null);

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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useLayoutEffect(() => {
    if (datePickerAnchor && dateElementRef.current && datePickerAnchor !== dateElementRef.current) {
      setDatePickerAnchor(dateElementRef.current);
    }
  }, [showToolbar, datePickerAnchor]);

  const isRequired = () => {
    return element.component?.options?.required === true;
  };

  const renderContent = () => {
    const options = element.component?.options || {};
    
    switch (element.type) {
      case 'TextField':
        return (
          <div className={`${styles.renderContentCommonDiv} ${isDragging ? styles.isGrabbing : ''} `}>
            <Typography fontWeight="400" className={styles.contentLabel}>
              {(options as any).text || (options as any).placeholder || 'Enter value'}
            </Typography>
          </div>
        );

      case 'Signature':
        return (
          <div className={`${styles.renderContentCommonDiv} ${isDragging ? styles.isGrabbing : ''} `}>
            <div className={styles.contentDiv}>
              <CustomIcon iconName="pencil-line" width={24} height={24} customColor="#00acc1" />
              <Typography fontWeight="400" className={styles.contentLabel}>
                {(options as any).text || 'Signature'}
              </Typography>
            </div>
          </div>
        );

      case 'DateField':
        return (
          <div className={`${styles.renderContentCommonDiv} ${isDragging ? styles.isGrabbing : ''} `} >
            <div className={`${styles.contentDiv} ${styles.isDatePicker} `} onClick={handleDateClick} ref={dateElementRef}>
              <CustomIcon iconName="calendar" width={20} height={20} customColor="#00acc1" />
              <Typography fontWeight="400" className={styles.contentLabel}>
                {(options as any).text || (options as any).placeholder || 'Select date'}
              </Typography>
            </div>
          </div>
        );

      case 'InitialsField':
        return (
          <div className={`${styles.renderContentCommonDiv} ${isDragging ? styles.isGrabbing : ''} `}>
            <div className={styles.contentDiv}>
              <CustomIcon iconName="pencil-line" width={20} height={20} customColor="#00acc1" />
              <Typography fontWeight="400" className={styles.contentLabel}>
                {(options as any).text || 'Initials'}
              </Typography>
            </div>
          </div>
        );

      case 'Checkbox':
        return (
          <div className={`${styles.renderContentCommonDiv} ${isDragging ? styles.isGrabbing : ''} `}>
            <IconButton color="secondary" onClick={handleChecked}>
              <CustomIcon
                iconName={(options as any).preChecked ? "check-square" : "square"}
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
    left: x,
    top: y,
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
            // Update width/height in GHL structure
            const currentResponsive = element.responsiveStyles?.large || {};
            const currentPos = currentResponsive.position || { left: x, top: y };
            
            dispatch({
              type: UPDATE_ELEMENT_IN_PAGE,
              payload: {
                pageNumber,
                element: {
                  ...element,
                  responsiveStyles: {
                    ...element.responsiveStyles,
                    large: {
                      ...currentResponsive,
                      position: {
                        ...currentPos,
                        width: data.size.width,
                        height: data.size.height
                      }
                    }
                  }
                }
              }
            });
          }}
          draggableOpts={{ enableUserSelectHack: false }}
          handle={(h: any, ref: any) => (
            <span
              className={`react-resizable-handle react-resizable-handle-${h}`}
              ref={ref}
              onMouseDown={(e) => { e.stopPropagation(); }}
            />
          )}
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
            {isRequired() && <div className={styles.requiredIndicator}>*</div>}
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
          {isRequired() && <span className={styles.requiredIndicator}>*</span>}
          {renderContent()}
        </div>
      )}

      {element.type === 'DateField' && (
        <Popover
          open={Boolean(datePickerAnchor)}
          anchorEl={datePickerAnchor}
          onClose={handleCloseDatePicker}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          disablePortal={false}
          container={document.body}
        >
          <div ref={popoverRef} style={{ padding: '16px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <DayPicker
              mode="single"
              selected={element.component?.options?.text ? new Date(element.component.options.text) : undefined}
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