'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Tooltip from '@trenchaant/pkg-ui-component-library/build/Components/Tooltip';
import { BlockElement as BlockElementType } from '../../types';

interface BlockElementProps {
  element: BlockElementType;
  onCopy: (element: BlockElementType) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  isDragging?: boolean;
  dragHandleProps?: any;
}

const BlockElement = ({
  element,
  onCopy,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  isDragging = false,
  dragHandleProps
}: BlockElementProps) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleContentChange = (newContent: string) => {
    if (element.type === 'heading') {
      dispatch({
        type: 'UPDATE_CANVAS_ELEMENT',
        payload: { ...element, content: newContent }
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      dispatch({
        type: 'UPDATE_CANVAS_ELEMENT',
        payload: { ...element, imageData }
      });
    };
    reader.readAsDataURL(file);
  };

  const handleVideoUrlChange = (url: string) => {
    if (element.type === 'video') {
      dispatch({
        type: 'UPDATE_CANVAS_ELEMENT',
        payload: { ...element, videoUrl: url }
      });
    }
  };

  const handleBlockClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: 'SET_ACTIVE_ELEMENT_ID',
      payload: element.id
    });
  };

  const handleSubtitleChange = (subtitle: string) => {
    if (element.type === 'heading') {
      dispatch({
        type: 'UPDATE_CANVAS_ELEMENT',
        payload: { ...element, subtitle }
      });
    }
  };

  const renderContent = () => {
    switch (element.type) {
      case 'heading':
        return (
          <div
            className={styles.blockHeadingContent}
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px',
              ...((element.padding || element.margin) && {
                paddingTop: element.padding?.top,
                paddingRight: element.padding?.right,
                paddingBottom: element.padding?.bottom,
                paddingLeft: element.padding?.left,
                marginTop: element.margin?.top,
                marginRight: element.margin?.right,
                marginBottom: element.margin?.bottom,
                marginLeft: element.margin?.left,
              }),
              backgroundColor: element.backgroundColor
            }}
          >
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange(e.currentTarget.innerText || '')}
              className={styles.blockHeadingText}
              style={{
                fontSize: element.fontSize || 32,
                fontWeight: element.fontWeight || '700',
                outline: 'none',
              }}
            >
              {element.content}
            </div>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleSubtitleChange(e.currentTarget.innerText || '')}
              className={styles.blockSubtitleText}
              style={{
                fontSize: element.subtitleFontSize || 16,
                fontWeight: element.subtitleFontWeight || '400',
                color: element.subtitleColor || '#374151',
                outline: 'none'
              }}
              data-placeholder="Add a subtitle"
            >
              {element.subtitle || 'Add a subtitle'}
            </div>
          </div>
        );

      case 'image':
        return (
          <div
            className={styles.blockImageContent}
            style={{
              ...((element.padding || element.margin) && {
                paddingTop: element.padding?.top,
                paddingRight: element.padding?.right,
                paddingBottom: element.padding?.bottom,
                paddingLeft: element.padding?.left,
                marginTop: element.margin?.top,
                marginRight: element.margin?.right,
                marginBottom: element.margin?.bottom,
                marginLeft: element.margin?.left,
              }),
              backgroundColor: element.backgroundColor,
              // justifyContent: element.align === 'center' ? 'center' : element.align === 'right' ? 'flex-end' : 'flex-start',
              justifyContent: 'center',
              display: 'flex'
            }}
          >
            {element.imageData ? (
              <img
                src={element.imageData}
                alt="Block"
                style={{
                  width: element.width ? `${element.width}px` : '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: element.imageEffect === 'grayscale' ? 'grayscale(100%)' : 'none'
                }}
              />
            ) : (
              <div className={styles.blockImagePlaceholder}>
                <CustomIcon iconName="image" width={48} height={48} />
                <Typography>Click to upload image</Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  id={`image-upload-${element.id}`}
                />
                <label htmlFor={`image-upload-${element.id}`} style={{ cursor: 'pointer' }}>
                  <Button component="span">Upload Image</Button>
                </label>
              </div>
            )}
          </div>
        );

      case 'video':
        return (
          <div
            className={styles.blockVideoContent}
            style={{
              ...((element.padding || element.margin) && {
                paddingTop: element.padding?.top,
                paddingRight: element.padding?.right,
                paddingBottom: element.padding?.bottom,
                paddingLeft: element.padding?.left,
                marginTop: element.margin?.top,
                marginRight: element.margin?.right,
                marginBottom: element.margin?.bottom,
                marginLeft: element.margin?.left,
              }),
              backgroundColor: element.backgroundColor
            }}
          >
            {element.videoUrl ? (
              <video
                src={element.videoUrl}
                controls
                style={{ width: element.width ? `${element.width}px` : '100%', height: '100%' }}
              />
            ) : (
              <div className={styles.blockVideoPlaceholder}>
                <CustomIcon iconName="video" width={48} height={48} />
                <Typography>Enter video URL</Typography>
                <input
                  type="text"
                  placeholder="https://example.com/video.mp4"
                  onChange={(e) => handleVideoUrlChange(e.target.value)}
                  className={styles.videoUrlInput}
                />
              </div>
            )}
          </div>
        );

      case 'table':
        return (
          <div
            className={styles.blockTableContent}
            style={{
              ...((element.padding || element.margin) && {
                paddingTop: element.padding?.top,
                paddingRight: element.padding?.right,
                paddingBottom: element.padding?.bottom,
                paddingLeft: element.padding?.left,
                marginTop: element.margin?.top,
                marginRight: element.margin?.right,
                marginBottom: element.margin?.bottom,
                marginLeft: element.margin?.left,
              }),
              backgroundColor: element.backgroundColor
            }}
          >
            <table className={styles.blockTable}>
              <tbody>
                {Array.from({ length: element.rows }).map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {Array.from({ length: element.columns }).map((_, colIndex) => (
                      <td
                        key={colIndex}
                        contentEditable
                        suppressContentEditableWarning
                        className={styles.blockTableCell}
                      >
                        {element.data?.[rowIndex]?.[colIndex] || ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={elementRef}
      className={`${styles.blockElement} ${isDragging ? styles.blockDragging : ''} ${isHovered ? styles.blockHovered : ''}`}
      // style={{ height: `${height}px`, minHeight: `${MIN_HEIGHT}px` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleBlockClick}
    >
      {/* Hover Toolbar */}
      {isHovered && !isDragging && (
        <div className={styles.blockToolbar} data-html2canvas-ignore>
          <div className={styles.blockToolbarActions}>
            <Tooltip title="Copy" placement="top">
              <Button
                className={styles.blockToolbarButton}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onCopy(element);
                }}
              >
                <CustomIcon iconName="copy" width={16} height={16} variant="white" />
              </Button>
            </Tooltip>

            <Tooltip title="Delete" placement="top">
              <Button
                className={styles.blockToolbarButton}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  dispatch({
                    type: 'DELETE_CANVAS_ELEMENT',
                    payload: element.id
                  });
                }}
              >
                <CustomIcon iconName="trash2" width={16} height={16} variant="white" />
              </Button>
            </Tooltip>

            {canMoveUp && onMoveUp && (
              <Tooltip title="Move Up" placement="top">
                <Button
                  className={styles.blockToolbarButton}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onMoveUp();
                  }}
                >
                  <CustomIcon iconName="chevron-up" width={16} height={16} variant="white" />
                </Button>
              </Tooltip>
            )}

            {canMoveDown && onMoveDown && (
              <Tooltip title="Move Down" placement="top">
                <Button
                  className={styles.blockToolbarButton}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onMoveDown();
                  }}
                >
                  <CustomIcon iconName="chevron-down" width={16} height={16} variant="white" />
                </Button>
              </Tooltip>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className={styles.blockContent}>
        {renderContent()}
      </div>

      {/* Drag Handle Indicator */}
      <div
        className={styles.blockDragHandle}
        data-html2canvas-ignore
        {...dragHandleProps}
      >
        <CustomIcon iconName="grip-horizontal" width={16} height={16} />
      </div>
    </div>
  );
};

export default BlockElement;
