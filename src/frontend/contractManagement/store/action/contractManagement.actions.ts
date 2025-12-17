import { AppDispatch } from '..';
import { RootState } from '../reducer/contractManagement.reducer';
import { axiosInstance } from 'components/util/axiosConfig';
import { showMessage } from 'components/store/actions';
import { DIALOG_DRAWER_NAMES, PageDimension } from '../../utils/interface';

// API Constants
export const API_URL_PREFIX = '/api';

// Action Types
export const SET_DOCUMENTS_LIST = 'SET_DOCUMENTS_LIST';
export const SET_CONTRACTS_LIST = 'SET_CONTRACTS_LIST';
export const SET_SETTINGS_DATA = 'SET_SETTINGS_DATA';
export const SET_DOCUMENT_ACTIVE_FILTER = 'CONTRACT_MANAGEMENT_SET_DOCUMENT_ACTIVE_FILTER';
export const SET_CONTRACT_ACTIVE_FILTER = 'CONTRACT_MANAGEMENT_SET_CONTRACT_ACTIVE_FILTER';
export const TOGGLE_FOLDER = 'CONTRACT_MANAGEMENT_TOGGLE_FOLDER';
export const SET_DIALOG_STATE = "SET_DIALOG_STATE";
export const SET_IDENTITY_VERIFICATION_SETTINGS = "SET_IDENTITY_VERIFICATION_SETTINGS";
export const SET_GLOBAL_DOCUMENT_SETTINGS = "SET_GLOBAL_DOCUMENT_SETTINGS";
export const SET_BRANDING_CUSTOMIZATION_SETTINGS = "SET_BRANDING_CUSTOMIZATION_SETTINGS";
export const CREATE_NEW_DOCUMENT = "CREATE_NEW_DOCUMENT";
export const UPLOAD_DOCUMENT_PDF = "UPLOAD_DOCUMENT_PDF";
export const SET_ACTIVE_DOCUMENT = "SET_ACTIVE_DOCUMENT";
export const UPDATE_DOCUMENT = "UPDATE_DOCUMENT";
export const SET_DOCUMENT_DRAWER_MODE = "SET_DOCUMENT_DRAWER_MODE";

// PDF Editor Action Types
export const SET_PDF_BYTES = 'SET_PDF_BYTES';
export const SET_TOTAL_PAGES = 'SET_TOTAL_PAGES';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
export const SET_PAGE_DIMENSIONS = 'SET_PAGE_DIMENSIONS';
export const SET_CANVAS_ELEMENTS = 'SET_CANVAS_ELEMENTS';
export const ADD_CANVAS_ELEMENT = 'ADD_CANVAS_ELEMENT';
export const UPDATE_CANVAS_ELEMENT = 'UPDATE_CANVAS_ELEMENT';
export const DELETE_CANVAS_ELEMENT = 'DELETE_CANVAS_ELEMENT';
export const ADD_BLOCK_ELEMENT = 'ADD_BLOCK_ELEMENT';
export const REORDER_BLOCK_ELEMENTS = 'REORDER_BLOCK_ELEMENTS';
export const UPDATE_BLOCK_ORDER = 'UPDATE_BLOCK_ORDER';
export const SET_ACTIVE_TOOL = 'SET_ACTIVE_TOOL';
export const SET_SELECTED_TEXT_ELEMENT = 'SET_SELECTED_TEXT_ELEMENT';
export const SET_SIGNATURE_PAD_OPEN = 'SET_SIGNATURE_PAD_OPEN';
export const SET_SIGNATURE_FOR_ELEMENT = 'SET_SIGNATURE_FOR_ELEMENT';
export const UPDATE_MULTIPLE_ELEMENTS = 'UPDATE_MULTIPLE_ELEMENTS';
export const RESET_EDITOR = 'RESET_EDITOR';
export const REORDER_PAGE_ELEMENTS = 'REORDER_PAGE_ELEMENTS';
export const SET_IS_LOADING = 'SET_IS_LOADING';
export const SET_DRAWER_COMPONENT_CATEGORY = 'SET_DRAWER_COMPONENT_CATEGORY';
export const SET_ACTIVE_ELEMENT_ID = 'SET_ACTIVE_ELEMENT_ID';
export const ADD_DOCUMENT_VARIABLE = 'ADD_DOCUMENT_VARIABLE';
export const DELETE_DOCUMENT_VARIABLE = 'DELETE_DOCUMENT_VARIABLE';
export const UPDATE_DOCUMENT_VARIABLE = 'UPDATE_DOCUMENT_VARIABLE';
export const SET_PROPERTIES_DRAWER_STATE = 'SET_PROPERTIES_DRAWER_STATE';
export const SET_PDF_MEDIA = 'SET_PDF_MEDIA';
export const FILLABLE_ELEMENT = 'FILLABLE_ELEMENT';
export const TOOLBAR_ITEM = 'TOOLBAR_ITEM';
export const SET_DOCUMENT_TYPE = 'SET_DOCUMENT_TYPE';
export const SET_UPLOAD_PDF_URL = 'SET_UPLOAD_PDF_URL';
export const SET_PAGES = 'SET_PAGES';

