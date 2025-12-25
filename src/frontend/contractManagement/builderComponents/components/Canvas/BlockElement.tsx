'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Tooltip from '@trenchaant/pkg-ui-component-library/build/Components/Tooltip';
import { BlockElement as BlockElementType } from '../../../utils/interface';
import { UPDATE_CANVAS_ELEMENT, SET_ACTIVE_ELEMENT_ID, DELETE_CANVAS_ELEMENT } from '../../../store/action/contractManagement.actions';

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
  const [isClicked, setIsClicked] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const debounce = useCallback((func: Function, delay: number) => {
    return (...args: any[]) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }, []);

  const debouncedContentUpdate = useCallback(
    debounce((newContent: string) => {
      if (element.type === 'heading') {
        dispatch({
          type: UPDATE_CANVAS_ELEMENT,
          payload: { ...element, content: newContent }
        });
      }
    }, 500),
    [element, dispatch]
  );

  const debouncedSubtitleUpdate = useCallback(
    debounce((subtitle: string) => {
      if (element.type === 'heading') {
        dispatch({
          type: UPDATE_CANVAS_ELEMENT,
          payload: { ...element, subtitle }
        });
      }
    }, 500),
    [element, dispatch]
  );

  const debouncedTableCellUpdate = useCallback(
    debounce((rowIndex: number, colIndex: number, value: string) => {
      if (element.type === 'table') {
        const newData = element.data ? [...element.data] : [];
        if (!newData[rowIndex]) {
          newData[rowIndex] = [];
        }
        newData[rowIndex][colIndex] = value;
        
        dispatch({
          type: UPDATE_CANVAS_ELEMENT,
          payload: { ...element, data: newData }
        });
      }
    }, 500),
    [element, dispatch]
  );



  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!elementRef.current) return;

      if (!elementRef.current.contains(e.target as Node)) {
        setIsClicked(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleBlockClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClicked(true);
    dispatch({
      type: SET_ACTIVE_ELEMENT_ID,
      payload: element.id
    });
  };

  const getEmbedUrl = (url: string): string | null => {
    if (!url) return null;

    try {
      const urlObj = new URL(url);

      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        let videoId = '';

        if (urlObj.hostname.includes('youtu.be')) {
          videoId = urlObj.pathname.slice(1);
        } else if (urlObj.searchParams.has('v')) {
          videoId = urlObj.searchParams.get('v') || '';
        } else if (urlObj.pathname.includes('/embed/')) {
          return url;
        }

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      if (urlObj.hostname.includes('vimeo.com')) {
        const videoId = urlObj.pathname.split('/').filter(Boolean).pop();
        if (videoId && urlObj.pathname.includes('/video/')) {
          if (videoId) {
            return `https://player.vimeo.com/video/${videoId}`;
          }
          return url;
        }
      }

      if (urlObj.hostname.includes('dailymotion.com') || urlObj.hostname.includes('dai.ly')) {
        let videoId = '';
        if (urlObj.hostname.includes('dai.ly')) {
          videoId = urlObj.pathname.slice(1);
        } else {
          videoId = urlObj.pathname.split('/').filter(Boolean).pop() || '';
        }
        if (videoId) {
          return `https://www.dailymotion.com/embed/video/${videoId}`;
        }
      }

      if (urlObj.hostname.includes('wistia.com')) {
        const videoId = urlObj.pathname.split('/').filter(Boolean).pop();
        if (videoId) {
          return `https://fast.wistia.net/embed/iframe/${videoId}`;
        }
      }

      if (urlObj.hostname.includes('vidyard.com')) {
        const videoId = urlObj.pathname.split('/').filter(Boolean).pop();
        if (videoId) {
          return `https://play.vidyard.com/${videoId}`;
        }
      }

      if (urlObj.hostname.includes('loom.com')) {
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        const videoId = pathParts[pathParts.length - 1];
        if (videoId) {
          return `https://www.loom.com/embed/${videoId}`;
        }
      }

      return url;
    } catch (e) {
      console.error('Error parsing video URL:', e);
      return null;
    }
  };

  const renderContent = () => {
    switch (element.type) {
      case 'heading':
        return (
          <div
            data-html2canvas-ignore
            {...dragHandleProps}
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
              backgroundColor: element.backgroundColor,
              minHeight: "120px"
            }}
          >
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => debouncedContentUpdate(e.currentTarget.innerText || '')}
              className={styles.blockHeadingText}
              style={{
                fontSize: element.fontSize || 32,
                fontWeight: element.fontWeight || '700',
                color: element.color || '#111827',
                textAlign: element.textAlign || 'left',
                fontStyle: element.fontStyle || 'normal',
                textDecoration: element.textDecoration || 'none',
                fontFamily: element.fontFamily || 'Open Sans, sans-serif',
                outline: 'none',
              }}
            >
              {element.content}
            </div>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => debouncedSubtitleUpdate(e.currentTarget.innerText || '')}
              className={styles.blockSubtitleText}
              style={{
                fontSize: element.subtitleFontSize || 16,
                fontWeight: element.subtitleFontWeight || '400',
                color: element.subtitleColor || '#374151',
                textAlign: element.textAlign || 'left',
                fontFamily: element.fontFamily || 'Open Sans, sans-serif',
                outline: 'none'
              }}
              data-placeholder="Add a subtitle"
            >
              {element.subtitle || 'Add a subtitle'}
            </div>
          </div>
        );

      case 'image':
        const imageSource = element.imageUrl || element.imageData;
        return (
          <div
            data-html2canvas-ignore
            {...dragHandleProps}
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
              backgroundColor: element.backgroundColor || (element.imageUrl ? 'transparent' : '#fff'),
              display: 'flex',
              justifyContent: 'center',
              minHeight: "120px"
            }}
          >
            {imageSource ? (
              <img
                src={imageSource}
                alt="Uploaded content"
                style={{
                  width: element.width ? `${element.width}px` : '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: element.imageEffect === 'grayscale' ? 'grayscale(100%)' : 'none'
                }}
              />
            ) : (
              <Typography fontWeight="500" className={styles.blockContentText}>Please select an image</Typography>
            )}
          </div>
        );

      case 'video':
        const embedUrl = element.videoUrl ? getEmbedUrl(element.videoUrl) : null;

        return (
          <div
            data-html2canvas-ignore
            {...dragHandleProps}
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
              backgroundColor: element.backgroundColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: "120px"
            }}
          >
            {embedUrl ? (
              <div className={styles.videoIframeContainer} style={{
                width: element.width ? `${element.width}px` : '100%',
                height: element.height ? `${element.height}px` : '100%',
              }}>
                <iframe
                  src={embedUrl}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  title="Embedded video"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: '4px',
                    pointerEvents: 'none'
                  }}
                />
              </div>
            ) : (
              <Typography fontWeight="500" className={styles.blockContentText}>Please select a video</Typography>
            )}
          </div>
        );

      case 'table':
        return (
          <div
            data-html2canvas-ignore
            {...dragHandleProps}
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
              backgroundColor: element.backgroundColor,
              minHeight: "120px"
            }}
          >
            <table className={styles.blockTable}>
              <tbody contentEditable={true} suppressContentEditableWarning>
                {Array.from({ length: element.rows }).map((_, rowIndex) => (
                  <tr key={rowIndex} >
                    {Array.from({ length: element.columns }).map((_, colIndex) => (
                      <td
                        key={colIndex}
                        contentEditable
                        suppressContentEditableWarning
                        className={styles.blockTableCell}
                        rowSpan={1}
                        colSpan={1}
                        style={{
                          fontSize: element.fontSize,
                          fontWeight: element.fontWeight,
                          color: element.color,
                          textAlign: element.textAlign,
                          fontStyle: element.fontStyle,
                          textDecoration: element.textDecoration,
                          fontFamily: element.fontFamily || 'Open Sans, sans-serif',
                        }}
                        onBlur={(e) => {
                          const value = e.currentTarget.innerText || '';
                          debouncedTableCellUpdate(rowIndex, colIndex, value);
                        }}
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
      className={`${styles.blockElement} ${isDragging ? styles.blockDragging : ''} ${element.type === 'table' ? styles.tableBlock : ''} `}
      onClick={handleBlockClick}
    >
      {/* the hover toolbar */}
      {(isClicked) && !isDragging && (
        <div className={styles.blockToolbar} data-html2canvas-ignore>
          <div className={styles.blockToolbarActions} data-html2canvas-ignore>
            <Tooltip title="Copy" placement="top">
              <span>
                <Button
                  className={styles.blockTooltipIconWrapperCopy}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onCopy(element);
                  }}
                >
                  <CustomIcon iconName="copy" width={16} height={16} variant="white" />
                </Button>
              </span>
            </Tooltip>

            <Tooltip title="Delete" placement="top">
              <span>
                <Button
                  className={styles.blockTooltipIconWrapperDel}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    dispatch({
                      type: DELETE_CANVAS_ELEMENT,
                      payload: element.id
                    });
                  }}
                >
                  <CustomIcon iconName="trash2" width={16} height={16} variant="white" />
                </Button>
              </span>
            </Tooltip>

            {canMoveUp && onMoveUp && (
              <Tooltip title="Move Up" placement="top">
                <span>
                  <Button
                    className={styles.blockTooltipIconWrapper}
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      onMoveUp();
                    }}
                  >
                    <CustomIcon iconName="chevron-up" width={16} height={16} variant="white" />
                  </Button>
                </span>
              </Tooltip>
            )}

            {canMoveDown && onMoveDown && (
              <Tooltip title="Move Down" placement="top">
                <span>
                  <Button
                    className={styles.blockTooltipIconWrapper}
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      onMoveDown();
                    }}
                  >
                    <CustomIcon iconName="chevron-down" width={16} height={16} variant="white" />
                  </Button>
                </span>
              </Tooltip>
            )}
          </div>
        </div>
      )}

      <div className={`${styles.blockContent}`} style={element.type === 'heading' ? {background: "transparent"} : {}} >
        {renderContent()}
      </div>
    </div>
  );
};

export default BlockElement;
