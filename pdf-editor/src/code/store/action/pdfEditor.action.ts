import react from "react";
import { CanvasElement, TextElement, DRAWER_COMPONENT_CATEGORY } from "../../types";

// Action Types
export const PDF_EDITOR_ACTION_TYPES = {
  // PDF Document Actions
  SET_PDF_BYTES: 'SET_PDF_BYTES',
  SET_TOTAL_PAGES: 'SET_TOTAL_PAGES',
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  SET_PAGE_DIMENSIONS: 'SET_PAGE_DIMENSIONS',

  // Canvas Elements Actions
  SET_CANVAS_ELEMENTS: 'SET_CANVAS_ELEMENTS',
  ADD_CANVAS_ELEMENT: 'ADD_CANVAS_ELEMENT',
  UPDATE_CANVAS_ELEMENT: 'UPDATE_CANVAS_ELEMENT',
  DELETE_CANVAS_ELEMENT: 'DELETE_CANVAS_ELEMENT',

  // Block Element Specific Actions
  ADD_BLOCK_ELEMENT: 'ADD_BLOCK_ELEMENT',
  REORDER_BLOCK_ELEMENTS: 'REORDER_BLOCK_ELEMENTS',
  UPDATE_BLOCK_ORDER: 'UPDATE_BLOCK_ORDER',

  // UI State Actions
  SET_ACTIVE_TOOL: 'SET_ACTIVE_TOOL',
  SET_SELECTED_TEXT_ELEMENT: 'SET_SELECTED_TEXT_ELEMENT',
  SET_SIGNATURE_PAD_OPEN: 'SET_SIGNATURE_PAD_OPEN',
  SET_SIGNATURE_FOR_ELEMENT: 'SET_SIGNATURE_FOR_ELEMENT',

  // Batch Operations
  UPDATE_MULTIPLE_ELEMENTS: 'UPDATE_MULTIPLE_ELEMENTS',
  RESET_EDITOR: 'RESET_EDITOR',

  SET_IS_LOADING: 'SET_IS_LOADING',
  SET_DRAWER_COMPONENT_CATEGORY: 'SET_DRAWER_COMPONENT_CATEGORY',
  SET_ACTIVE_ELEMENT_ID: 'SET_ACTIVE_ELEMENT_ID',
} as const;

// Action Interfaces
interface SetPdfBytesAction {
  type: typeof PDF_EDITOR_ACTION_TYPES.SET_PDF_BYTES;
  payload: Uint8Array | null;
}

interface SetDrawerComponentCategoryAction {
  type: typeof PDF_EDITOR_ACTION_TYPES.SET_DRAWER_COMPONENT_CATEGORY;
  payload: DRAWER_COMPONENT_CATEGORY | undefined;
}

interface SetActiveElementIdAction {
  type: typeof PDF_EDITOR_ACTION_TYPES.SET_ACTIVE_ELEMENT_ID;
  payload: string | null;
}

interface SetIsLoadingAction {
  type: typeof PDF_EDITOR_ACTION_TYPES.SET_IS_LOADING;
  payload: boolean;
}

interface SetTotalPagesAction {
  type: typeof PDF_EDITOR_ACTION_TYPES.SET_TOTAL_PAGES;
  payload: number;
}

interface SetCurrentPageAction {
  type: typeof PDF_EDITOR_ACTION_TYPES.SET_CURRENT_PAGE;
  payload: number;
}

interface SetPageDimensionsAction {
  type: typeof PDF_EDITOR_ACTION_TYPES.SET_PAGE_DIMENSIONS;
  payload: { [key: number]: { pageWidth: number; pageHeight: number } };
}

interface SetCanvasElementsAction {
  type: typeof PDF_EDITOR_ACTION_TYPES.SET_CANVAS_ELEMENTS;
  payload: CanvasElement[];
}

interface AddCanvasElementAction {
  type: typeof PDF_EDITOR_ACTION_TYPES.ADD_CANVAS_ELEMENT;
  payload: CanvasElement;
}

interface UpdateCanvasElementAction {
  type: typeof PDF_EDITOR_ACTION_TYPES.UPDATE_CANVAS_ELEMENT;
  payload: CanvasElement;
}

interface DeleteCanvasElementAction {
  type: typeof PDF_EDITOR_ACTION_TYPES.DELETE_CANVAS_ELEMENT;
  payload: string; // element id
}

interface AddBlockElementAction {
  type: typeof PDF_EDITOR_ACTION_TYPES.ADD_BLOCK_ELEMENT;
  payload: {
    element: CanvasElement;
    pageNumber: number;
  };
}

interface ReorderBlockElementsAction {
  type: typeof PDF_EDITOR_ACTION_TYPES.REORDER_BLOCK_ELEMENTS;
  payload: {
    pageNumber: number;
    sourceIndex: number;
    destinationIndex: number;
  };
}

interface UpdateBlockOrderAction {
  type: typeof PDF_EDITOR_ACTION_TYPES.UPDATE_BLOCK_ORDER;
  payload: {
    pageNumber: number;
    blockOrders: { id: string; order: number }[];
  };
}

interface SetActiveToolAction {
  type: typeof PDF_EDITOR_ACTION_TYPES.SET_ACTIVE_TOOL;
  payload: null | 'text' | 'image' | 'signature';
}

interface SetSelectedTextElementAction {
  type: typeof PDF_EDITOR_ACTION_TYPES.SET_SELECTED_TEXT_ELEMENT;
  payload: TextElement | null;
}

interface SetSignaturePadOpenAction {
  type: typeof PDF_EDITOR_ACTION_TYPES.SET_SIGNATURE_PAD_OPEN;
  payload: boolean;
}

interface SetSignatureForElementAction {
  type: typeof PDF_EDITOR_ACTION_TYPES.SET_SIGNATURE_FOR_ELEMENT;
  payload: string | null;
}

interface UpdateMultipleElementsAction {
  type: typeof PDF_EDITOR_ACTION_TYPES.UPDATE_MULTIPLE_ELEMENTS;
  payload: CanvasElement[];
}

interface ResetEditorAction {
  type: typeof PDF_EDITOR_ACTION_TYPES.RESET_EDITOR;
}

// Union type for all actions
export type PdfEditorActionTypes =
  | SetPdfBytesAction
  | SetTotalPagesAction
  | SetCurrentPageAction
  | SetPageDimensionsAction
  | SetCanvasElementsAction
  | AddCanvasElementAction
  | UpdateCanvasElementAction
  | DeleteCanvasElementAction
  | AddBlockElementAction
  | ReorderBlockElementsAction
  | UpdateBlockOrderAction
  | SetActiveToolAction
  | SetSelectedTextElementAction
  | SetSignaturePadOpenAction
  | SetSignatureForElementAction
  | UpdateMultipleElementsAction
  | ResetEditorAction
  | SetIsLoadingAction
  | SetDrawerComponentCategoryAction
  | SetActiveElementIdAction;