// Dialog/Drawer Names Type
export type DialogName = DIALOG_DRAWER_NAMES;

// Action Interfaces
export interface SetDocumentActiveFilterAction {
  type: typeof SET_DOCUMENT_ACTIVE_FILTER;
  payload: string;
}

export interface SetContractActiveFilterAction {
  type: typeof SET_CONTRACT_ACTIVE_FILTER;
  payload: string;
}

export interface SetDialogStateAction {
  type: typeof SET_DIALOG_STATE;
  payload: {
    dialogName: DialogName;
    isOpen: boolean;
  };
}

export interface SetIdentityVerificationSettings {
  type: typeof SET_IDENTITY_VERIFICATION_SETTINGS;
  payload: {
    isVarifyOn: boolean;
    verificationMethod: string;
    isRequireAllSigners: boolean;
    isRequirePhone: boolean;
  };
}

export interface SetBrandingCustomizationSettings {
  type: typeof SET_BRANDING_CUSTOMIZATION_SETTINGS;
  payload: {
    senderName: string;
    senderEmail: string;
    emailSubjectLine: string;
    emailMessage: string;
    ctaButtonText: string;
    footerText: string;
    companyName: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logo: any;
  };
}

export interface SetGlobalDocumentSettings {
  type: typeof SET_GLOBAL_DOCUMENT_SETTINGS;
  payload: {
    senderName: string;
    senderEmail: string;
    emailSubject: string;
    emailTemplate: string;
    redirectDateNotification: boolean;
    dueDateNotification: boolean;
    completionNotification: boolean;
    reminderNotification: boolean;
    daysBeforeDueDate: number;
  };
}

export interface CreateNewDocumentAction {
  type: typeof CREATE_NEW_DOCUMENT;
  payload: {
    documentName: string;
    signers: any[];
    signingOrder?: boolean;
  };
}

export interface UploadDocumentPdfAction {
  type: typeof UPLOAD_DOCUMENT_PDF;
  payload: {
    documentName: string;
    file: File;
    signers: any[];
  };
}

export interface SetActiveDocumentAction {
  type: typeof SET_ACTIVE_DOCUMENT;
  payload: any | null; // DocumentItem or null
}

export interface UpdateDocumentAction {
  type: typeof UPDATE_DOCUMENT;
  payload: {
    documentId: string;
    documentName: string;
    signers: any[];
    signingOrder?: boolean;
    canvasElements?: CanvasElement[];
    pageDimensions?: { [key: number]: PageDimension };
    pages?: Page[];
  };
}

export interface SetDocumentDrawerModeAction {
  type: typeof SET_DOCUMENT_DRAWER_MODE;
  payload: 'create' | 'upload' | 'edit' | null;
}

// PDF Editor Action Interfaces
import { CanvasElement, TextElement, DRAWER_COMPONENT_CATEGORY, DocumentVariable, Page } from '../../utils/interface';

interface SetPdfBytesAction {
  type: typeof SET_PDF_BYTES;
  payload: Uint8Array | null;
}

interface SetPropertiesDrawerStateAction {
  type: typeof SET_PROPERTIES_DRAWER_STATE;
  payload: {
    anchorEl: null | HTMLElement;
    isOpen: boolean;
  };
}

interface SetPdfMediaAction {
  type: typeof SET_PDF_MEDIA;
  payload: any;
}

interface SetDocumentTypeAction {
  type: typeof SET_DOCUMENT_TYPE;
  payload: 'upload-existing' | 'new_document' | null;
}

interface SetUploadPdfUrlAction {
  type: typeof SET_UPLOAD_PDF_URL;
  payload: string | null;
}

interface SetPagesAction {
  type: typeof SET_PAGES;
  payload: Page[];
}

interface SetDrawerComponentCategoryAction {
  type: typeof SET_DRAWER_COMPONENT_CATEGORY;
  payload: DRAWER_COMPONENT_CATEGORY;
}

