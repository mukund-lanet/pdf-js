'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useSelector, useDispatch } from 'react-redux';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import EmptyMessageComponent from "@trenchaant/pkg-ui-component-library/build/Components/EmptyMessageComponent";
import SimpleLoading from "@trenchaant/pkg-ui-component-library/build/Components/SimpleLoading";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Avatar from "@trenchaant/pkg-ui-component-library/build/Components/Avatar";
import Switch from "@trenchaant/pkg-ui-component-library/build/Components/Switch";
import IconButton from "@trenchaant/pkg-ui-component-library/build/Components/IconButton";
import TeamUserComponent from "@trenchaant/common-component/dist/commonComponent/commonTeamUserComponent/commonTeamUserComponent"
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import { DraggableBlockItemProps, DraggableToolbarItemProps, DRAWER_COMPONENT_CATEGORY, Signer } from '../../../utils/interface';
import { RootState } from '../../../store/reducer/contractManagement.reducer';
// @ts-ignore
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

import { REORDER_PAGE_ELEMENTS, SET_ACTIVE_TOOL, SET_PAGES, TOOLBAR_ITEM, UPDATE_DOCUMENT } from '@/components/contractManagement/store/action/contractManagement.actions';
import ThumbnailPage from '../ThumbnailPage';
import { blocks, fillableFields, noPdfDocument } from '../../../utils/utils';
import { useDrag } from 'react-dnd';

