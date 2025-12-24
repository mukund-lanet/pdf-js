'use client';
import React from 'react';
// @ts-ignore
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import BlockElement from './BlockElement';
import { BlockElement as BlockElementType, isBlockElement } from '../../../utils/interface';
import { RootState } from '../../../store/reducer/contractManagement.reducer';
import { ADD_CANVAS_ELEMENT, UPDATE_MULTIPLE_ELEMENTS } from '../../../store/action/contractManagement.actions';

interface BlockContainerProps {
  pageNumber: number;
  pageWidth: number;
}

const BlockContainer = ({ pageNumber, pageWidth }: BlockContainerProps) => {
  const dispatch = useDispatch();
  const blocks = useSelector((state: RootState) =>
    state?.contractManagement.canvasElements.filter(el => el.page === pageNumber && isBlockElement(el))
  ) as BlockElementType[];

  // sorting the blocks by the order
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  const handleCopy = (block: BlockElementType) => {
    const maxOrder = Math.max(...blocks.map(b => b.order), -1);
    const copiedBlock: BlockElementType = {
      ...block,
      id: `element_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
      order: maxOrder + 1
    };
    dispatch({ type: ADD_CANVAS_ELEMENT, payload: copiedBlock });
  };

  const handleMoveUp = (currentOrder: number) => {
    const currentIndex = sortedBlocks.findIndex(b => b.order === currentOrder);
    if (currentIndex <= 0) return;

    const prevBlock = sortedBlocks[currentIndex - 1];
    const currentBlock = sortedBlocks[currentIndex];

    // swappinf the orders
    dispatch({
      type: UPDATE_MULTIPLE_ELEMENTS,
      payload: [
        { ...currentBlock, order: prevBlock.order },
        { ...prevBlock, order: currentBlock.order }
      ]
    });
  };
  
  const handleMoveDown = (currentOrder: number) => {
    const currentIndex = sortedBlocks.findIndex(b => b.order === currentOrder);
    if (currentIndex >= sortedBlocks.length - 1) return;

    const nextBlock = sortedBlocks[currentIndex + 1];
    const currentBlock = sortedBlocks[currentIndex];
    
    // swapping the orders
    dispatch({
      type: UPDATE_MULTIPLE_ELEMENTS,
      payload: [
        { ...currentBlock, order: nextBlock.order },
        { ...nextBlock, order: currentBlock.order }
      ]
    });
  };

  return (
    <Droppable droppableId={`blocks-page-${pageNumber}`} type="BLOCK">
      {(provided: any, snapshot: any) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`${styles.blockContainer} ${snapshot.isDraggingOver ? styles.blockContainerDraggingOver : ''}`}
        >
          {sortedBlocks.length === 0 && (
            <div className={styles.blockContainerPlaceholder}>
              {/* Empty state - blocks dropzone */}
            </div>
          )}

          {sortedBlocks.map((block, index) => (
            <Draggable
              key={block.id}
              draggableId={block.id}
              index={index}
            >
              {(dragProvided: any, dragSnapshot: any) => (
                <div
                  ref={dragProvided.innerRef}
                  {...dragProvided.draggableProps}
                  className={styles.blockDraggableWrapper}
                >
                  <BlockElement
                    element={block}
                    onCopy={handleCopy}
                    onMoveUp={() => handleMoveUp(block.order)}
                    onMoveDown={() => handleMoveDown(block.order)}
                    canMoveUp={index > 0}
                    canMoveDown={index < sortedBlocks.length - 1}
                    isDragging={dragSnapshot.isDragging}
                    dragHandleProps={dragProvided.dragHandleProps}
                  />
                </div>
              )}
            </Draggable>
          ))}

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default BlockContainer;