interface SetActiveElementIdAction {
  type: typeof SET_ACTIVE_ELEMENT_ID;
  payload: string | null;
}

interface AddDocumentVariableAction {
  type: typeof ADD_DOCUMENT_VARIABLE;
  payload: DocumentVariable;
}

interface DeleteDocumentVariableAction {
  type: typeof DELETE_DOCUMENT_VARIABLE;
  payload: string; // name
}

interface UpdateDocumentVariableAction {
  type: typeof UPDATE_DOCUMENT_VARIABLE;
  payload: DocumentVariable;
}

interface SetIsLoadingAction {
  type: typeof SET_IS_LOADING;
  payload: boolean;
}

interface SetTotalPagesAction {
  type: typeof SET_TOTAL_PAGES;
  payload: number;
}

interface SetCurrentPageAction {
  type: typeof SET_CURRENT_PAGE;
  payload: number;
}

interface SetPageDimensionsAction {
  type: typeof SET_PAGE_DIMENSIONS;
  payload: { [key: number]: { pageWidth: number; pageHeight: number } };
}

interface SetCanvasElementsAction {
  type: typeof SET_CANVAS_ELEMENTS;
  payload: CanvasElement[];
}

interface AddCanvasElementAction {
  type: typeof ADD_CANVAS_ELEMENT;
  payload: CanvasElement;
}

interface UpdateCanvasElementAction {
  type: typeof UPDATE_CANVAS_ELEMENT;
  payload: CanvasElement;
}

interface DeleteCanvasElementAction {
  type: typeof DELETE_CANVAS_ELEMENT;
  payload: string;
}

interface AddBlockElementAction {
  type: typeof ADD_BLOCK_ELEMENT;
  payload: {
    element: CanvasElement;
    pageNumber: number;
  };
}

interface ReorderBlockElementsAction {
  type: typeof REORDER_BLOCK_ELEMENTS;
  payload: {
    pageNumber: number;
    sourceIndex: number;
    destinationIndex: number;
  };
}

interface UpdateBlockOrderAction {
  type: typeof UPDATE_BLOCK_ORDER;
  payload: {
    pageNumber: number;
    blockOrders: { id: string; order: number }[];
  };
}

interface SetActiveToolAction {
  type: typeof SET_ACTIVE_TOOL;
  payload: null | 'text' | 'image' | 'signature';
}

interface SetSelectedTextElementAction {
  type: typeof SET_SELECTED_TEXT_ELEMENT;
  payload: TextElement | null;
}

interface SetSignaturePadOpenAction {
  type: typeof SET_SIGNATURE_PAD_OPEN;
  payload: boolean;
}

interface SetSignatureForElementAction {
  type: typeof SET_SIGNATURE_FOR_ELEMENT;
  payload: string | null;
}

interface UpdateMultipleElementsAction {
  type: typeof UPDATE_MULTIPLE_ELEMENTS;
  payload: CanvasElement[];
}

interface ResetEditorAction {
  type: typeof RESET_EDITOR;
}

interface ReorderPageElementsAction {
  type: typeof REORDER_PAGE_ELEMENTS;
  payload: {
    sourceIndex: number;
    destinationIndex: number;
  };
}

interface SetDocumentsListAction {
  type: typeof SET_DOCUMENTS_LIST;
  payload: any[];
}

interface SetContractsListAction {
  type: typeof SET_CONTRACTS_LIST;
  payload: any[];
}

interface SetSettingsDataAction {
  type: typeof SET_SETTINGS_DATA;
  payload: any;
}

// Union type for all Contract Management actions
export type ContractManagementAction =
  | SetDocumentActiveFilterAction
  | SetContractActiveFilterAction
  | SetDialogStateAction
  | SetIdentityVerificationSettings
  | SetGlobalDocumentSettings
  | SetGlobalDocumentSettings
  | SetBrandingCustomizationSettings
  | CreateNewDocumentAction
  | UploadDocumentPdfAction
  | SetActiveDocumentAction
  | UpdateDocumentAction
  | SetDocumentDrawerModeAction
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
  | SetActiveElementIdAction
  | AddDocumentVariableAction
  | DeleteDocumentVariableAction
  | UpdateDocumentVariableAction
  | SetPropertiesDrawerStateAction
  | SetPdfMediaAction
  | SetDocumentTypeAction
  | SetUploadPdfUrlAction
  | SetPagesAction
  | ReorderPageElementsAction
  | SetDocumentsListAction
  | SetContractsListAction
  | SetSettingsDataAction;

