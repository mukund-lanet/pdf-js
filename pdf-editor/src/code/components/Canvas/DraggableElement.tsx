'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FillableFieldElement } from '../../types';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';

interface DraggableElementProps {
  element: FillableFieldElement;
}

const DraggableElement = ({
  element,
}: DraggableElementProps) => {
  const dispatch = useDispatch();
  const [isDragging, setIsDragging] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);

  const targetRef = useRef<HTMLDivElement>(null);

  // Use element coordinates directly
  const position = { x: element.x, y: element.y };
  const size = { width: element.width, height: element.height };

  // drag handling
  const handleMouseDown = (e: React.MouseEvent) => {
    // Allow event to propagate to Selecto/Moveable
    setIsDragging(true);
  };

  const handleClick = (e: React.MouseEvent) => {
    // Allow event to propagate to Selecto
    setShowToolbar(true);
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

  // Hide toolbar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (targetRef.current && !targetRef.current.contains(event.target as Node)) {
        setShowToolbar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const renderContent = () => {
    switch (element.type) {
      case 'text-field':
        return (
          <div className={`${styles.renderContentCommonDiv} ${isDragging ? styles.isGrabbing : ''} `}>
            <Typography fontWeight="400" className={styles.contentLabel}>
              {element.content || 'Enter text here...'}
            </Typography>
          </div>
        );

      case 'signature':
        return (
          <div className={`${styles.renderContentCommonDiv} ${isDragging ? styles.isGrabbing : ''} `}>
            <div className={styles.contentDiv}>
              <CustomIcon iconName="pencil-line" width={24} height={24} customColor="#00acc1" />
              <Typography fontWeight="400" className={styles.contentLabel}>
                Click to sign
              </Typography>
            </div>
          </div>
        );

      case 'date':
        return (
          <div className={`${styles.renderContentCommonDiv} ${isDragging ? styles.isGrabbing : ''} `}>
            <div className={styles.contentDiv}>
              <CustomIcon iconName="calendar" width={20} height={20} customColor="#00acc1" />
              <Typography fontWeight="400" className={styles.contentLabel}>
                {element.value || 'Select date'}
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
            <CustomIcon
              iconName={element.checked ? "check-square" : "square"}
              width={24}
              height={24}
              customColor="#00acc1"
            />
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
    width: size.width,
    height: size.height,
    border: (isDragging) ? '2px solid #007bff' : '2px dashed #007bff',
    background: 'rgba(255, 255, 255, 0.95)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: (isDragging) ? 100 : 10,
    userSelect: 'none',
    pointerEvents: 'auto',
  };

  return (
    <>
      <div
        ref={targetRef}
        className="draggable-element"
        data-id={element.id}
        style={elementStyle}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        onMouseLeave={handleMouseLeave}
      >
        {showToolbar && (
          <div className={styles.elementToolbar}>
            <Button
              className={styles.toolbarButton}
              onClick={handleCopy}
              onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
              title="Copy"
            >
              <CustomIcon iconName="copy" width={14} height={14} customColor="#ffffff" />
            </Button>
            <Button
              className={styles.toolbarButton}
              onClick={handleDelete}
              onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
              title="Delete"
            >
              <CustomIcon iconName="trash-2" width={14} height={14} customColor="#ffffff" />
            </Button>
            <Button
              className={styles.toolbarButton}
              onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
              title="More options"
            >
              <CustomIcon iconName="ellipsis" width={14} height={14} customColor="#ffffff" />
            </Button>
          </div>
        )}

        {renderContent()}
      </div>
    </>
  );
};

export default DraggableElement;