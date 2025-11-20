'use client';
import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import BlockElement from './BlockElement';
import { BlockElement as BlockElementType } from '../../types';

interface BlockContainerProps {
  blocks: BlockElementType[];
  pageNumber: number;
  onDelete: (id: string) => void;
  pageWidth: number;
}

const BlockContainer = ({ blocks, pageNumber, onDelete, pageWidth }: BlockContainerProps) => {
  const dispatch = useDispatch();

  // Sort blocks by order
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  const handleCopy = (block: BlockElementType) => {
    const maxOrder = Math.max(...blocks.map(b => b.order), -1);
    const copiedBlock: BlockElementType = {
      ...block,
      id: `element_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
      order: maxOrder + 1
    };
    dispatch({ type: 'ADD_CANVAS_ELEMENT', payload: copiedBlock });
  };

  const handleMoveUp = (currentOrder: number) => {
    const currentIndex = sortedBlocks.findIndex(b => b.order === currentOrder);
    if (currentIndex <= 0) return;

    const prevBlock = sortedBlocks[currentIndex - 1];
    const currentBlock = sortedBlocks[currentIndex];

    // Swap orders
    dispatch({
      type: 'UPDATE_MULTIPLE_ELEMENTS',
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

    // Swap orders
    dispatch({
      type: 'UPDATE_MULTIPLE_ELEMENTS',
      payload: [
        { ...currentBlock, order: nextBlock.order },
        { ...nextBlock, order: currentBlock.order }
      ]
    });
  };

  return (
    <Droppable droppableId={`blocks-page-${pageNumber}`} type="BLOCK">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`${styles.blockContainer} ${snapshot.isDraggingOver ? styles.blockContainerDraggingOver : ''}`}
        >
          {sortedBlocks.length === 0 && (
            <div className={styles.blockContainerPlaceholder}>
              {/* Empty state - blocks can be dropped here */}
            </div>
          )}

          {sortedBlocks.map((block, index) => (
            <Draggable
              key={block.id}
              draggableId={block.id}
              index={index}
            >
              {(dragProvided, dragSnapshot) => (
                <div
                  ref={dragProvided.innerRef}
                  {...dragProvided.draggableProps}
                  className={styles.blockDraggableWrapper}
                >
                  <BlockElement
                    element={block}
                    onDelete={onDelete}
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