// Action Creators
export const setDocumentActiveFilter = (filter: string): AppDispatch => {
  return async (dispatch: AppDispatch) => {
    dispatch({
      type: SET_DOCUMENT_ACTIVE_FILTER,
      payload: filter,
    });
  };
};

export const setContractActiveFilter = (filter: string): AppDispatch => {
  return async (dispatch: AppDispatch) => {
    dispatch({
      type: SET_CONTRACT_ACTIVE_FILTER,
      payload: filter,
    });
  };
};

export const setDialogDrawerState = (dialogName: DialogName, isOpen: boolean): AppDispatch => {
  return async (dispatch: AppDispatch) => {
    dispatch({
      type: SET_DIALOG_STATE,
      payload: { dialogName, isOpen },
    });
  };
};

export const setIdentityVerificationSettings = (open: { isVarifyOn: boolean; verificationMethod: string; isRequireAllSigners: boolean; isRequirePhone: boolean }): AppDispatch => {
  return async (dispatch: AppDispatch) => {
    dispatch({
      type: SET_IDENTITY_VERIFICATION_SETTINGS,
      payload: open,
    });
  };
};

export const setGlobalDocumentSettings = (globalDocumentSettings: { senderName: string; senderEmail: string; emailSubject: string; emailTemplate: string; redirectDateNotification: boolean; dueDateNotification: boolean; completionNotification: boolean; reminderNotification: boolean; daysBeforeDueDate: number }): AppDispatch => {
  return async (dispatch: AppDispatch) => {
    dispatch({
      type: SET_GLOBAL_DOCUMENT_SETTINGS,
      payload: globalDocumentSettings,
    });
  };
};

export const setBrandingCustomizationSettings = (brandingCustomizationSettings: { senderName: string; senderEmail: string; emailSubjectLine: string; emailMessage: string; ctaButtonText: string; footerText: string; companyName: string; primaryColor: string; secondaryColor: string; accentColor: string; logo: any }): AppDispatch => {
  return async (dispatch: AppDispatch) => {
    dispatch({
      type: SET_BRANDING_CUSTOMIZATION_SETTINGS,
      payload: brandingCustomizationSettings,
    });
  };
};


export const createNewDocument = (data: { documentName: string; signers: any[]; signingOrder?: boolean }): AppDispatch => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const currentState = getState();
      // const currentBusiness = currentState.auth?.business;

      dispatch({
        type: SET_IS_LOADING,
        payload: true,
      });

      const response = await axiosInstance({
        method: 'post',
        // url: `${API_URL_PREFIX}/documents?business_id=${currentBusiness?.id}`,
        url: `http://localhost:8080/api/documents?business_id=${"HY7IAUl86AUMMqVbzGKn"}`,
        isFromLocal: true,
        data: {
          name: data.documentName,
          signers: data.signers,
          signingOrder: data.signingOrder || false,
          status: 'draft',
          documentType: 'new_document',
        },
      });

      if (response.status === 201 && response.data) {
        dispatch({
          type: CREATE_NEW_DOCUMENT,
          payload: response.data,
        });

        dispatch(showMessage({
          message: `Document "${data.documentName}" created successfully`,
          variant: 'success',
        }));

        // Refresh documents list
        dispatch(getDocuments());

        return response.data;
      }
    } catch (error: any) {
      console.error('Create document error:', error);
      console.error('Error response:', error.response);
      dispatch(showMessage({
        message: error.response?.data?.message || 'Failed to create document',
        variant: 'error',
      }));
      return null;
    } finally {
      dispatch({
        type: SET_IS_LOADING,
        payload: false,
      });
    }
  };
};

export const uploadDocumentPdf = (data: { documentName: string; fileUrl: string; signers: any[]; pdfBytes?: Uint8Array }): AppDispatch => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      // const currentState = getState();
      // const currentBusiness = currentState.auth?.business;

      dispatch({
        type: SET_IS_LOADING,
        payload: true,
      });

      const response = await axiosInstance({
        method: 'post',
        // url: `${API_URL_PREFIX}/documents/upload?business_id=${currentBusiness?.id}`,
        url: `http://localhost:8080/api/documents/upload?business_id=${"HY7IAUl86AUMMqVbzGKn"}`,
        isFromLocal: true,
        data: {
          documentName: data.documentName,
          signers: data.signers,
          uploadPath: data.fileUrl || '',
        },
      });

      if (response.status === 201 && response.data) {
        dispatch({
          type: UPLOAD_DOCUMENT_PDF,
          payload: response.data,
        });

        // If pdfBytes are provided, set them in the store
        if (data.pdfBytes) {
          dispatch({
            type: SET_PDF_BYTES,
            payload: data.pdfBytes,
          });
        }

        dispatch(showMessage({
          message: `Document "${data.documentName}" uploaded successfully`,
          variant: 'success',
        }));

        // Refresh documents list
        dispatch(getDocuments());

        return response.data;
      }
    } catch (error: any) {
      dispatch(showMessage({
        message: error.response?.data?.message || 'Failed to upload document',
        variant: 'error',
      }));
      return null;
    } finally {
      dispatch({
        type: SET_IS_LOADING,
        payload: false,
      });
    }
  };
};

