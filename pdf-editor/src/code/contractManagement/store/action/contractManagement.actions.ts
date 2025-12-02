import { AppDispatch, RootState } from '..';
import { CONTRACT_MANAGEMENT_TAB, DIALOG_DRAWER_NAMES } from '../../types';

// Action Types
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
  };
}

export interface SetDocumentDrawerModeAction {
  type: typeof SET_DOCUMENT_DRAWER_MODE;
  payload: 'create' | 'upload' | 'edit' | null;
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
  | SetDocumentDrawerModeAction;

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
  return async (dispatch: AppDispatch) => {
    // TODO: API call to create document
    console.log("Dispatching CREATE_NEW_DOCUMENT", data);
    dispatch({
      type: CREATE_NEW_DOCUMENT,
      payload: data,
    });
  };
};

export const uploadDocumentPdf = (data: { documentName: string; file: File; signers: any[] }): AppDispatch => {
  return async (dispatch: AppDispatch) => {
    // TODO: API call to upload document
    console.log("Dispatching UPLOAD_DOCUMENT_PDF", data);
    dispatch({
      type: UPLOAD_DOCUMENT_PDF,
      payload: data,
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

export const updateDocument = (data: { documentId: string; documentName: string; signers: any[]; signingOrder?: boolean }): AppDispatch => {
  return async (dispatch: AppDispatch) => {
    // TODO: API call to update document
    console.log("Dispatching UPDATE_DOCUMENT", data);
    dispatch({
      type: UPDATE_DOCUMENT,
      payload: data,
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
