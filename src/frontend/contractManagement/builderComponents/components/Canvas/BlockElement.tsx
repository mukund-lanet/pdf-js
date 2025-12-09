'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Tooltip from '@trenchaant/pkg-ui-component-library/build/Components/Tooltip';
import { BlockElements } from '../../../utils/interface';
import { UPDATE_CANVAS_ELEMENT, SET_ACTIVE_ELEMENT_ID, DELETE_CANVAS_ELEMENT, UPDATE_ELEMENT_IN_PAGE, DELETE_ELEMENT_FROM_PAGE } from '../../../store/action/contractManagement.actions';

interface BlockElementProps {
  element: BlockElements;
  pageNumber: number;
  onCopy: (element: BlockElements) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  isDragging?: boolean;
  dragHandleProps?: any;
}

const BlockElement = ({
  element,
  pageNumber,
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
  const [isClicked, setIsClicked] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleContentChange = (newContent: string) => {
    if (element.type === 'Text') {
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
                text: newContent
              }
            }
          } 
        }
      });
    }
  };

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
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
                src: imageData
              }
            }
          } 
        }
      });
    };
    reader.readAsDataURL(file);
  };

  const handleVideoUrlChange = (url: string) => {
    if (element.type === 'Video') {
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
                src: url
              }
            }
          } 
        }
      });
    }
  };

  const handleBlockClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClicked(true);
    dispatch({
      type: SET_ACTIVE_ELEMENT_ID,
      payload: element.id
    });
  };

  const handleSubtitleChange = (subtitle: string) => {
    if (element.type === 'Text') {
      dispatch({
        type: UPDATE_ELEMENT_IN_PAGE,
        payload: { 
          pageNumber,
          element: { 
            ...element, 
            // Subtitle is not standard in GHL Text element, storing in options for now if needed
            component: {
              ...element.component,
              options: {
                ...element.component.options,
                subtitle
              }
            }
          } 
        }
      });
    }
  };

  // function to convert video URLs to embed format
  const getEmbedUrl = (url: string): string | null => {
    if (!url) return null;

    try {
      const urlObj = new URL(url);

      // YouTube
      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        let videoId = '';

        if (urlObj.hostname.includes('youtu.be')) {
          // Short URL format: https://youtu.be/VIDEO_ID
          videoId = urlObj.pathname.slice(1);
        } else if (urlObj.searchParams.has('v')) {
          // Standard format: https://www.youtube.com/watch?v=VIDEO_ID
          videoId = urlObj.searchParams.get('v') || '';
        } else if (urlObj.pathname.includes('/embed/')) {
          // Already embed format
          return url;
        }

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      // Vimeo
      if (urlObj.hostname.includes('vimeo.com')) {
        const videoId = urlObj.pathname.split('/').filter(Boolean).pop();
        if (videoId && urlObj.pathname.includes('/video/')) {
          return url; // Already embed format
        }
        if (videoId) {
          return `https://player.vimeo.com/video/${videoId}`;
        }
      }

      // Dailymotion
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

      // Wistia
      if (urlObj.hostname.includes('wistia.com')) {
        const videoId = urlObj.pathname.split('/').filter(Boolean).pop();
        if (videoId) {
          return `https://fast.wistia.net/embed/iframe/${videoId}`;
        }
      }

      // Vidyard
      if (urlObj.hostname.includes('vidyard.com')) {
        const videoId = urlObj.pathname.split('/').filter(Boolean).pop();
        if (videoId) {
          return `https://play.vidyard.com/${videoId}`;
        }
      }

      // Loom
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
    const elementStyles = element.responsiveStyles.large;
    switch (element.type) {
      case 'Text':
        return (
          <div
            className={styles.blockHeadingContent}
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px',
              ...((elementStyles) && {
                paddingTop: elementStyles.paddingTop || undefined,
                paddingRight: elementStyles.paddingRight || undefined,
                paddingBottom: elementStyles.paddingBottom || undefined,
                paddingLeft: elementStyles.paddingLeft || undefined,
                marginTop: elementStyles.marginTop || undefined,
                marginRight: elementStyles.marginRight || undefined,
                marginBottom: elementStyles.marginBottom || undefined,
                marginLeft: elementStyles.marginLeft || undefined,
              }),
              backgroundColor: elementStyles.backgroundColor,
              minHeight: "120px"
            }}
          >
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange(e.currentTarget.innerText || '')}
              className={styles.blockHeadingText}
              style={{
                fontSize: elementStyles.fontSize || 32,
                fontWeight: elementStyles.fontWeight || '700',
                color: elementStyles.color || '#111827',
                textAlign: (elementStyles.textAlign as any) || 'left',
                fontStyle: elementStyles.fontStyle || 'normal',
                textDecoration: elementStyles.textDecoration || 'none',
                fontFamily: elementStyles.fontFamily || 'Open Sans, sans-serif',
                outline: 'none',
              }}
            >
              {element.component.options.text}
            </div>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleSubtitleChange(e.currentTarget.innerText || '')}
              className={styles.blockSubtitleText}
              style={{
                fontSize: (element as any).subtitleFontSize || 16,
                fontWeight: (element as any).subtitleFontWeight || '400',
                color: (element as any).subtitleColor || '#374151',
                textAlign: (elementStyles.textAlign as any) || 'left',
                fontFamily: elementStyles.fontFamily || 'Open Sans, sans-serif',
                outline: 'none'
              }}
              data-placeholder="Add a subtitle"
            >
              {(element.component.options as any).subtitle || 'Add a subtitle'}
            </div>
          </div>
        );

      case 'Image':
        const imageSource = element.component.options.src;
        return (
          <div
            className={styles.blockImageContent}
            style={{
              ...((elementStyles) && {
                paddingTop: elementStyles.paddingTop || undefined,
                paddingRight: elementStyles.paddingRight || undefined,
                paddingBottom: elementStyles.paddingBottom || undefined,
                paddingLeft: elementStyles.paddingLeft || undefined,
                marginTop: elementStyles.marginTop || undefined,
                marginRight: elementStyles.marginRight || undefined,
                marginBottom: elementStyles.marginBottom || undefined,
                marginLeft: elementStyles.marginLeft || undefined,
              }),
              backgroundColor: elementStyles.backgroundColor,
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
                  width: elementStyles.width ? elementStyles.width : '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: elementStyles.imageEffect === 'grayscale' ? 'grayscale(100%)' : 'none'
                }}
              />
            ) : (
              <Typography fontWeight="500" className={styles.blockContentText}>Please select an image</Typography>
            )}
          </div>
        );

      case 'Video':
        const embedUrl = element.component.options.src ? getEmbedUrl(element.component.options.src) : null;

        return (
          <div
            className={styles.blockVideoContent}
            style={{
              ...((elementStyles) && {
                paddingTop: elementStyles.paddingTop || undefined,
                paddingRight: elementStyles.paddingRight || undefined,
                paddingBottom: elementStyles.paddingBottom || undefined,
                paddingLeft: elementStyles.paddingLeft || undefined,
                marginTop: elementStyles.marginTop || undefined,
                marginRight: elementStyles.marginRight || undefined,
                marginBottom: elementStyles.marginBottom || undefined,
                marginLeft: elementStyles.marginLeft || undefined,
              }),
              backgroundColor: elementStyles.backgroundColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: "120px"
            }}
          >
            {embedUrl ? (
              <div className={styles.videoIframeContainer} style={{
                width: elementStyles.width ? elementStyles.width : '100%',
                height: elementStyles.height ? elementStyles.height : '100%',
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

      case 'Table':
        return (
          <div
            className={styles.blockTableContent}
            style={{
              ...((elementStyles) && {
                paddingTop: elementStyles.paddingTop || undefined,
                paddingRight: elementStyles.paddingRight || undefined,
                paddingBottom: elementStyles.paddingBottom || undefined,
                paddingLeft: elementStyles.paddingLeft || undefined,
                marginTop: elementStyles.marginTop || undefined,
                marginRight: elementStyles.marginRight || undefined,
                marginBottom: elementStyles.marginBottom || undefined,
                marginLeft: elementStyles.marginLeft || undefined,
              }),
              backgroundColor: elementStyles.backgroundColor,
              minHeight: "120px"
            }}
          >
            <table className={styles.blockTable}>
              <tbody>
                {Array.from({ length: (element as any).rows || 3 }).map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {Array.from({ length: (element as any).columns || 3 }).map((_, colIndex) => (
                      <td
                        key={colIndex}
                        contentEditable
                        suppressContentEditableWarning
                        className={styles.blockTableCell}
                        rowSpan={1}
                        colSpan={1}
                        style={{
                          fontSize: elementStyles.fontSize,
                          fontWeight: elementStyles.fontWeight,
                          color: elementStyles.color,
                          textAlign: (elementStyles.textAlign as any),
                          fontStyle: elementStyles.fontStyle,
                          textDecoration: elementStyles.textDecoration,
                          fontFamily: elementStyles.fontFamily || 'Open Sans, sans-serif',
                        }}
                      >
                        {(element.component.options as any).data?.[rowIndex]?.[colIndex] || ''}
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
      className={`${styles.blockElement} ${isDragging ? styles.blockDragging : ''} ${isHovered ? styles.blockHovered : ''} ${element.type === 'Table' ? styles.tableBlock : ''} `}
      // style={{ height: `${height}px`, minHeight: `${MIN_HEIGHT}px` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleBlockClick}
    >
      {/* the hover toolbar */}
      {(isClicked) && !isDragging && (
        <div className={styles.blockToolbar} data-html2canvas-ignore>
          <div className={styles.blockToolbarActions} data-html2canvas-ignore>
            <Tooltip title="Copy" placement="top">
              <Button
                className={styles.blockToolbarButton}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onCopy(element);
                }}
              >
                <CustomIcon iconName="copy" width={16} height={16} variant="black" />
              </Button>
            </Tooltip>

            <Tooltip title="Delete" placement="top">
              <Button
                className={styles.blockToolbarButton}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  dispatch({
                    type: DELETE_ELEMENT_FROM_PAGE,
                    payload: {
                      pageNumber,
                      elementId: element.id
                    }
                  });
                }}
              >
                <CustomIcon iconName="trash2" width={16} height={16} variant="black" />
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
                  <CustomIcon iconName="chevron-up" width={16} height={16} variant="black" />
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
                  <CustomIcon iconName="chevron-down" width={16} height={16} variant="black" />
                </Button>
              </Tooltip>
            )}
          </div>
        </div>
      )}

      {/* rendering content */}
      <div className={styles.blockContent}>
        {renderContent()}
      </div>

      <Tooltip title="Drag to move" placement="top">
        <div
          className={styles.blockDragHandle}
          data-html2canvas-ignore
          {...dragHandleProps}
        >
          <CustomIcon iconName="grip-horizontal" width={16} height={16} />
        </div>
      </Tooltip>
    </div>
  );
};

export default BlockElement;