export const setActiveDocument = (document: any | null): AppDispatch => {
  return async (dispatch: AppDispatch) => {
    dispatch({
      type: SET_ACTIVE_DOCUMENT,
      payload: document,
    });
  };
};

export const updateDocument = (data: {
  documentId: string | undefined;
  documentName: string;
  signers: any[];
  signingOrder?: boolean;
  canvasElements?: CanvasElement[];
  pageDimensions?: { [key: number]: PageDimension };
  totalPages?: number;
  pages?: Page[];
}): AppDispatch => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      // const currentState = getState();
      // const currentBusiness = currentState?.auth?.business;

      dispatch({
        type: SET_IS_LOADING,
        payload: true,
      });

      const response = await axiosInstance({
        method: 'put',
        // url: `${API_URL_PREFIX}/documents/${data.documentId}?business_id=${currentBusiness?.id}`,
        url: `http://localhost:8080/api/documents/${data.documentId}?business_id=${"HY7IAUl86AUMMqVbzGKn"}`,
        isFromLocal: true,
        data: {
          name: data.documentName,
          signers: data.signers,
          signingOrder: data.signingOrder,
          canvasElements: data.canvasElements,
          pageDimensions: data.pageDimensions,
          totalPages: data.totalPages,
          pages: data.pages,
        },
      });

      if (response.status === 200 && response.data) {
        dispatch({
          type: UPDATE_DOCUMENT,
          payload: response.data,
        });

        dispatch(showMessage({
          message: `Document "${data.documentName}" updated successfully`,
          variant: 'success',
        }));

        // Refresh documents list
        dispatch(getDocuments());

        return response.data;
      }
    } catch (error: any) {
      dispatch(showMessage({
        message: error.response?.data?.message || 'Failed to update document',
        variant: 'error',
      }));
      return null;
    } finally {
      dispatch({
        type: SET_IS_LOADING,
        payload: false,
      });
    }
  };
};

export const setDocumentDrawerMode = (mode: 'create' | 'upload' | 'edit' | null): AppDispatch => {
  return async (dispatch: AppDispatch) => {
    dispatch({
      type: SET_DOCUMENT_DRAWER_MODE,
      payload: mode,
    });
  };
};

export const setUploadPdfUrl = (url: string | null): AppDispatch => {
  return async (dispatch: AppDispatch) => {
    dispatch({
      type: SET_UPLOAD_PDF_URL,
      payload: url,
    });
  };
};

// ============ Document API Actions ============

export const getDocuments = (): AppDispatch => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const currentState = getState();
      // const currentBusiness = currentState.auth?.business;

      const response = await axiosInstance({
        method: 'get',
        url: `http://localhost:8080/api/documents?business_id=${"HY7IAUl86AUMMqVbzGKn"}`,
        isFromLocal: true,
      });

      if (response.status === 200 && response.data) {
        dispatch({
          type: SET_DOCUMENTS_LIST,
          payload: response.data,
        });
      }
    } catch (error: any) {
      console.error('Failed to fetch documents:', error);
    }
  };
};

export const getDocumentById = (id: string | undefined): AppDispatch => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const currentState = getState();
      // const currentBusiness = currentState.auth?.business; 

      dispatch({
        type: SET_IS_LOADING,
        payload: true,
      });

      const response = await axiosInstance({
        method: 'get',
        url: `http://localhost:8080/api/documents/${id}?business_id=${"HY7IAUl86AUMMqVbzGKn"}`,
        isFromLocal: true,
      });

      if (response.status === 200 && response.data) {
        dispatch(setActiveDocument(response.data));
        return response.data;
      }
    } catch (error: any) {
      dispatch(showMessage({
        message: error.response?.data?.message || 'Failed to fetch document',
        variant: 'error',
      }));
      return null;
    } finally {
      dispatch({
        type: SET_IS_LOADING,
        payload: false,
      });
    }
  };
};

