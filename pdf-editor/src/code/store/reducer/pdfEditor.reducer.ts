import React from "react";
import { PDF_EDITOR_ACTION_TYPES, PdfEditorActionTypes } from '../action/pdfEditor.action';
import { CanvasElement, DRAWER_COMPONENT_CATEGORY, TextElement } from '../../types';

// State Interface
export interface PdfEditorState {
  pdfBytes: Uint8Array | null;
  totalPages: number;
  currentPage: number;
  canvasElements: CanvasElement[];
  pageDimensions: { [key: number]: { pageWidth: number; pageHeight: number } };
  activeTool: null | 'text' | 'image' | 'signature';
  selectedTextElement: TextElement | null;
  isSignaturePadOpen: boolean;
  signatureForElement: string | null;
  isLoading: boolean;
  drawerComponentCategory?: DRAWER_COMPONENT_CATEGORY;
}

export interface RootState {
  pdfEditor: {
    pdfEditorReducer: PdfEditorState;
  };
}

// Initial State
const initialState: PdfEditorState = {
  pdfBytes: null,
  totalPages: 0,
  currentPage: 1,
  canvasElements: [],
  pageDimensions: {},
  activeTool: null,
  selectedTextElement: null,
  isSignaturePadOpen: false,
  signatureForElement: null,
  isLoading: false,
  drawerComponentCategory: undefined,
};

// Reducer
export const pdfEditorReducer = (
  state: PdfEditorState = initialState,
  action: PdfEditorActionTypes
): PdfEditorState => {
  switch (action.type) {
    case PDF_EDITOR_ACTION_TYPES.SET_DRAWER_COMPONENT_CATEGORY:
      return {
        ...state,
        drawerComponentCategory: action.payload
      };
    case PDF_EDITOR_ACTION_TYPES.SET_IS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case PDF_EDITOR_ACTION_TYPES.SET_PDF_BYTES:
      return {
        ...state,
        pdfBytes: action.payload
      };

    case PDF_EDITOR_ACTION_TYPES.SET_TOTAL_PAGES:
      return {
        ...state,
        totalPages: action.payload
      };

    case PDF_EDITOR_ACTION_TYPES.SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload
      };

    case PDF_EDITOR_ACTION_TYPES.SET_PAGE_DIMENSIONS:
      return {
        ...state,
        pageDimensions: action.payload
      };

    case PDF_EDITOR_ACTION_TYPES.SET_CANVAS_ELEMENTS:
      return {
        ...state,
        canvasElements: action.payload
      };

    case PDF_EDITOR_ACTION_TYPES.ADD_CANVAS_ELEMENT:
      return {
        ...state,
        canvasElements: [...state.canvasElements, action.payload]
      };

    case PDF_EDITOR_ACTION_TYPES.UPDATE_CANVAS_ELEMENT:
      return {
        ...state,
        canvasElements: state.canvasElements.map(el =>
          el.id === action.payload.id ? action.payload : el
        ),
        // Also update selectedTextElement if it's the one being updated
        selectedTextElement:
          state.selectedTextElement && state.selectedTextElement.id === action.payload.id && action.payload.type === 'text-field'
            ? (action.payload as TextElement)
            : state.selectedTextElement
      };

    case PDF_EDITOR_ACTION_TYPES.DELETE_CANVAS_ELEMENT:
      const filteredElements = state.canvasElements.filter(el => el.id !== action.payload);
      return {
        ...state,
        canvasElements: filteredElements,
        // Clear selected text element if it's the one being deleted
        selectedTextElement:
          state.selectedTextElement && state.selectedTextElement.id === action.payload
            ? null
            : state.selectedTextElement
      };

    case PDF_EDITOR_ACTION_TYPES.ADD_BLOCK_ELEMENT: {
      const { element, pageNumber } = action.payload;
      // Calculate the next order for this page
      const pageBlocks = state.canvasElements.filter(
        el => el.page === pageNumber && ['heading', 'image', 'video', 'table'].includes(el.type)
      );
      const maxOrder = pageBlocks.length > 0
        ? Math.max(...pageBlocks.map((el: any) => el.order || 0))
        : -1;

      const blockWithOrder = {
        ...element,
        order: maxOrder + 1
      };

      return {
        ...state,
        canvasElements: [...state.canvasElements, blockWithOrder]
      };
    }

    case PDF_EDITOR_ACTION_TYPES.REORDER_BLOCK_ELEMENTS: {
      const { pageNumber, sourceIndex, destinationIndex } = action.payload;

      // Get all blocks for this page, sorted by order
      const pageBlocks = state.canvasElements
        .filter(el => el.page === pageNumber && ['heading', 'image', 'video', 'table'].includes(el.type))
        .sort((a: any, b: any) => a.order - b.order);

      // Get non-block elements
      const otherElements = state.canvasElements.filter(
        el => !(el.page === pageNumber && ['heading', 'image', 'video', 'table'].includes(el.type))
      );

      // Reorder the blocks
      const [movedBlock] = pageBlocks.splice(sourceIndex, 1);
      pageBlocks.splice(destinationIndex, 0, movedBlock);

      // Update orders
      const updatedBlocks = pageBlocks.map((block, index) => ({
        ...block,
        order: index
      }));

      return {
        ...state,
        canvasElements: [...otherElements, ...updatedBlocks]
      };
    }

    case PDF_EDITOR_ACTION_TYPES.UPDATE_BLOCK_ORDER: {
      const { pageNumber, blockOrders } = action.payload;

      // Create a map of id to new order
      const orderMap = new Map(blockOrders.map(item => [item.id, item.order]));

      return {
        ...state,
        canvasElements: state.canvasElements.map(el => {
          if (el.page === pageNumber && orderMap.has(el.id)) {
            return {
              ...el,
              order: orderMap.get(el.id)!
            };
          }
          return el;
        })
      };
    }

    case PDF_EDITOR_ACTION_TYPES.SET_ACTIVE_TOOL:
      return {
        ...state,
        activeTool: action.payload
      };

    case PDF_EDITOR_ACTION_TYPES.SET_SELECTED_TEXT_ELEMENT:
      return {
        ...state,
        selectedTextElement: action.payload
      };

    case PDF_EDITOR_ACTION_TYPES.SET_SIGNATURE_PAD_OPEN:
      return {
        ...state,
        isSignaturePadOpen: action.payload
      };

    case PDF_EDITOR_ACTION_TYPES.SET_SIGNATURE_FOR_ELEMENT:
      return {
        ...state,
        signatureForElement: action.payload
      };

    case PDF_EDITOR_ACTION_TYPES.UPDATE_MULTIPLE_ELEMENTS:
      const updates = action.payload;
      // Create a map for faster lookup
      const updateMap = new Map(updates.map((el: CanvasElement) => [el.id, el]));

      return {
        ...state,
        canvasElements: state.canvasElements.map(el => updateMap.get(el.id) || el)
      };

    case PDF_EDITOR_ACTION_TYPES.RESET_EDITOR:
      return {
        ...initialState
      };

    default:
      return state;
  }
};