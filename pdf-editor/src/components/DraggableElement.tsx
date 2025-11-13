'use client';
import React, { useState, useRef, useEffect } from 'react';
import { CanvasElement, TextElement } from './types';
import styles from 'app/(after-login)/(with-header)/pdf-editor/pdfEditor.module.scss';
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
        const textElement = element as TextElement;
        const textStyle: React.CSSProperties = {
          display: 'flex',
          // alignItems: 'center',
          fontSize: `${textElement.fontSize || 12}px`,
          color: textElement.color || '#000000',
          fontWeight: textElement.fontWeight || 'normal',
          fontStyle: textElement.fontStyle || 'normal',
          textDecoration: textElement.textDecoration || 'none',
          // @ts-ignore
          textAlign: textElement.textAlign || 'left',
          justifyContent: textElement.textAlign === 'center' 
            ? 'center' 
            : textElement.textAlign === 'right' 
              ? 'flex-end' 
              : 'flex-start',
          width: '100%',
          height: '100%',
          padding: '4px',
          wordWrap: 'break-word',
          overflow: 'hidden',
          whiteSpace: 'break-spaces',
          lineHeight: '24px'
        };

        return (
          <div style={textStyle}>
            {element.content || 'Enter text here...'}
          </div>
        );

      case 'image':
        return (
          <div style={{ 
            width: '100%', 
            height: '100%', 
            position: 'relative',
            border: element.imageData ? 'none' : '2px dashed #ccc',
            background: element.imageData ? 'transparent' : '#f9f9f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isDragging ? 'grabbing' : 'move',
            userSelect: 'none'
          }}>
            <div className={styles.renderImageOverley} >
              <span>📷</span>
              <Typography className={styles.label} >
                Click to upload image
              </Typography>
            </div>
          </div>
        );

      case 'signature':
        return (
          <div className={styles.renderContentSignature} >
            <div className={styles.renderImageOverley} >
              <span>✏️</span>
              <Typography className={styles.label} >
                Click to sign
              </Typography>
            </div>
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
  };

  return (
    <>
      <div
        ref={targetRef}
        style={elementStyle}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        { showDeleteButton && (
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
      <Moveable
        // @ts-ignore
        ref={moveableRef} 
        target={targetRef}
        draggable={true}
        throttleDrag={1}
        edgeDraggable={false}
        startDragRotate={0}
        throttleDragRotate={0}
        resizable={true}
        keepRatio={false}
        throttleResize={1}
        renderDirections={["nw","n","ne","w","e","sw","s","se"]}
        rotatable={true}
        throttleRotate={0}
        rotationPosition={"top"}
        onDrag={e => {
            e.target.style.transform = e.transform;
        }}
        onResize={e => {
            e.target.style.width = `${e.width}px`;
            e.target.style.height = `${e.height}px`;
            e.target.style.transform = e.drag.transform;
        }}
        onRotate={e => {
            e.target.style.transform = e.drag.transform;
        }}
      />
    </>
  );
};

export default DraggableElement;