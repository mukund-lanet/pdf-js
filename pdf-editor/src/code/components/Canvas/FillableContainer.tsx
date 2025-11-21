'use client';
import React, { useRef, useEffect } from 'react';
import Moveable from 'react-moveable';
import Selecto from 'react-selecto';
import { useDispatch, useSelector } from 'react-redux';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';
import DraggableElement from './DraggableElement';
import { FillableFieldElement, CanvasElement, isFillableElement } from '../../types';
import { RootState } from '../../store/reducer/pdfEditor.reducer';

interface FillableContainerProps {
  pageNumber: number;
  containerRef: React.RefObject<HTMLDivElement>;
}

const FillableContainer = ({
  pageNumber,
  containerRef
}: FillableContainerProps) => {
  const dispatch = useDispatch();
  const fillableElements = useSelector((state: RootState) =>
    state.pdfEditor.pdfEditorReducer.canvasElements.filter(el => el.page === pageNumber && isFillableElement(el))
  ) as FillableFieldElement[];

  const [targets, setTargets] = React.useState<any>([]);
  const moveableRef = useRef<Moveable>(null);
  const selectoRef = useRef<Selecto>(null);

  useEffect(() => {
    if (moveableRef.current) {
      moveableRef.current.updateRect();
    }
  }, [fillableElements]);

  return (
    <>
      <Moveable
        ref={moveableRef}
        draggable={true}
        resizable={true}
        rotatable={false}
        keepRatio={false}
        renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
        target={targets}
        onClickGroup={e => {
          selectoRef.current!.clickTarget(e.inputEvent, e.inputTarget);
        }}
        onDrag={e => {
          e.target.style.transform = e.transform;
        }}
        onDragEnd={e => {
          const target = e.target as HTMLElement;
          const id = target.getAttribute('data-id');
          if (!id) return;

          const element = fillableElements.find(el => el.id === id);
          if (!element) return;

          const translate = e.lastEvent?.translate;

          if (translate) {
            const [translateX, translateY] = translate;

            if (!isNaN(translateX) && !isNaN(translateY)) {
              const newElement = {
                ...element,
                x: element.x + translateX,
                y: element.y + translateY
              };

              dispatch({ type: 'UPDATE_CANVAS_ELEMENT', payload: newElement });
            }

            target.style.transform = '';
          }
        }}
        onDragGroup={e => {
          e.events.forEach(ev => {
            ev.target.style.transform = ev.transform;
          });
        }}
        onDragGroupEnd={e => {
          const updates: CanvasElement[] = [];

          e.events.forEach(ev => {
            const target = ev.target as HTMLElement;
            const id = target.getAttribute('data-id');
            if (!id) return;

            const element = fillableElements.find(el => el.id === id);
            if (!element) return;

            const translate = ev.lastEvent?.translate;

            if (translate) {
              const [translateX, translateY] = translate;

              if (!isNaN(translateX) && !isNaN(translateY)) {
                updates.push({
                  ...element,
                  x: element.x + translateX,
                  y: element.y + translateY
                });
              }

              target.style.transform = '';
            }
          });

          if (updates.length > 0) {
            dispatch({ type: 'UPDATE_MULTIPLE_ELEMENTS', payload: updates });
          }
        }}
        onResize={e => {
          e.target.style.width = `${e.width}px`;
          e.target.style.height = `${e.height}px`;
          e.target.style.transform = e.drag.transform;
        }}
        onResizeEnd={e => {
          const target = e.target as HTMLElement;
          const id = target.getAttribute('data-id');
          if (!id) return;

          const element = fillableElements.find(el => el.id === id);
          if (!element) return;

          const transform = target.style.transform;
          const match = transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);

          let translateX = 0;
          let translateY = 0;
          if (match) {
            translateX = parseFloat(match[1]);
            translateY = parseFloat(match[2]);
          }

          const newElement = {
            ...element,
            width: e.lastEvent?.width || element.width,
            height: e.lastEvent?.height || element.height,
            x: element.x + translateX,
            y: element.y + translateY
          };

          dispatch({ type: 'UPDATE_CANVAS_ELEMENT', payload: newElement });
          target.style.transform = '';
        }}
        onResizeGroup={e => {
          e.events.forEach(ev => {
            ev.target.style.width = `${ev.width}px`;
            ev.target.style.height = `${ev.height}px`;
            ev.target.style.transform = ev.drag.transform;
          });
        }}
        onResizeGroupEnd={e => {
          const updates: CanvasElement[] = [];

          e.events.forEach(ev => {
            const target = ev.target as HTMLElement;
            const id = target.getAttribute('data-id');
            if (!id) return;

            const element = fillableElements.find(el => el.id === id);
            if (!element) return;

            const transform = target.style.transform;
            const match = transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);

            let translateX = 0;
            let translateY = 0;
            if (match) {
              translateX = parseFloat(match[1]);
              translateY = parseFloat(match[2]);
            }

            updates.push({
              ...element,
              width: ev.lastEvent?.width || element.width,
              height: ev.lastEvent?.height || element.height,
              x: element.x + translateX,
              y: element.y + translateY
            });

            target.style.transform = '';
          });

          if (updates.length > 0) {
            dispatch({ type: 'UPDATE_MULTIPLE_ELEMENTS', payload: updates });
          }
        }}
      ></Moveable>

      <Selecto
        ref={selectoRef}
        dragContainer={containerRef.current}
        selectableTargets={[".draggable-element"]}
        hitRate={0}
        selectByClick={true}
        selectFromInside={false}
        toggleContinueSelect={["shift"]}
        ratio={0}
        onDragStart={e => {
          const moveable = moveableRef.current!;
          const target = e.inputEvent.target;

          if (
            !containerRef.current ||
            moveable.isMoveableElement(target) ||
            targets.some((t: any) => t === target || t.contains(target))
          ) {
            e.stop();
          }
        }}
        onSelectEnd={e => {
          const moveable = moveableRef.current!;
          if (e.isDragStart) {
            e.inputEvent.preventDefault();

            moveable.waitToChangeTarget().then(() => {
              moveable.dragStart(e.inputEvent);
            });
          }
          setTargets(e.selected);
        }}
      ></Selecto>

      <div className={styles.fillableContainer}>
        {fillableElements.map(element => (
          <div key={element.id} className={styles.fillableElementWrapper}>
            <DraggableElement
              element={element}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default FillableContainer;
