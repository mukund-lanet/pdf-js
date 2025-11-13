import React from "react";
import { PDF_EDITOR_ACTION_TYPES, PdfEditorActionTypes } from '../action/pdfEditor.action';
import { CanvasElement, TextElement } from '../../types';

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
  isLoading: false
};

// Reducer
export const pdfEditorReducer = (
  state: PdfEditorState = initialState,
  action: PdfEditorActionTypes
): PdfEditorState => {
  switch (action.type) {
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
          state.selectedTextElement && state.selectedTextElement.id === action.payload.id && action.payload.type === 'text'
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
      return {
        ...state,
        canvasElements: action.payload
      };

    case PDF_EDITOR_ACTION_TYPES.RESET_EDITOR:
      return {
        ...initialState
      };

    default:
      return state;
  }
};