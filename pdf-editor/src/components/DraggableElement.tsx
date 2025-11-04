'use client';
import { useState, useRef, useEffect } from 'react';
import { CanvasElement, TextElement, ImageElement, SignatureElement } from './types';
import TextPropertiesToolbar from './TextPropertiesToolbar';
import styles from 'app/(after-login)/(with-header)/pdf-editor/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';

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
  pageInfo, 
  scale 
}: DraggableElementProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);
  const [showPropertiesToolbar, setShowPropertiesToolbar] = useState(false);
  const [tempContent, setTempContent] = useState(element.type === 'text' ? element.content : '');
  
  const elementRef = useRef<HTMLDivElement>(null);
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
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = elementRef.current ? parseInt(elementRef.current.style.left, 10) : position.x;
    const startPosY = elementRef.current ? parseInt(elementRef.current.style.top, 10) : position.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      // Calculate new position with bounds checking
      const newX = Math.max(0, Math.min(startPosX + deltaX, pageInfo.pageWidth - size.width));
      const newY = Math.max(0, Math.min(startPosY + deltaY, pageInfo.pageHeight - size.height));
      
      // Update element position
      if (elementRef.current) {
        elementRef.current.style.left = `${newX}px`;
        elementRef.current.style.top = `${newY}px`;
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      if (elementRef.current) {
        onUpdate({
          ...element,
          x: parseInt(elementRef.current.style.left, 10),
          y: parseInt(elementRef.current.style.top, 10)
        });
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // resize handling
  const startResize = (corner: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);  
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = element.width;
    const startHeight = element.height;
    const startXPos = element.x;
    const startYPos = element.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startXPos;
      let newY = startYPos;

      const minSize = {
        text: { width: 50, height: 20 },
        image: { width: 30, height: 30 },
        signature: { width: 50, height: 30 }
      };

      const min = minSize[element.type] || { width: 30, height: 20 };

      switch (corner) {
        case 'topLeft':
          newWidth = Math.max(min.width, startWidth - deltaX);
          newHeight = Math.max(min.height, startHeight - deltaY);
          newX = startXPos + deltaX;
          newY = startYPos + deltaY;
          break;
        case 'topRight':
          newWidth = Math.max(min.width, startWidth + deltaX);
          newHeight = Math.max(min.height, startHeight - deltaY);
          newY = startYPos + deltaY;
          break;
        case 'bottomLeft':
          newWidth = Math.max(min.width, startWidth - deltaX);
          newHeight = Math.max(min.height, startHeight + deltaY);
          newX = startXPos + deltaX;
          break;
        case 'bottomRight':
          newWidth = Math.max(min.width, startWidth + deltaX);
          newHeight = Math.max(min.height, startHeight + deltaY);
          break;
      }

      // Ensure element stays within page bounds
      newX = Math.max(0, Math.min(newX, pageInfo.pageWidth - newWidth));
      newY = Math.max(0, Math.min(newY, pageInfo.pageHeight - newHeight));

      // Update element
      if (elementRef.current) {
        elementRef.current.style.left = `${newX}px`;
        elementRef.current.style.top = `${newY}px`;
        elementRef.current.style.width = `${newWidth}px`;
        elementRef.current.style.height = `${newHeight}px`;
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      if (elementRef.current) {
        onUpdate({
          ...element,
          x: parseInt(elementRef.current.style.left, 10),
          y: parseInt(elementRef.current.style.top, 10),
          width: parseInt(elementRef.current.style.width, 10),
          height: parseInt(elementRef.current.style.height, 10),
        });
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
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
      setShowPropertiesToolbar(true);
    } else if (element.type === 'image' && !element.imageData) {
      onImageUpload(element.id);
    } else if (element.type === 'signature' && !element.imageData) {
      onSignatureDraw(element.id);
    }
  };

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
          fontSize: `${textElement.fontSize || 12}px`,
          color: textElement.color || '#000000',
          fontWeight: textElement.fontWeight || 'normal',
          fontStyle: textElement.fontStyle || 'normal',
          textDecoration: textElement.textDecoration || 'none',
          textAlign: textElement.textAlign || 'left',
          width: '100%',
          height: '100%',
          padding: '4px',
          wordWrap: 'break-word',
          overflow: 'hidden'
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
            className={`${styles.renderTextOverley} ${isDragging ? styles.dragging : ''}`}
            onDoubleClick={() => setIsEditing(true)}
            style={textStyle}
          >
            <Typography>
              {element.content || 'Double click to edit text'}
            </Typography>
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

  const resizeHandleStyle: React.CSSProperties = {
    position: 'absolute',
    width: '12px',
    height: '12px',
    background: '#007bff',
    border: '2px solid white',
    borderRadius: '50%',
    zIndex: 101,
    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
    cursor: 'pointer'
  };

  return (
    <>
      {showPropertiesToolbar && element.type === 'text' && (
        <TextPropertiesToolbar
          element={element as TextElement}
          onUpdate={onUpdate}
          position={{ x: position.x, y: position.y }}
          isEdit={isEditing}
        />
      )}
      
      <div
        ref={elementRef}
        style={elementStyle}
        onMouseDown={handleMouseDown}
        onClick={handleElementClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {!isEditing && (
          <>
            <div 
              style={{ ...resizeHandleStyle, top: '-6px', left: '-6px', cursor: 'nw-resize' }}
              onMouseDown={(e) => startResize('topLeft', e)}
            />
            <div 
              style={{ ...resizeHandleStyle, top: '-6px', right: '-6px', cursor: 'ne-resize' }}
              onMouseDown={(e) => startResize('topRight', e)}
            />
            <div 
              style={{ ...resizeHandleStyle, bottom: '-6px', left: '-6px', cursor: 'sw-resize' }}
              onMouseDown={(e) => startResize('bottomLeft', e)}
            />
            <div 
              style={{ ...resizeHandleStyle, bottom: '-6px', right: '-6px', cursor: 'se-resize' }}
              onMouseDown={(e) => startResize('bottomRight', e)}
            />
          </>
        )}

        {showEditButton && !isEditing && !isDragging && !isResizing && (
          <Button 
            className={styles.editButtonBadge}
            onClick={handleEdit}
            onMouseDown={(e: any) => e.stopPropagation()}
            title="Edit"
          >
            <CustomIcon iconName="square-pen" width={12} height={12} customColor="#000000" />
          </Button>
        )}

        {showDeleteButton && !isEditing && !isDragging && !isResizing && (
          <Button 
            className={styles.deleteButtonBadge}
            onClick={handleDelete}
            onMouseDown={(e: any) => e.stopPropagation()}
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