export const loadDocumentById = (id: string): AppDispatch => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Invalid document ID');
      }

      dispatch({
        type: SET_IS_LOADING,
        payload: true,
      });

      const response = await axiosInstance({
        method: 'get',
        url: `http://localhost:8080/api/documents/${id}?business_id=${"HY7IAUl86AUMMqVbzGKn"}`,
        isFromLocal: true,
      });

      if (!response.data) {
        throw new Error('Document not found');
      }

      const document = response.data;

      dispatch(setActiveDocument(document));

      if (document.uploadPath) {

        try {
          const pdfResponse = await fetch(document.uploadPath);
          if (!pdfResponse.ok) {
            throw new Error(`Failed to fetch PDF: ${pdfResponse.status} ${pdfResponse.statusText}`);
          }

          const arrayBuffer = await pdfResponse.arrayBuffer();

          if (arrayBuffer.byteLength === 0) {
            throw new Error('PDF file is empty');
          }

          const pdfBytes = new Uint8Array(arrayBuffer);
          const { PDFDocument } = await import('pdf-lib');

          let pages = document.pages;

          // Fallback: If no pages metadata exists, initialize it from the PDF
          if (!pages || pages.length === 0) {
            const pdfDocForCount = await PDFDocument.load(arrayBuffer);
            const pageCount = pdfDocForCount.getPageCount();
            pages = Array.from({ length: pageCount }, (_, i) => ({
              fromPdf: true,
              originalPdfPageIndex: i,
              // pageSrc: document.uploadPath // Optional
            }));

            // We must set this to state so the editor knows about it
            dispatch({
              type: SET_PAGES,
              payload: pages
            });
          }

          if (pages && pages.length > 0) {
            // Dispatch pages state immediately
            dispatch({
              type: SET_PAGES,
              payload: pages
            });

            // Reconstruction Logic
            // If any page is NOT from PDF, we need to reconstruct
            const needsReconstruction = pages.some((p: any) => !p.fromPdf);

            if (needsReconstruction) {
              const originalPdfDoc = await PDFDocument.load(arrayBuffer);
              const newPdfDoc = await PDFDocument.create();

              for (const pageInfo of pages) {
                if (pageInfo.fromPdf && typeof pageInfo.originalPdfPageIndex === 'number') {
                  const [copiedPage] = await newPdfDoc.copyPages(originalPdfDoc, [pageInfo.originalPdfPageIndex]);
                  newPdfDoc.addPage(copiedPage);
                } else {
                  // Blank page
                  newPdfDoc.addPage([600, 800]);
                }
              }
              const reconstructedBytes = await newPdfDoc.save();

              dispatch({
                type: SET_PDF_BYTES,
                payload: reconstructedBytes,
              });

              dispatch({
                type: SET_TOTAL_PAGES,
                payload: newPdfDoc.getPageCount(),
              });
            } else {
              // If all pages are from PDF and in order, just load the original
              const pdfDoc = await PDFDocument.load(arrayBuffer);
              dispatch({
                type: SET_PDF_BYTES,
                payload: pdfBytes,
              });

              dispatch({
                type: SET_TOTAL_PAGES,
                payload: pdfDoc.getPageCount(),
              });
            }
          } else {
            // Should not happen due to fallback, but safe default
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            dispatch({
              type: SET_PDF_BYTES,
              payload: pdfBytes,
            });

            dispatch({
              type: SET_TOTAL_PAGES,
              payload: pdfDoc.getPageCount(),
            });
          }

        } catch (pdfError: any) {
          console.error('Error loading PDF:', pdfError);
          dispatch(showMessage({
            message: `Failed to load PDF file: ${pdfError.message || 'Unknown error'}`,
            variant: 'warning',
          }));
          // Continue loading other document data even if PDF fails
        }
      } else {
        // Handle "New Document" (No uploadPath)
        try {
          const { PDFDocument } = await import('pdf-lib');
          const newPdfDoc = await PDFDocument.create();
          let pages = document.pages;

          if (pages && pages.length > 0) {
            dispatch({
              type: SET_PAGES,
              payload: pages
            });

            for (const pageInfo of pages) {
              // For new documents, we assume all pages are blank or constructed, 
              // unless we support mixing uploaded pages into new docs later.
              // For now, just add blank pages.
              newPdfDoc.addPage([600, 800]);
            }
          } else {
            // Default initialization for new document: 1 Blank Page
            newPdfDoc.addPage([600, 800]);

            // Initialize pages metadata
            const initialPages: Page[] = [{ fromPdf: false }];
            dispatch({
              type: SET_PAGES,
              payload: initialPages
            });
          }

          const pdfBytes = await newPdfDoc.save();

          dispatch({
            type: SET_PDF_BYTES,
            payload: pdfBytes,
          });

          dispatch({
            type: SET_TOTAL_PAGES,
            payload: newPdfDoc.getPageCount(),
          });

        } catch (error) {
          console.error('Error creating new document PDF:', error);
          dispatch(showMessage({
            message: 'Failed to initialize new document',
            variant: 'error',
          }));
        }
      }

      // Step 4: Load canvas elements
      if (document.canvasElements && Array.isArray(document.canvasElements)) {
        dispatch({
          type: SET_CANVAS_ELEMENTS,
          payload: document.canvasElements,
        });
      } else {
        dispatch({
          type: SET_CANVAS_ELEMENTS,
          payload: [],
        });
      }

      // Step 5: Load page dimensions
      if (document.pageDimensions) {
        // Convert Map to plain object if needed
        const dimensionsObj = document.pageDimensions instanceof Map
          ? Object.fromEntries(document.pageDimensions)
          : document.pageDimensions;

        dispatch({
          type: SET_PAGE_DIMENSIONS,
          payload: dimensionsObj,
        });
      }

      // Step 6: Set document type
      if (document.documentType) {
        dispatch({
          type: SET_DOCUMENT_TYPE,
          payload: document.documentType,
        });
      }

      // Step 7: Set current page to 1
      dispatch({
        type: SET_CURRENT_PAGE,
        payload: 1,
      });

      return document;

    } catch (error: any) {
      console.error('Error loading document:', error);

      // Provide user-friendly error messages based on error type
      let errorMessage = 'Failed to load document';

      if (error.response?.status === 404) {
        errorMessage = 'Document not found. It may have been deleted.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied. You do not have permission to view this document.';
      } else if (error.message === 'Invalid document ID') {
        errorMessage = 'Invalid document ID format.';
      } else if (error.message === 'Network Error' || !navigator.onLine) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      dispatch(showMessage({
        message: errorMessage,
        variant: 'error',
      }));

      // Redirect to dashboard on critical errors
      if (error.response?.status === 404 || error.message === 'Invalid document ID') {
        // Give user time to see the error message before redirecting
        setTimeout(() => {
          const businessKey = window.location.pathname.split('/')[1];
          window.location.href = `/${businessKey}/contract-management`;
        }, 2000);
      }

      return null;
    } finally {
      dispatch({
        type: SET_IS_LOADING,
        payload: false,
      });
    }
  };
};

