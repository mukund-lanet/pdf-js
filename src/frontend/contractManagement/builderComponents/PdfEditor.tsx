'use client';
import React from 'react';
// @ts-ignore
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import EditorHeader from './components/Layout/EditorHeader';
import EditorLeftDrawer from './components/Layout/EditorLeftDrawer';
import EditorRightSidebar from './components/Layout/EditorRightSidebar';
import TextFormattingToolbar from './components/TextFormattingToolbar';
import { RootState, contractManagementReducer } from '../store/reducer/contractManagement.reducer';
import { injectReducer } from '@/components/store';
import { SET_DRAWER_COMPONENT_CATEGORY, UPDATE_MULTIPLE_ELEMENTS } from '../store/action/contractManagement.actions';
import { DRAWER_COMPONENT_CATEGORY, CanvasElement } from '../utils/interface';
import Tabs from "@trenchaant/pkg-ui-component-library/build/Components/Tabs";
import Tab from "@trenchaant/pkg-ui-component-library/build/Components/Tab";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import { tabItems } from '../utils/utils';
import PDFCanvasViewer from './components/Canvas/PDFCanvasViewer';

const PdfEditor: React.FC<{ documentId?: string }> = ({ documentId }) => {
  const dispatch = useDispatch();

  const business_id = useSelector((state: any) => state?.auth?.business?.id);
  const documents = useSelector((state: RootState) => state?.contractManagement?.documents);

  // Inject reducer to ensure state is available even on direct load
  React.useEffect(() => {
    injectReducer('contractManagement', contractManagementReducer);
  }, []);

  // Load document data if documentId is provided
  React.useEffect(() => {
    if (documentId) {
      import('../store/action/contractManagement.actions').then(({ loadDocumentById }) => {
        dispatch(loadDocumentById(documentId, business_id) as any);
      });
    }
  }, [documentId, dispatch]);

  const drawerComponentType = useSelector((state: RootState) => state?.contractManagement?.drawerComponentCategory);
  const pages = useSelector((state: RootState) => state?.contractManagement?.pages);
  const currentPage = useSelector((state: RootState) => state?.contractManagement?.currentPage);
  const isUnsaved = useSelector((state: RootState) => state?.contractManagement?.isUnsaved);

  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isUnsaved) {
        e.preventDefault();
        e.returnValue = ''; // Standard way to trigger browser confirmation
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isUnsaved]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination} = result;

    // Handle block reordering within the same page
    if (source.droppableId === destination.droppableId && source.droppableId.startsWith('blocks-page-')) {
      if (source.index === destination.index) return;

      // Extract page ID from droppableId (format: blocks-page-{pageId})
      const pageId = source.droppableId.replace('blocks-page-', '');
      
      // Get current page's elements
      const page = pages.find(p => p.id === pageId);
      if (!page) return;

      const pageBlocks = page.elements
        .filter((el: CanvasElement) => ['heading', 'image', 'video', 'table'].includes(el.type))
        .sort((a: any, b: any) => a.order - b.order);

      // Reorder blocks
      const [movedBlock] = pageBlocks.splice(source.index, 1);
      pageBlocks.splice(destination.index, 0, movedBlock);

      // Update orders and dispatch
      const updatedBlocks = pageBlocks.map((block: any, index: number) => ({
        pageId,
        element: { ...block, order: index }
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
            <PDFCanvasViewer />
            <EditorRightSidebar />
          </div>
        </div>
      </DndProvider>
    </DragDropContext>
  );
};

export default PdfEditor;