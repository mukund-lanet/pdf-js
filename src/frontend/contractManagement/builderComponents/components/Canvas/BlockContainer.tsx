'use client';
import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import BlockElement from './BlockElement';
import { BlockElements, isBlockElement } from '../../../utils/interface';
import { RootState } from '../../../store/reducer/contractManagement.reducer';
import { ADD_ELEMENT_TO_PAGE, REORDER_ELEMENTS_IN_PAGE } from '../../../store/action/contractManagement.actions';

interface BlockContainerProps {
  pageNumber: number;
  pageWidth: number;
  elements: BlockElements[];
}

const BlockContainer = ({ pageNumber, pageWidth, elements }: BlockContainerProps) => {
  const dispatch = useDispatch(); // Keep dispatch if needed for actions later
  const blocks = elements;

  // sorting the blocks by the order
  const sortedElements = elements; // Elements are already ordered in the array

  const handleCopy = (block: BlockElements) => {
    const copiedBlock: BlockElements = {
      ...block,
      id: `element_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`
    };
    dispatch({
      type: ADD_ELEMENT_TO_PAGE,
      payload: {
        pageNumber,
        element: copiedBlock
      }
    });
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;

    dispatch({
      type: REORDER_ELEMENTS_IN_PAGE,
      payload: {
        pageNumber,
        sourceIndex: index,
        destinationIndex: index - 1
      }
    });
  };
  
  const handleMoveDown = (index: number) => {
    if (index >= sortedElements.length - 1) return;

    dispatch({
      type: REORDER_ELEMENTS_IN_PAGE,
      payload: {
        pageNumber,
        sourceIndex: index,
        destinationIndex: index + 1
      }
    });
  };

  return (
    <div className={styles.blockContainer}>
      <Droppable droppableId={`page-${pageNumber}-blocks`} type="BLOCK">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`${styles.droppableArea} ${snapshot.isDraggingOver ? styles.draggingOver : ''}`}
            style={{ minHeight: '100%' }}
          >
            {sortedElements.map((block, index) => (
              <Draggable
                key={block.id}
                draggableId={block.id}
                index={index}
              >
                {(dragProvided, dragSnapshot) => (
                  <BlockElement
                    element={block}
                    pageNumber={pageNumber}
                    onCopy={handleCopy}
                    canMoveUp={index > 0}
                    canMoveDown={index < sortedElements.length - 1}
                    onMoveUp={() => handleMoveUp(index)}
                    onMoveDown={() => handleMoveDown(index)}
                    isDragging={dragSnapshot.isDragging}
                    dragHandleProps={dragProvided.dragHandleProps}
                    {...dragProvided.draggableProps}
                    ref={dragProvided.innerRef}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default BlockContainer;
