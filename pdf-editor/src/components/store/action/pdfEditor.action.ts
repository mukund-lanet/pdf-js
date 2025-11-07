import { CanvasElement, TextElement } from "../../types";

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
  
  // UI State Actions
  SET_ACTIVE_TOOL: 'SET_ACTIVE_TOOL',
  SET_SELECTED_TEXT_ELEMENT: 'SET_SELECTED_TEXT_ELEMENT',
  SET_SIGNATURE_PAD_OPEN: 'SET_SIGNATURE_PAD_OPEN',
  SET_SIGNATURE_FOR_ELEMENT: 'SET_SIGNATURE_FOR_ELEMENT',
  
  // Batch Operations
  UPDATE_MULTIPLE_ELEMENTS: 'UPDATE_MULTIPLE_ELEMENTS',
  RESET_EDITOR: 'RESET_EDITOR'
} as const;

// Action Interfaces
interface SetPdfBytesAction {
  type: typeof PDF_EDITOR_ACTION_TYPES.SET_PDF_BYTES;
  payload: Uint8Array | null;
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
  | SetActiveToolAction
  | SetSelectedTextElementAction
  | SetSignaturePadOpenAction
  | SetSignatureForElementAction
  | UpdateMultipleElementsAction
  | ResetEditorAction;

// Action Creators
export const pdfEditorActions = {
  setPdfBytes: (pdfBytes: Uint8Array | null): SetPdfBytesAction => ({
    type: PDF_EDITOR_ACTION_TYPES.SET_PDF_BYTES,
    payload: pdfBytes
  }),

  setTotalPages: (totalPages: number): SetTotalPagesAction => ({
    type: PDF_EDITOR_ACTION_TYPES.SET_TOTAL_PAGES,
    payload: totalPages
  }),

  setCurrentPage: (currentPage: number): SetCurrentPageAction => ({
    type: PDF_EDITOR_ACTION_TYPES.SET_CURRENT_PAGE,
    payload: currentPage
  }),

  setPageDimensions: (dimensions: { [key: number]: { pageWidth: number; pageHeight: number } }): SetPageDimensionsAction => ({
    type: PDF_EDITOR_ACTION_TYPES.SET_PAGE_DIMENSIONS,
    payload: dimensions
  }),

  setCanvasElements: (elements: CanvasElement[]): SetCanvasElementsAction => ({
    type: PDF_EDITOR_ACTION_TYPES.SET_CANVAS_ELEMENTS,
    payload: elements
  }),

  addCanvasElement: (element: CanvasElement): AddCanvasElementAction => ({
    type: PDF_EDITOR_ACTION_TYPES.ADD_CANVAS_ELEMENT,
    payload: element
  }),

  updateCanvasElement: (element: CanvasElement): UpdateCanvasElementAction => ({
    type: PDF_EDITOR_ACTION_TYPES.UPDATE_CANVAS_ELEMENT,
    payload: element
  }),

  deleteCanvasElement: (elementId: string): DeleteCanvasElementAction => ({
    type: PDF_EDITOR_ACTION_TYPES.DELETE_CANVAS_ELEMENT,
    payload: elementId
  }),

  setActiveTool: (tool: null | 'text' | 'image' | 'signature'): SetActiveToolAction => ({
    type: PDF_EDITOR_ACTION_TYPES.SET_ACTIVE_TOOL,
    payload: tool
  }),

  setSelectedTextElement: (element: TextElement | null): SetSelectedTextElementAction => ({
    type: PDF_EDITOR_ACTION_TYPES.SET_SELECTED_TEXT_ELEMENT,
    payload: element
  }),

  setSignaturePadOpen: (isOpen: boolean): SetSignaturePadOpenAction => ({
    type: PDF_EDITOR_ACTION_TYPES.SET_SIGNATURE_PAD_OPEN,
    payload: isOpen
  }),

  setSignatureForElement: (elementId: string | null): SetSignatureForElementAction => ({
    type: PDF_EDITOR_ACTION_TYPES.SET_SIGNATURE_FOR_ELEMENT,
    payload: elementId
  }),

  updateMultipleElements: (elements: CanvasElement[]): UpdateMultipleElementsAction => ({
    type: PDF_EDITOR_ACTION_TYPES.UPDATE_MULTIPLE_ELEMENTS,
    payload: elements
  }),

  resetEditor: (): ResetEditorAction => ({
    type: PDF_EDITOR_ACTION_TYPES.RESET_EDITOR
  })
};