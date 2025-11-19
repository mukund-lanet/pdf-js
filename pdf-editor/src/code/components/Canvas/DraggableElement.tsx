'use client';
import React, { useState, useRef, useEffect } from 'react';
import { CanvasElement, TextElement } from '../../types';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Moveable from "react-moveable";

interface DraggableElementProps {
  element: CanvasElement;
  onDelete: (id: string) => void;
}

const DraggableElement = ({
  element,
  onDelete,
}: DraggableElementProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  const targetRef = useRef<HTMLDivElement>(null);
  const moveableRef = useRef<HTMLDivElement>(null);

  // Use element coordinates directly
  const position = { x: element.x, y: element.y };
  const size = { width: element.width, height: element.height };

  // drag handling
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(element.id);
  };

  const handleMouseEnter = () => {
    // if (!isDragging) {
    setShowDeleteButton(true);
    // }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setShowDeleteButton(false);
  };

  const renderContent = () => {
    switch (element.type) {
      case 'text':
        return (
          <div className={`${styles.renderContentCommonDiv} ${isDragging ? styles.isGrabbing : ''} `} >
            <Typography fontWeight="400" className={styles.contentLabel} >
              {element.content || 'Enter text here...'}
            </Typography>
          </div>
        );

      case 'image':
        return (
          <div className={`${styles.renderContentCommonDiv} ${isDragging ? styles.isGrabbing : ''} `} >
            <div className={styles.contentDiv} >
              <CustomIcon iconName="image" width={24} height={24} customColor="#00acc1" />
              <Typography fontWeight="400" className={styles.contentLabel} >
                Click to upload image
              </Typography>
            </div>
          </div>
        );

      case 'signature':
        return (
          <div className={`${styles.renderContentCommonDiv} ${isDragging ? styles.isGrabbing : ''} `} >
            <div className={styles.contentDiv}>
              <CustomIcon iconName="pencil-line" width={24} height={24} customColor="#00acc1" />
              <Typography fontWeight="400" className={styles.contentLabel} >
                Click to sign
              </Typography>
            </div>
          </div>
        );

      case 'date':
        return (
          <div className={`${styles.renderContentCommonDiv} ${isDragging ? styles.isGrabbing : ''} `} >
            <div className={styles.contentDiv}>
              <CustomIcon iconName="calendar" width={20} height={20} customColor="#00acc1" />
              <Typography fontWeight="400" className={styles.contentLabel} >
                {element.value || 'Select date'}
              </Typography>
            </div>
          </div>
        );

      case 'initials':
        return (
          <div className={`${styles.renderContentCommonDiv} ${isDragging ? styles.isGrabbing : ''} `} >
            <div className={styles.contentDiv}>
              <CustomIcon iconName="pencil-line" width={20} height={20} customColor="#00acc1" />
              <Typography fontWeight="400" className={styles.contentLabel} >
                {element.content || 'Initials'}
              </Typography>
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div className={`${styles.renderContentCommonDiv} ${isDragging ? styles.isGrabbing : ''} `} >
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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {showDeleteButton && (
          <Button
            className={styles.deleteButtonBadge}
            onClick={handleDelete}
            onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <CustomIcon iconName="x" width={12} height={12} customColor="#ffffff" />
          </Button>
        )}

        {renderContent()}
      </div>
    </>
  );
};

export default DraggableElement;