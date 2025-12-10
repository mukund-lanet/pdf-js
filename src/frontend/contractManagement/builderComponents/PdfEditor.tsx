'use client';
import React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import EditorHeader from './components/Layout/EditorHeader';
import EditorLeftDrawer from './components/Layout/EditorLeftDrawer';
import EditorMainArea from './components/Layout/EditorMainArea';
import EditorRightSidebar from './components/Layout/EditorRightSidebar';
import TextFormattingToolbar from './components/Toolbar/TextFormattingToolbar';
import { RootState, contractManagementReducer } from '../store/reducer/contractManagement.reducer';
import { injectReducer } from '@/components/store';
import { SET_DRAWER_COMPONENT_CATEGORY, UPDATE_MULTIPLE_ELEMENTS } from '../store/action/contractManagement.actions';
import { DRAWER_COMPONENT_CATEGORY } from '../utils/interface';
import Tabs from "@trenchaant/pkg-ui-component-library/build/Components/Tabs";
import Tab from "@trenchaant/pkg-ui-component-library/build/Components/Tab";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import { tabItems } from '../utils/utils';

const PdfEditor: React.FC<{ documentId?: string }> = ({ documentId }) => {
  const dispatch = useDispatch();
  
  // Inject reducer to ensure state is available even on direct load
  React.useEffect(() => {
    injectReducer('contractManagement', contractManagementReducer);
  }, []);

  // Load document data if documentId is provided
  React.useEffect(() => {
    if (documentId) {
      import('../store/action/contractManagement.actions').then(({ loadDocumentById }) => {
        dispatch(loadDocumentById(documentId) as any);
      });
    }
  }, [documentId, dispatch]);

  const drawerComponentType = useSelector((state: RootState) => state?.contractManagement?.drawerComponentCategory);
  const canvasElements = useSelector((state: RootState) => state?.contractManagement?.canvasElements);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // only handle block reordering in the same page
    if (source.droppableId === destination.droppableId && source.droppableId.startsWith('blocks-page-')) {
      if (source.index === destination.index) return;

      // extract the page number from droppableId
      const pageNumber = parseInt(source.droppableId.replace('blocks-page-', ''));

      // get all blocks for this page and sorted by order
      const pageBlocks = canvasElements
        .filter(el => el.page === pageNumber && ['heading', 'image', 'video', 'table'].includes(el.type))
        .sort((a: any, b: any) => a.order - b.order);

      // reorder of the blocks
      const [movedBlock] = pageBlocks.splice(source.index, 1);
      pageBlocks.splice(destination.index, 0, movedBlock);

      // opdate orders
      const updatedBlocks = pageBlocks.map((block, index) => ({
        ...block,
        order: index
      }));

      dispatch({ type: UPDATE_MULTIPLE_ELEMENTS, payload: updatedBlocks });
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <DndProvider backend={HTML5Backend}>
        <div className={styles.pdfEditorContainer}>
          <EditorHeader />

          <div className={styles.textToolbarEditorLeftSidebarWrapper} >
            <Tabs
              indicatorColor="primary"
              textColor="primary"
              value={drawerComponentType}
              className={styles.leftSideTabs}
              onChange={(event: React.SyntheticEvent, newValue: string) => dispatch({ type: SET_DRAWER_COMPONENT_CATEGORY, payload: newValue as DRAWER_COMPONENT_CATEGORY })}
            > 
              {Object.entries(tabItems).map(([value, item]) => (
                <Tab
                  key={value}
                  className={styles.leftSideTab}
                  classes={{ root: styles.leftSideTabRoot }}
                  icon={<CustomIcon iconName={item.icon} height={16} width={16} variant='gray' />}
                  label={item.name}
                  value={value}
                />
              ))}
            </Tabs>
            <TextFormattingToolbar />
          </div>

          <div className={styles.mainContainer}>
            <EditorLeftDrawer />
            <EditorMainArea />
            <EditorRightSidebar />
          </div>
        </div>
      </DndProvider>
    </DragDropContext>
  );
};

export default PdfEditor;