export const deleteDocument = (id: string, documentName: string): AppDispatch => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const currentState = getState();
      // const currentBusiness = currentState.auth?.business;

      dispatch({
        type: SET_IS_LOADING,
        payload: true,
      });

      const response = await axiosInstance({
        method: 'delete',
        url: `http://localhost:8080/api/documents/${id}?business_id=${"HY7IAUl86AUMMqVbzGKn"}`,
        isFromLocal: true,
      });

      if (response.status === 200) {
        dispatch(showMessage({
          message: `Document "${documentName}" deleted successfully`,
          variant: 'success',
        }));

        // Refresh documents list
        dispatch(getDocuments());
      }
    } catch (error: any) {
      dispatch(showMessage({
        message: error.response?.data?.message || 'Failed to delete document',
        variant: 'error',
      }));
    } finally {
      dispatch({
        type: SET_IS_LOADING,
        payload: false,
      });
    }
  };
};

// ============ Contract API Actions ============

export const getContracts = (): AppDispatch => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const currentState = getState();
      // const currentBusiness = currentState.auth?.business;

      const response = await axiosInstance({
        method: 'get',
        url: `http://localhost:8080/api/contracts?business_id=${"HY7IAUl86AUMMqVbzGKn"}`,
        isFromLocal: true,
      });

      if (response.status === 200 && response.data) {
        dispatch({
          type: SET_CONTRACTS_LIST,
          payload: response.data,
        });
      }
    } catch (error: any) {
      console.error('Failed to fetch contracts:', error);
    }
  };
};

