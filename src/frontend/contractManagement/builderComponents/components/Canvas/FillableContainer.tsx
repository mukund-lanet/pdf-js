'use client';
import React from 'react';
import { useDrop, useDragLayer } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import DraggableElement from './DraggableElement';
import { FillableElements, isFillableElement } from '../../../utils/interface';
import { RootState } from '../../../store/reducer/contractManagement.reducer';
import { UPDATE_ELEMENT_IN_PAGE, ADD_ELEMENT_TO_PAGE, SET_ACTIVE_TOOL } from '../../../store/action/contractManagement.actions';

interface FillableContainerProps {
  pageNumber: number;
  containerRef: React.RefObject<HTMLDivElement>;
  elements: FillableElements[];
}

const FillableContainer = ({
  pageNumber,
  containerRef,
  elements
}: FillableContainerProps) => {
  const dispatch = useDispatch();
  // const allElements = useSelector((state: RootState) =>
  //   state?.contractManagement.canvasElements.filter(el => el.page === pageNumber)
  // );
  const fillableElements = elements;

  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const generateId = () => `element_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

  const { isDragging } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
  }));

  const [, drop] = useDrop({
    accept: ['FILLABLE_ELEMENT', 'TOOLBAR_ITEM'],
    drop: (item: { id?: string; type: string; x?: number; y?: number; label?: string }, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const clientOffset = monitor.getClientOffset();

      // handle the existing element move
      if (monitor.getItemType() === 'FILLABLE_ELEMENT' && delta && item.id && item.x !== undefined && item.y !== undefined) {
        const element = fillableElements.find(el => el.id === item.id);
        if (!element) return;

        const newX = Math.round(item.x + delta.x);
        const newY = Math.round(item.y + delta.y);

        dispatch({
          type: UPDATE_ELEMENT_IN_PAGE,
          payload: {
            pageNumber,
            element: {
              ...element,
              x: newX,
              y: newY
            }
          }
        });
        return;
      }

      if (monitor.getItemType() === 'TOOLBAR_ITEM' && clientOffset && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientOffset.x - rect.left;
        const y = clientOffset.y - rect.top;
        const type = item.type;

        // Helper to generate common GHL structure
        const createBaseElement = (type: string, name: string, options: any, width: number, height: number, customProps: any = {}) => ({
          type,
          version: 1,
          id: generateId(),
          children: [],
          component: {
            isDraggable: true,
            name,
            options: {
              isGhost: true,
              ...options
            }
          },
          responsiveStyles: {
            large: {
              paddingTop: "0px",
              paddingBottom: "0px",
              paddingLeft: "0px",
              paddingRight: "0px",
              mobileHide: false,
              desktopHide: false,
              boxShadow: "none",
              borderStyle: "solid",
              borderColor: "#000",
              borderWidth: "0px",
              borderRadius: "0px",
              opacity: 100,
              position: {
                top: parseInt(y.toFixed(0)),
                left: parseInt(x.toFixed(0)),
                width,
                height,
                cols: 25,
                rows: 25,
                xOffset: 0,
                yOffset: 0
              }
            }
          },
          ...customProps
        });

        const elementType = type as 'TextField' | 'Image' | 'Signature' | 'DateField' | 'InitialsField' | 'Checkbox' | 'Text' | 'Video' | 'Table';

        
        let newElement;

        switch (elementType) {
          case 'Text':
            newElement = createBaseElement("Text", "Text Element", {
              text: "Heading",
              subtitle: "Add a subtitle",
              color: "#000000",
              fontFamily: "Open Sans",
              fontSize: "32px",
              fontWeight: "700",
              textAlign: "left",
              lineHeight: "1.2",
              letterSpacing: "normal"
            }, 300, 50);
            break;

          case 'TextField':
            newElement = createBaseElement("TextField", "Text Field Element", {
              text: "",
              required: true,
              fieldId: generateId(),
              src: "",
              recipient: "assignedContact",
              timestamp: null,
              entityName: "contacts",
              placeholder: "Enter value"
            }, 200, 40);
            break;

          case 'Image':
            newElement = createBaseElement("Image", "Image Element", {
              src: "https://via.placeholder.com/150",
              alt: "Image",
              link: "",
              width: "100%",
              height: "auto",
              objectFit: "cover"
            }, 300, 200);
            break;

          case 'Video':
            newElement = createBaseElement("Video", "Video Element", {
              src: "",
              type: "url",
              autoplay: false,
              controls: true,
              loop: false,
              muted: false
            }, 300, 200);
            break;

          case 'Table':
            newElement = createBaseElement("Table", "Table Element", {
              text: "", // Table data structure
              rows: 2,
              cols: 2,
              data: [["", ""], ["", ""]],
              borderColor: "#000000",
              borderWidth: "1px",
              padding: "5px"
            }, 400, 200);
            break;

          case 'Signature':
            newElement = createBaseElement("Signature", "Signature Element", {
              required: true,
              fieldId: generateId(),
              recipient: "assignedContact",
              entityName: "contacts"
            }, 200, 60);
            break;

          case 'DateField':
            newElement = createBaseElement("DateField", "Text Field Element", { // Component name might be reused or specific
              text: "", // Format
              required: true,
              fieldId: generateId(),
              recipient: "assignedContact",
              entityName: "contacts",
              placeholder: "Select Date",
              format: "MM/DD/YYYY"
            }, 150, 40);
            break;

          case 'InitialsField':
            newElement = createBaseElement("InitialsField", "Initials Field Element", {
              required: true,
              fieldId: generateId(),
              recipient: "assignedContact",
              entityName: "contacts"
            }, 100, 50);
            break;

          case 'Checkbox':
            newElement = createBaseElement("Checkbox", "Checkbox Field Element", {
              preChecked: false,
              required: false,
              fieldId: generateId(),
              recipient: "assignedContact",
              entityName: "contacts"
            }, 30, 30);
            break;
        }

        if (newElement) {
          dispatch({
            type: ADD_ELEMENT_TO_PAGE,
            payload: {
              pageNumber,
              element: newElement
            }
          });
        }

        dispatch({ type: SET_ACTIVE_TOOL, payload: null });
      }
    },
  });

  const handleSelect = (id: string, multi: boolean) => {
    if (multi) {
      setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    } else {
      setSelectedIds([id]);
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedIds([]);
    }
  };

  return (
    <div
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      className={styles.fillableContainer}
      onClick={handleContainerClick}
      style={{ pointerEvents: isDragging ? 'auto' : 'none' }}
    >
      {fillableElements.map(element => (
        <div key={element.id} className={styles.fillableElementWrapper}>
          <DraggableElement
            element={element}
            pageNumber={pageNumber}
            isSelected={selectedIds.includes(element.id)}
            onSelect={handleSelect}
          />
        </div>
      ))}
    </div>
  );
};

export default FillableContainer;