const EditorLeftDrawer: React.FC = () => {
  const drawerComponentType = useSelector((state: RootState) => state?.contractManagement?.drawerComponentCategory);

  const ElementsSidebar: React.FC = () => {

    const dispatch = useDispatch();
    const activeTool = useSelector((state: RootState) => state?.contractManagement?.activeTool);

    const DraggableBlockItem: React.FC<DraggableBlockItemProps> = ({ item, activeTool, dispatch }) => {
      const [{ isDragging }, drag] = useDrag(() => ({
        type: TOOLBAR_ITEM,
        item: { type: item.type, label: item.label },
        collect: (monitor) => ({
          isDragging: monitor.isDragging(),
        }),
      }), [item.type, item.label]);

      return (
        <div
          ref={drag}
          className={styles.elementCard}
          // className={`${styles.elementCard} ${activeTool === item.type ? styles.activeElement : ''}`}
          onClick={() => dispatch({ type: SET_ACTIVE_TOOL, payload: item.type })}
        >
          <div className={styles.dragHandle}>
            <CustomIcon iconName="grip-vertical" width={12} height={12} variant="white" />
          </div>

          <div className={styles.iconWrapper}>
            <div className={styles.elementIcon}>
              <CustomIcon iconName={item.icon} width={20} height={20} />
            </div>
          </div>

          <Typography className={styles.elementLabel}>{item.label}</Typography>
        </div>
      );
    };

    const DraggableToolbarItem: React.FC<DraggableToolbarItemProps> = ({ item, activeTool, dispatch }) => {
      const [{ isDragging }, drag] = useDrag(() => ({
        type: TOOLBAR_ITEM,
        item: { type: item.type, label: item.label },
        collect: (monitor) => ({
          isDragging: monitor.isDragging(),
        }),
      }), [item.type, item.label]);

      return (
        <div
          ref={drag}
          className={styles.elementCard}
          style={{ opacity: isDragging ? 0.5 : 1, cursor: 'grab' }}
          onClick={() => dispatch({ type: SET_ACTIVE_TOOL, payload: item.type })}
        >
          <div className={styles.dragHandle}>
            <CustomIcon iconName="grip-vertical" width={12} height={12} variant="white" />
          </div>
          <div className={styles.elementIcon}>
            <CustomIcon iconName={item.icon} width={20} height={20} />
          </div>
          <Typography className={styles.elementLabel}>{item.label}</Typography>
        </div>
      );
    };

    return (
      <div className={styles.elementsSidebar}>
        <div className={styles.sidebarHeader}>
          <Typography variant="h6" className={styles.sidebarTitle}>Add an Element</Typography>
        </div>

        <div className={styles.sidebarContent}>
          <div className={styles.elementSection}>
            <Typography variant="caption" className={styles.sectionTitle}>BLOCKS</Typography>
            <div className={styles.elementsGrid}>
              <div className={styles.blockToolbarWrapper}>
                {blocks.map((item) => (
                  <DraggableBlockItem
                    key={item.type}
                    item={item}
                    activeTool={activeTool}
                    dispatch={dispatch}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={styles.elementSection}>
            <Typography variant="caption" className={styles.sectionTitle}>FILLABLE FIELDS</Typography>
            <div className={styles.elementsGrid}>
              <div className={styles.fillableToolbarWrapper}>
                {fillableFields.map((item) => (
                  <DraggableToolbarItem
                    key={item.type}
                    item={item}
                    activeTool={activeTool}
                    dispatch={dispatch}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const RecipientsSidebar: React.FC = () => {
    const dispatch = useDispatch();
    const activeDocument = useSelector((state: RootState) => state?.contractManagement?.activeDocument);
    const [users, setUsers] = useState([]);

    const handleSigningOrderChange = (checked: boolean) => {
      if (activeDocument) {
        dispatch({
          type: UPDATE_DOCUMENT,
          payload: {
            ...activeDocument,
            documentId: activeDocument._id,
            documentName: activeDocument.name,
            signers: activeDocument.signers,
            signingOrder: checked
          }
        });
      }
    };

    const handleDeleteSigner = (index: number) => {
      if (activeDocument) {
        const newSigners = activeDocument.signers ? [...activeDocument.signers] : [];
        newSigners.splice(index, 1);
        dispatch({
          type: UPDATE_DOCUMENT,
          payload: {
            ...activeDocument,
            documentId: activeDocument._id,
            documentName: activeDocument.name,
            signers: newSigners,
            signingOrder: activeDocument.signingOrder
          }
        });
      }
    };

    return (
      <div className={styles.recipientsSidebar}>
        <div className={styles.sidebarHeader}>
          <Typography variant="h6" className={styles.sidebarTitle}>Recipients</Typography>
        </div>

        <div className={styles.sidebarContent}>
          <div className={styles.signingOrderSection}>
            <div className={styles.signingOrderHeader}>
              <Switch
                checked={activeDocument?.signingOrder || false}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSigningOrderChange(e.target.checked)}
              />
              <Typography className={styles.signingOrderLabel}>Set signing order</Typography>
            </div>
            <Typography variant="caption" className={styles.signingOrderDescription}>
              Emails are sent sequentially: Next recipient can sign only after the previous one completes their action.
            </Typography>
            <TeamUserComponent
              value={users || []}
              onChange={(selectedUsers: any) => {
                setUsers(selectedUsers.map((user: any) => user?.id))
              }}
              label={`Select Users`}
              twoStepAssign={false}
              isMultiple
              componentName={"user"}
              // isCountPreview={true}
              isPreview={true}
            />
          </div>

          <div className={styles.recipientsList}>
            {activeDocument?.signers?.map((signer: Signer, index: number) => (
              <div key={index} className={styles.recipientItem}>
                <div className={styles.recipientAvatar}>
                  <Avatar>{signer.name.charAt(0).toUpperCase()}</Avatar>
                </div>
                <div className={styles.recipientInfo}>
                  <Typography className={styles.recipientName}>{signer.name}</Typography>
                  <Typography className={styles.recipientEmail}>{signer.email}</Typography>
                  <div className={styles.recipientBadges}>
                    <span className={styles.badgePrimary}>Primary</span>
                    <span className={styles.badgeSigner}>{signer.type}</span>
                  </div>
                </div>
                <div className={styles.recipientActions}>
                  <IconButton size="small">
                    <CustomIcon iconName="edit-2" height={14} width={14} />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDeleteSigner(index)}>
                    <CustomIcon iconName="trash-2" height={14} width={14} />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const ThumbnailSidebar: React.FC = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const pages = useSelector((state: RootState) => state?.contractManagement?.pages || []);
    const [pageIds, setPageIds] = useState<string[]>([]);

    // StrictModeDroppable component
    const StrictModeDroppable = ({ children, ...props }: any) => {
      const [enabled, setEnabled] = useState(false);
      useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
          cancelAnimationFrame(animation);
          setEnabled(false);
        };
      }, []);
      if (!enabled) {
        return null;
      }
      return <Droppable {...props}>{children}</Droppable>;
    };
    
    useEffect(() => {
      // Initialize pageIds based on pages array length
      if (pages && pages.length > 0) {
        if (pageIds.length !== pages.length) {
          setPageIds(Array.from({ length: pages.length }, (_, i) => `page-${i + 1}-${Date.now()}`));
        }
      }
    }, [pages]);

    const onDragEnd = async (result: DropResult) => {
      if (!result.destination) return;

      const sourceIndex = result.source.index;
      const destinationIndex = result.destination.index;

      if (sourceIndex === destinationIndex) return;

      // Reorder local state immediately for UI responsiveness
      const newPageIds = Array.from(pageIds);
      const [movedPageId] = newPageIds.splice(sourceIndex, 1);
      newPageIds.splice(destinationIndex, 0, movedPageId);
      setPageIds(newPageIds);

      try {
        setIsLoading(true);
        
        // Update pages array
        const currentPages = [...pages];
        const [movedPage] = currentPages.splice(sourceIndex, 1);
        currentPages.splice(destinationIndex, 0, movedPage);
        dispatch({ type: SET_PAGES, payload: currentPages });
        
        dispatch({
          type: REORDER_PAGE_ELEMENTS,
          payload: { sourceIndex, destinationIndex }
        });

      } catch (error) {
        console.error('Error reordering pages:', error);
        // Revert local state on error
        setPageIds(pageIds);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className={styles.thumbnailSidebar}>
        <div className={styles.sidebarHeader}>
          <Typography variant="h6" className={styles.sidebarTitle}>Pages</Typography>
        </div>

        <div className={styles.thumbnailContainer}>
          {pages && pages.length > 0 ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <StrictModeDroppable droppableId="thumbnail-pages">
                {(provided: any) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{ height: '100%' }}
                  >
                    {pageIds.map((pageId, index) => (
                      <Draggable key={pageId} draggableId={pageId} index={index}>
                        {/* @ts-ignore */}
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                              ...provided.draggableProps.style,
                              marginBottom: '16px'
                            }}
                          >
                            <ThumbnailPage
                              key={`thumbnail_${pageId}`}
                              pageNumber={index + 1}
                              isLoading={isLoading}
                              dragHandleProps={provided.dragHandleProps}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </StrictModeDroppable>
            </DragDropContext>
          ) : !isLoading ? (
            <div className={styles.noPdfLoaded} >
              <EmptyMessageComponent className={styles.noPdfLoadedEmptyMessage} {...noPdfDocument} />
            </div>
          ) : isLoading && (
            <div className={styles.loadingWrapper}>
              <SimpleLoading />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`${styles.leftSideDrawerWrapper} ${drawerComponentType === DRAWER_COMPONENT_CATEGORY.PAGES ? styles.thumbnailWidth : ''}`}>
      {drawerComponentType === DRAWER_COMPONENT_CATEGORY.ADD_ELEMENTS && (
        <ElementsSidebar />
      )}
      {drawerComponentType === DRAWER_COMPONENT_CATEGORY.PAGES && (
        <ThumbnailSidebar />
      )}
      {drawerComponentType === DRAWER_COMPONENT_CATEGORY.RECIPIENTS && (
        <RecipientsSidebar />
      )}
    </div>
  );
};

export default EditorLeftDrawer;
