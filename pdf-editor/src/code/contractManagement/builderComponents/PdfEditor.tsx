'use client';
import React, { useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import { injectReducer } from 'components/store';
import reducer from './store/index'
import EditorHeader from './components/Layout/EditorHeader';
import EditorLeftSidebar from './components/Layout/EditorLeftSidebar';
import EditorLeftDrawer from './components/Layout/EditorLeftDrawer';
import EditorMainArea from './components/Layout/EditorMainArea';
import EditorRightSidebar from './components/Layout/EditorRightSidebar';
import TextFormattingToolbar from './components/Toolbar/TextFormattingToolbar';
import { RootState } from './store/reducer/pdfEditor.reducer';

const PdfEditor = () => {
  const dispatch = useDispatch();
  const canvasElements = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.canvasElements);

  useEffect(() => { injectReducer("pdfEditor", reducer) }, []);

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

      dispatch({ type: 'UPDATE_MULTIPLE_ELEMENTS', payload: updatedBlocks });
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <DndProvider backend={HTML5Backend}>
        <div className={styles.pdfEditorContainer}>
          <EditorHeader />

          <div className={styles.textToolbarEditorLeftSidebarWrapper} >
            <EditorLeftSidebar />
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