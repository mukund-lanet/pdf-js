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
  onUpdate: (element: CanvasElement) => void;
  onDelete: (id: string) => void;
  onImageUpload: (elementId: string) => void;
  onSignatureDraw: (elementId: string) => void;
  onSelect: (element: CanvasElement) => void;
  pageInfo: { pageWidth: number; pageHeight: number };
  scale: number;
}

const DraggableElement = ({ 
  element, 
  onUpdate, 
  onDelete, 
  onImageUpload, 
  onSignatureDraw, 
  onSelect,
  pageInfo, 
  scale 
}: DraggableElementProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);
  const [tempContent, setTempContent] = useState(element.type === 'text' ? element.content : '');
  
  const targetRef = useRef<HTMLDivElement>(null);
  const moveableRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  // Use element coordinates directly
  const position = { x: element.x, y: element.y };
  const size = { width: element.width, height: element.height };

  useEffect(() => {
    if (isEditing && textInputRef.current) {
      textInputRef.current.focus();
      textInputRef.current.select();
    }
  }, [isEditing]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTempContent(e.target.value);
  };

  const handleTextBlur = () => {
    if (element.type === 'text') {
      onUpdate({
        ...element,
        content: tempContent
      } as TextElement);
    }
    setIsEditing(false);
  };

  const handleTextKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleTextBlur();
    }
    if (e.key === 'Escape') {
      setTempContent(element.type === 'text' ? element.content : '');
      setIsEditing(false);
    }
  };

  // drag handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing || isResizing) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(element.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (element.type === 'image') {
      onImageUpload(element.id);
    } else if (element.type === 'signature') {
      onSignatureDraw(element.id);
    }
  };

  const handleElementClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (element.type === 'text') {
      onSelect(element);
    } else if (element.type === 'image' && !element.imageData) {
      onImageUpload(element.id);
    } else if (element.type === 'signature' && !element.imageData) {
      onSignatureDraw(element.id);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (element.type === 'text') {
      onSelect(element);
      setIsEditing(true);
    }
  }

  const handleMouseEnter = () => {
    if (!isEditing && !isDragging && !isResizing) {
      setShowDeleteButton(true);
      if (element.type === 'image' || element.type === 'signature') {
        setShowEditButton(true);
      }
    }
  };

  const handleMouseLeave = () => {
    setShowDeleteButton(false);
    setShowEditButton(false);
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

        if (isEditing) {
          return (
            <textarea
              ref={textInputRef}
              value={tempContent}
              onChange={handleTextChange}
              onBlur={handleTextBlur}
              onKeyDown={handleTextKeyDown}
              className={styles.renderContentTextArea}
              style={textStyle}
            />
          );
        }
        return (
          <div 
          onDoubleClick={handleDoubleClick}
          style={textStyle}
          >
            {element.content || 'Double click to edit text'}
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
            {element.imageData ? (
              <img 
                src={element.imageData} 
                alt="Uploaded" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain' 
                }}
                draggable={true}
              />
            ) : (
              <div className={styles.renderImageOverley} >
                <div className={styles.contentPic} >📷</div>
                <Typography className={styles.label} >
                  Click to upload image
                </Typography>
              </div>
            )}
          </div>
        );

      case 'signature':
        return (
          <div 
            className={`${styles.renderContentSignature} ${isDragging ? styles.dragging : ''} ${element.imageData ? styles.hasImage : ''} `} >
            {element.imageData ? (
              <img 
                src={element.imageData} 
                alt="Signature" 
                className={styles.imageContainer}
                draggable={false}
              />
            ) : (
              <div className={styles.renderImageOverley} >
                <div className={styles.signImg} >✏️</div>
                <Typography className={styles.label} >
                  Click to sign
                </Typography>
              </div>
            )}
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
    border: (isDragging || isResizing) ? '2px solid #007bff' : '2px dashed #007bff',
    background: 'rgba(255, 255, 255, 0.95)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    cursor: isEditing ? 'text' : (isDragging ? 'grabbing' : 'grab'),
    zIndex: (isDragging || isResizing) ? 100 : 10,
    userSelect: 'none',
  };

  return (
    <>
      <div
        ref={targetRef}
        style={elementStyle}
        onMouseDown={handleMouseDown}
        onClick={handleElementClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        { showEditButton && !isEditing && !isDragging && !isResizing && (
          <Button 
            className={styles.editButtonBadge}
            onClick={handleEdit}
            onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
            title="Edit"
          >
            <CustomIcon iconName="square-pen" width={12} height={12} customColor="#000000" />
          </Button>
        )}

        { showDeleteButton && !isEditing && !isDragging && !isResizing && (
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