export const createContract = (contractData: any): AppDispatch => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const currentState = getState();
      // const currentBusiness = currentState.auth?.business;

      dispatch({
        type: SET_IS_LOADING,
        payload: true,
      });

      const response = await axiosInstance({
        method: 'post',
        url: `http://localhost:8080/api/contracts?business_id=${"HY7IAUl86AUMMqVbzGKn"}`,
        isFromLocal: true,
        data: contractData,
      });

      if (response.status === 201 && response.data) {
        dispatch(showMessage({
          message: `Contract "${contractData.name}" created successfully`,
          variant: 'success',
        }));

        dispatch(getContracts());
        return response.data;
      }
    } catch (error: any) {
      dispatch(showMessage({
        message: error.response?.data?.message || 'Failed to create contract',
        variant: 'error',
      }));
      return null;
    } finally {
      dispatch({
        type: SET_IS_LOADING,
        payload: false,
      });
    }
  };
};

export const updateContract = (id: string, contractData: any): AppDispatch => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const currentState = getState();
      // const currentBusiness = currentState.auth?.business;

      dispatch({
        type: SET_IS_LOADING,
        payload: true,
      });

      const response = await axiosInstance({
        method: 'put',
        url: `http://localhost:8080/api/contracts/${id}?business_id=${"HY7IAUl86AUMMqVbzGKn"}`,
        isFromLocal: true,
        data: contractData,
      });

      if (response.status === 200 && response.data) {
        dispatch(showMessage({
          message: `Contract "${contractData.name}" updated successfully`,
          variant: 'success',
        }));

        dispatch(getContracts());
        return response.data;
      }
    } catch (error: any) {
      dispatch(showMessage({
        message: error.response?.data?.message || 'Failed to update contract',
        variant: 'error',
      }));
      return null;
    } finally {
      dispatch({
        type: SET_IS_LOADING,
        payload: false,
      });
    }
  };
};

export const deleteContract = (id: string, contractName: string): AppDispatch => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const currentState = getState();
      // const currentBusiness = currentState.auth?.business;

      dispatch({
        type: SET_IS_LOADING,
        payload: true,
      });

      const response = await axiosInstance({
        method: 'delete',
        url: `http://localhost:8080/api/contracts/${id}?business_id=${"HY7IAUl86AUMMqVbzGKn"}`,
        isFromLocal: true,
      });

      if (response.status === 200) {
        dispatch(showMessage({
          message: `Contract "${contractName}" deleted successfully`,
          variant: 'success',
        }));

        dispatch(getContracts());
      }
    } catch (error: any) {
      dispatch(showMessage({
        message: error.response?.data?.message || 'Failed to delete contract',
        variant: 'error',
      }));
    } finally {
      dispatch({
        type: SET_IS_LOADING,
        payload: false,
      });
    }
  };
};

// ============ Settings API Actions ============

export const getSettings = (): AppDispatch => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const currentState = getState();
      // const currentBusiness = currentState.auth?.business;

      const response = await axiosInstance({
        method: 'get',
        url: `http://localhost:8080/api/settings?business_id=${"HY7IAUl86AUMMqVbzGKn"}`,
        isFromLocal: true,
      });

      if (response.status === 200 && response.data) {
        dispatch({
          type: SET_SETTINGS_DATA,
          payload: response.data,
        });

        // Also update individual settings in Redux
        if (response.data.identityVerification) {
          dispatch(setIdentityVerificationSettings(response.data.identityVerification));
        }
        if (response.data.globalDocument) {
          dispatch(setGlobalDocumentSettings(response.data.globalDocument));
        }
        if (response.data.branding) {
          dispatch(setBrandingCustomizationSettings(response.data.branding));
        }
      }
    } catch (error: any) {
      console.error('Failed to fetch settings:', error);
    }
  };
};

export const updateSettings = (settingsData: any): AppDispatch => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const currentState = getState();
      // const currentBusiness = currentState.auth?.business;

      dispatch({
        type: SET_IS_LOADING,
        payload: true,
      });

      const response = await axiosInstance({
        method: 'put',
        url: `http://localhost:8080/api/settings?business_id=${"HY7IAUl86AUMMqVbzGKn"}`,
        isFromLocal: true,
        data: settingsData,
      });

      if (response.status === 200 && response.data) {
        dispatch(showMessage({
          message: 'Settings updated successfully',
          variant: 'success',
        }));

        dispatch(getSettings());
        return response.data;
      }
    } catch (error: any) {
      dispatch(showMessage({
        message: error.response?.data?.message || 'Failed to update settings',
        variant: 'error',
      }));
      return null;
    } finally {
      dispatch({
        type: SET_IS_LOADING,
        payload: false,
      });
    }
  };
};

