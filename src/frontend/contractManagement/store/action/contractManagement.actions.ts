import { AppDispatch } from '..';
import { axiosInstance } from 'components/util/axiosConfig';
import { showMessage } from 'components/store/actions';
import { DIALOG_DRAWER_NAMES, CanvasElement, TextElement, DRAWER_COMPONENT_CATEGORY, Page } from '../../utils/interface';
import { convertObjectToList, convertListToObject } from '../../utils/utils';

// Action Types
export const SET_DOCUMENTS_LIST = 'SET_DOCUMENTS_LIST';
export const SET_DOCUMENTS = 'SET_DOCUMENTS';
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
export const SET_TOTAL_PAGES = 'SET_TOTAL_PAGES';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
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
export const SET_DOCUMENT_FILTERS = 'SET_DOCUMENT_FILTERS';
export const SET_FETCHING_DOCUMENTS = 'SET_FETCHING_DOCUMENTS';
export const SET_ACTIVE_ELEMENT_ID = 'SET_ACTIVE_ELEMENT_ID';
export const SET_PROPERTIES_DRAWER_STATE = 'SET_PROPERTIES_DRAWER_STATE';
export const SET_PDF_MEDIA = 'SET_PDF_MEDIA';
export const FILLABLE_ELEMENT = 'FILLABLE_ELEMENT';
export const TOOLBAR_ITEM = 'TOOLBAR_ITEM';
export const SET_DOCUMENT_TYPE = 'SET_DOCUMENT_TYPE';
export const SET_UPLOAD_PDF_URL = 'SET_UPLOAD_PDF_URL';
export const SET_PAGES = 'SET_PAGES';
export const SET_IS_UNSAVED = 'SET_IS_UNSAVED';


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
    pages?: Page[];
  };
}

