import React from "react";
import { PDF_EDITOR_ACTION_TYPES, PdfEditorActionTypes } from '../action/pdfEditor.action';
import { CanvasElement, TextElement, DRAWER_COMPONENT_CATEGORY, DocumentVariable } from "../../types";

export interface PdfEditorState {
  pdfBytes: Uint8Array | null;
  totalPages: number;
  currentPage: number;
  canvasElements: CanvasElement[];
  pageDimensions: { [key: number]: { pageWidth: number; pageHeight: number } };
  activeTool: null | 'text' | 'image' | 'signature';
  media: any;
  selectedTextElement: TextElement | null;
  isSignaturePadOpen: boolean;
  signatureForElement: string | null;
  isLoading: boolean;
  drawerComponentCategory?: DRAWER_COMPONENT_CATEGORY;
  activeElementId: string | null;
  documentVariables: DocumentVariable[];
  propertiesDrawerState?: {
    anchorEl: null | HTMLElement;
    isOpen: boolean;
  };
}

export interface RootState {
  pdfEditor: {
    pdfEditorReducer: PdfEditorState;
  };
}

const initialState: PdfEditorState = {
  pdfBytes: null,
  totalPages: 0,
  currentPage: 1,
  canvasElements: [],
  pageDimensions: {},
  activeTool: null,
  media: null,
  selectedTextElement: null,
  isSignaturePadOpen: false,
  signatureForElement: null,
  isLoading: false,
  drawerComponentCategory: DRAWER_COMPONENT_CATEGORY.PAGES,
  activeElementId: null,
  documentVariables: [
    {
      name: 'document.createdDate',
      value: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      isSystem: true
    },
    {
      name: 'document.refNumber',
      value: `P${Math.floor(10000 + Math.random() * 90000)} `,
      isSystem: true
    },
    {
      name: 'document.subAccountName',
      value: "CRMOne",
      isSystem: true
    },
  ],
  propertiesDrawerState: {
    anchorEl: null,
    isOpen: false
  }
};

export const pdfEditorReducer = (
  state: PdfEditorState = initialState,
  action: PdfEditorActionTypes
): PdfEditorState => {
  switch (action.type) {
    case PDF_EDITOR_ACTION_TYPES.SET_PROPERTIES_DRAWER_STATE:
      return {
        ...state,
        propertiesDrawerState: action.payload
      };

    case PDF_EDITOR_ACTION_TYPES.SET_PDF_MEDIA:
      return {
        ...state,
        media: action.payload
      };

    case PDF_EDITOR_ACTION_TYPES.SET_DRAWER_COMPONENT_CATEGORY:
      return {
        ...state,
        drawerComponentCategory: action.payload
      };

    case PDF_EDITOR_ACTION_TYPES.SET_ACTIVE_ELEMENT_ID:
      return {
        ...state,
        activeElementId: action.payload
      };

    case PDF_EDITOR_ACTION_TYPES.ADD_DOCUMENT_VARIABLE:
      return {
        ...state,
        documentVariables: [...state.documentVariables, action.payload]
      };

    case PDF_EDITOR_ACTION_TYPES.DELETE_DOCUMENT_VARIABLE:
      return {
        ...state,
        documentVariables: state.documentVariables.filter(v => v.name !== action.payload)
      };

    case PDF_EDITOR_ACTION_TYPES.UPDATE_DOCUMENT_VARIABLE:
      return {
        ...state,
        documentVariables: state.documentVariables.map(v =>
          v.name === action.payload.name ? action.payload : v
        )
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
        // also update the selectedTextElement if its the one being updated
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
        // clear the selected text element if it's the one being deleted
        selectedTextElement:
          state.selectedTextElement && state.selectedTextElement.id === action.payload
            ? null
            : state.selectedTextElement,
        activeElementId: state.activeElementId === action.payload ? null : state.activeElementId
      };

    case PDF_EDITOR_ACTION_TYPES.ADD_BLOCK_ELEMENT: {
      const { element, pageNumber } = action.payload;
      // calculate the next order for this page
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

      // get all blocks for this page and sorted by order
      const pageBlocks = state.canvasElements
        .filter(el => el.page === pageNumber && ['heading', 'image', 'video', 'table'].includes(el.type))
        .sort((a: any, b: any) => a.order - b.order);

      // get non-block elements
      const otherElements = state.canvasElements.filter(
        el => !(el.page === pageNumber && ['heading', 'image', 'video', 'table'].includes(el.type))
      );

      // reorder the blocks
      const [movedBlock] = pageBlocks.splice(sourceIndex, 1);
      pageBlocks.splice(destinationIndex, 0, movedBlock);

      // update the orders
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
      const updateMap = new Map(updates.map((el: CanvasElement) => [el.id, el]));

      return {
        ...state,
        canvasElements: state.canvasElements.map(el => updateMap.get(el.id) || el)
      };

    case PDF_EDITOR_ACTION_TYPES.RESET_EDITOR:
      return {
        ...initialState
      };

    case PDF_EDITOR_ACTION_TYPES.REORDER_PAGE_ELEMENTS: {
      const { sourceIndex, destinationIndex } = action.payload;
      const sourcePage = sourceIndex + 1;
      const destPage = destinationIndex + 1;

      // Update Canvas Elements
      const updatedElements = state.canvasElements.map(el => {
        if (el.page === sourcePage) {
          return { ...el, page: destPage };
        }

        if (sourcePage < destPage) {
          if (el.page > sourcePage && el.page <= destPage) {
            return { ...el, page: el.page - 1 };
          }
        } else {
          if (el.page >= destPage && el.page < sourcePage) {
            return { ...el, page: el.page + 1 };
          }
        }

        return el;
      });

      const newPageDimensions: { [key: number]: { pageWidth: number; pageHeight: number } } = {};
      Object.entries(state.pageDimensions).forEach(([key, value]) => {
        const pageNum = parseInt(key);
        let newPageNum = pageNum;

        if (pageNum === sourcePage) {
          newPageNum = destPage;
        } else if (sourcePage < destPage) {
          if (pageNum > sourcePage && pageNum <= destPage) {
            newPageNum = pageNum - 1;
          }
        } else {
          if (pageNum >= destPage && pageNum < sourcePage) {
            newPageNum = pageNum + 1;
          }
        }
        newPageDimensions[newPageNum] = value;
      });

      let newCurrentPage = state.currentPage;
      if (state.currentPage === sourcePage) {
        newCurrentPage = destPage;
      } else if (sourcePage < destPage) {
        if (state.currentPage > sourcePage && state.currentPage <= destPage) {
          newCurrentPage = state.currentPage - 1;
        }
      } else {
        if (state.currentPage >= destPage && state.currentPage < sourcePage) {
          newCurrentPage = state.currentPage + 1;
        }
      }

      return {
        ...state,
        canvasElements: updatedElements,
        pageDimensions: newPageDimensions,
        currentPage: newCurrentPage
      };
    }

    default:
      return state;
  }
};