export interface SetDocumentDrawerModeAction {
  type: typeof SET_DOCUMENT_DRAWER_MODE;
  payload: 'create' | 'upload' | 'edit' | null;
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

interface SetIsUnsavedAction {
  type: typeof SET_IS_UNSAVED;
  payload: boolean;
}

interface SetDrawerComponentCategoryAction {
  type: typeof SET_DRAWER_COMPONENT_CATEGORY;
  payload: DRAWER_COMPONENT_CATEGORY;
}

interface SetActiveElementIdAction {
  type: typeof SET_ACTIVE_ELEMENT_ID;
  payload: string | null;
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

interface SetCanvasElementsAction {
  type: typeof SET_CANVAS_ELEMENTS;
  payload: {
    pageId: string;
    elements: CanvasElement[];
  };
}

interface AddCanvasElementAction {
  type: typeof ADD_CANVAS_ELEMENT;
  payload: {
    pageId: string;
    element: CanvasElement;
  };
}

interface UpdateCanvasElementAction {
  type: typeof UPDATE_CANVAS_ELEMENT;
  payload: {
    pageId: string;
    element: CanvasElement;
  };
}

interface DeleteCanvasElementAction {
  type: typeof DELETE_CANVAS_ELEMENT;
  payload: {
    pageId: string;
    elementId: string;
  };
}

interface AddBlockElementAction {
  type: typeof ADD_BLOCK_ELEMENT;
  payload: {
    pageId: string;
    element: CanvasElement;
  };
}

interface ReorderBlockElementsAction {
  type: typeof REORDER_BLOCK_ELEMENTS;
  payload: {
    pageId: string;
    sourceIndex: number;
    destinationIndex: number;
  };
}

interface UpdateBlockOrderAction {
  type: typeof UPDATE_BLOCK_ORDER;
  payload: {
    pageId: string;
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
  payload: { pageId: string; element: CanvasElement }[];
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

// API Data Interfaces
interface SetDocumentsAction {
  type: typeof SET_DOCUMENTS;
  payload: {
    documents: any[];
    count: number;
  };
}

interface SetDocumentFiltersAction {
  type: typeof SET_DOCUMENT_FILTERS;
  payload: {
    search?: string;
    status?: string;
    limit?: number;
    offset?: number;
  };
}

interface SetFetchingDocumentsAction {
  type: typeof SET_FETCHING_DOCUMENTS;
  payload: boolean;
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
  | SetTotalPagesAction
  | SetCurrentPageAction
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
  | SetPropertiesDrawerStateAction
  | SetPdfMediaAction
  | SetDocumentTypeAction
  | SetUploadPdfUrlAction
  | SetPagesAction
  | ReorderPageElementsAction
  | SetIsUnsavedAction
  | SetDocumentsAction
  | SetDocumentFiltersAction
  | SetFetchingDocumentsAction
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

export const setDialogDrawerState = (dialogName: DIALOG_DRAWER_NAMES, isOpen: boolean): AppDispatch => {
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

export const setActiveDocument = (document: any | null): AppDispatch => {
  return async (dispatch: AppDispatch) => {
    dispatch({
      type: SET_ACTIVE_DOCUMENT,
      payload: document,
    });
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

export const setDocumentFilters = (filters: { search?: string; status?: string; limit?: number; offset?: number }): AppDispatch => {
  return async (dispatch: AppDispatch) => {
    dispatch({
      type: SET_DOCUMENT_FILTERS,
      payload: filters,
    });
  };
};

export const setIsUnsaved = (isUnsaved: boolean): AppDispatch => {
  return async (dispatch: AppDispatch) => {
    dispatch({
      type: SET_IS_UNSAVED,
      payload: isUnsaved,
    });
  };
};

// ============ Document API Actions ============

export const getDocuments = (filters?: { search?: string; status?: string; limit?: number; offset?: number; business_id?: string }): AppDispatch => {
  return async (dispatch: AppDispatch, getState: () => any) => {
    try {
      const state = getState();
      const currentFilters = state?.contractManagement?.filters || { search: '', status: 'all', limit: 25, offset: 0 };
      const business_id = filters?.business_id || state?.auth?.business?.id;
      
      const { search = '', status = 'all', limit = 25, offset = 0 } = { ...currentFilters, ...filters };

      dispatch({
        type: SET_FETCHING_DOCUMENTS,
        payload: true,
      });

      const response = await axiosInstance({
        method: 'POST',
        url: `http://localhost:8080/fetch-esign-documents?business_id=${business_id}`,
        isFromLocal: true,
        data: {
          limit,
          offset,
          ...(search ? { search } : {}),
          ...(status !== 'all' ? { status } : {}),
        },
      });

      if (response.status === 200 && response.data) {
        dispatch({
          type: SET_DOCUMENTS,
          payload: {
            documents: response.data.documents || [],
            count: response.data.totalCount || 0,
          },
        });
      }

      dispatch({
        type: SET_FETCHING_DOCUMENTS,
        payload: false,
      });
    } catch (error: any) {
      dispatch({
        type: SET_FETCHING_DOCUMENTS,
        payload: false,
      });
      dispatch(showMessage({
        message: error.response?.data?.msg || 'Failed to fetch documents',
        variant: 'error',
      }));
    }
  };
};

export const loadDocumentById = (id: string, business_id: string): AppDispatch => {
  return async (dispatch: AppDispatch) => {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Invalid document ID');
      }

      dispatch({
        type: SET_IS_LOADING,
        payload: true,
      });

      console.log("busienssId, loadDocbyId: ", business_id)

      const response = await axiosInstance({
        method: 'POST',
        url: `http://localhost:8080/fetch-esign-document-by-id?business_id=${business_id}`,
        isFromLocal: true,
        data: { id }
      });

      if (!response.data || !response.data.data || response.data.data.length === 0) {
        throw new Error('Document not found');
      }

      const document = response.data.data[0];

      dispatch(setActiveDocument(document));

      if (document.pages) {
        let pagesArray = typeof document.pages === 'object' && !Array.isArray(document.pages)
          ? convertObjectToList(document.pages)
          : document.pages;
        
        // MIGRATION: If document has old format (separate canvasElements), migrate to new format
        if (document.canvasElements) {
          const canvasElementsArray = typeof document.canvasElements === 'object' && !Array.isArray(document.canvasElements)
            ? convertObjectToList(document.canvasElements)
            : document.canvasElements || [];
          
          // Group canvas elements by page and add to pages
          pagesArray = pagesArray.map((page: Page, index: number) => {
            const pageNumber = index + 1;
            const pageElements = canvasElementsArray.filter((el: any) => el.page === pageNumber);
            
            // Remove page property from elements as it's no longer needed
            const elementsWithoutPageProp = pageElements.map((el: any) => {
              const { page, ...rest } = el;
              return rest;
            });
            
            return {
              ...page,
              elements: elementsWithoutPageProp
            };
          });
        } else {
          // Ensure all pages have elements array
          pagesArray = pagesArray.map((page: Page) => ({
            ...page,
            elements: page.elements || []
          }));
        }
        
        dispatch({
          type: SET_PAGES,
          payload: pagesArray
        });
        
        dispatch({
          type: SET_TOTAL_PAGES,
          payload: pagesArray.length,
        });
      }

      if (document.documentType) {
        dispatch({
          type: SET_DOCUMENT_TYPE,
          payload: document.documentType,
        });
      }

      if (document.uploadPath) {
        dispatch(setUploadPdfUrl(document.uploadPath));
      }
      dispatch({
        type: SET_CURRENT_PAGE,
        payload: 1,
      });

      dispatch(setIsUnsaved(false));

      return document;

    } catch (error: any) {
      console.error('Error loading document:', error);

      let errorMessage = 'Failed to load document';

      if (error.response?.status === 404) {
        errorMessage = 'Document not found. It may have been deleted.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied. You do not have permission to view this document.';
      } else if (error.message === 'Invalid document ID') {
        errorMessage = 'Invalid document ID format.';
      } else if (error.message === 'Network Error' || !navigator.onLine) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.response?.data?.msg) {
        errorMessage = error.response.data.msg;
      } else if (error.message) {
        errorMessage = error.message;
      }

      dispatch(showMessage({
        message: errorMessage,
        variant: 'error',
      }));

      if (error.response?.status === 404 || error.message === 'Invalid document ID') {
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

export const upsertDocument = (data: {
  business_id: string;
  id?: string;
  is_delete?: boolean;
  uploadPdfData?: any;
  name?: string;
  status?: string;
  signers?: any[];
  is_signing_order?: boolean;
  pages?: Page[];
  document_type?: string;
}): AppDispatch => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch({
        type: SET_IS_LOADING,
        payload: true,
      });

      const response = await axiosInstance({
        method: 'post',
        url: `http://localhost:8080/upsert-esign-document?business_id=${data.business_id}`,
        isFromLocal: true,
        data: {
          id: data.id,
          is_delete: data.is_delete,
          uploadPdfData: data.uploadPdfData,
          name: data.name,
          status: data.status,
          signers: data.signers,
          is_signing_order: data.is_signing_order,
          pages: convertListToObject(data.pages),
          document_type: data.document_type,
        },
      });

      if (response.status === 200 && response.data) {
        dispatch({
          type: UPDATE_DOCUMENT,
          payload: response.data,
        });

        dispatch(setIsUnsaved(false));

        dispatch(showMessage({
          message: `Document "${data.name}" updated successfully`,
          variant: 'success',
        }));

        // Refresh documents list
        dispatch(getDocuments({ business_id: data.business_id }));

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

// // ============ Contract API Actions ============

// export const getContracts = (): AppDispatch => {
//   return async (dispatch: AppDispatch) => {
//     try {
//       const response = await axiosInstance({
//         method: 'get',
//         url: `http://localhost:8080/api/contracts?business_id=${"HY7IAUl86AUMMqVbzGKn"}`,
//         isFromLocal: true,
//       });

//       if (response.status === 200 && response.data) {
//         dispatch({
//           type: SET_CONTRACTS_LIST,
//           payload: response.data,
//         });
//       }
//     } catch (error: any) {
//       console.error('Failed to fetch contracts:', error);
//     }
//   };
// };

// export const createContract = (contractData: any): AppDispatch => {
//   return async (dispatch: AppDispatch) => {
//     try {
//       dispatch({
//         type: SET_IS_LOADING,
//         payload: true,
//       });

//       const response = await axiosInstance({
//         method: 'post',
//         url: `http://localhost:8080/api/contracts?business_id=${"HY7IAUl86AUMMqVbzGKn"}`,
//         isFromLocal: true,
//         data: contractData,
//       });

//       if (response.status === 200 && response.data) {
//         dispatch(showMessage({
//           message: `Contract "${contractData.name}" created successfully`,
//           variant: 'success',
//         }));

//         dispatch(getContracts());
//         return response.data;
//       }
//     } catch (error: any) {
//       dispatch(showMessage({
//         message: error.response?.data?.message || 'Failed to create contract',
//         variant: 'error',
//       }));
//       return null;
//     } finally {
//       dispatch({
//         type: SET_IS_LOADING,
//         payload: false,
//       });
//     }
//   };
// };

// export const updateContract = (id: string, contractData: any): AppDispatch => {
//   return async (dispatch: AppDispatch) => {
//     try {
//       dispatch({
//         type: SET_IS_LOADING,
//         payload: true,
//       });

//       const response = await axiosInstance({
//         method: 'put',
//         url: `http://localhost:8080/api/contracts/${id}?business_id=${"HY7IAUl86AUMMqVbzGKn"}`,
//         isFromLocal: true,
//         data: contractData,
//       });

//       if (response.status === 200 && response.data) {
//         dispatch(showMessage({
//           message: `Contract "${contractData.name}" updated successfully`,
//           variant: 'success',
//         }));

//         dispatch(getContracts());
//         return response.data;
//       }
//     } catch (error: any) {
//       dispatch(showMessage({
//         message: error.response?.data?.message || 'Failed to update contract',
//         variant: 'error',
//       }));
//       return null;
//     } finally {
//       dispatch({
//         type: SET_IS_LOADING,
//         payload: false,
//       });
//     }
//   };
// };

// export const deleteContract = (id: string, contractName: string): AppDispatch => {
//   return async (dispatch: AppDispatch) => {
//     try {
//       dispatch({
//         type: SET_IS_LOADING,
//         payload: true,
//       });

//       const response = await axiosInstance({
//         method: 'delete',
//         url: `http://localhost:8080/api/contracts/${id}?business_id=${"HY7IAUl86AUMMqVbzGKn"}`,
//         isFromLocal: true,
//       });

//       if (response.status === 200) {
//         dispatch(showMessage({
//           message: `Contract "${contractName}" deleted successfully`,
//           variant: 'success',
//         }));

//         dispatch(getContracts());
//       }
//     } catch (error: any) {
//       dispatch(showMessage({
//         message: error.response?.data?.message || 'Failed to delete contract',
//         variant: 'error',
//       }));
//     } finally {
//       dispatch({
//         type: SET_IS_LOADING,
//         payload: false,
//       });
//     }
//   };
// };

// // ============ Settings API Actions ============

// export const getSettings = (): AppDispatch => {
//   return async (dispatch: AppDispatch) => {
//     try {
//       const response = await axiosInstance({
//         method: 'get',
//         url: `http://localhost:8080/api/settings?business_id=${"HY7IAUl86AUMMqVbzGKn"}`,
//         isFromLocal: true,
//       });

//       if (response.status === 200 && response.data) {
//         dispatch({
//           type: SET_SETTINGS_DATA,
//           payload: response.data,
//         });

//         // Also update individual settings in Redux
//         if (response.data.identityVerification) {
//           dispatch(setIdentityVerificationSettings(response.data.identityVerification));
//         }
//         if (response.data.globalDocument) {
//           dispatch(setGlobalDocumentSettings(response.data.globalDocument));
//         }
//         if (response.data.branding) {
//           dispatch(setBrandingCustomizationSettings(response.data.branding));
//         }
//       }
//     } catch (error: any) {
//       console.error('Failed to fetch settings:', error);
//     }
//   };
// };

// export const updateSettings = (settingsData: any): AppDispatch => {
//   return async (dispatch: AppDispatch) => {
//     try {
//       dispatch({
//         type: SET_IS_LOADING,
//         payload: true,
//       });

//       const response = await axiosInstance({
//         method: 'put',
//         url: `http://localhost:8080/api/settings?business_id=${"HY7IAUl86AUMMqVbzGKn"}`,
//         isFromLocal: true,
//         data: settingsData,
//       });

//       if (response.status === 200 && response.data) {
//         dispatch(showMessage({
//           message: 'Settings updated successfully',
//           variant: 'success',
//         }));

//         dispatch(getSettings());
//         return response.data;
//       }
//     } catch (error: any) {
//       dispatch(showMessage({
//         message: error.response?.data?.message || 'Failed to update settings',
//         variant: 'error',
//       }));
//       return null;
//     } finally {
//       dispatch({
//         type: SET_IS_LOADING,
//         payload: false,
//       });
//     }
//   };
// };

