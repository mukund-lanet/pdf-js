import { AppDispatch, RootState } from '..';
import { CONTRACT_MANAGEMENT_TAB } from '../../types';

// Action Types
export const SET_ACTIVE_TAB = 'CONTRACT_MANAGEMENT_SET_ACTIVE_TAB';
export const SET_DOCUMENT_ACTIVE_FILTER = 'CONTRACT_MANAGEMENT_SET_DOCUMENT_ACTIVE_FILTER';
export const SET_CONTRACT_ACTIVE_FILTER = 'CONTRACT_MANAGEMENT_SET_CONTRACT_ACTIVE_FILTER';
export const TOGGLE_FOLDER = 'CONTRACT_MANAGEMENT_TOGGLE_FOLDER';
export const SET_PDF_BUILDER_DRAWER_OPEN = "SET_PDF_BUILDER_DRAWER_OPEN";
export const SET_DOCUMENT_DRAWER_OPEN = "SET_DOCUMENT_DRAWER_OPEN";

// Action Interfaces
export interface SetActiveTabAction {
  type: typeof SET_ACTIVE_TAB;
  payload: CONTRACT_MANAGEMENT_TAB;
}

export interface SetDocumentActiveFilterAction {
  type: typeof SET_DOCUMENT_ACTIVE_FILTER;
  payload: string;
}

export interface SetContractActiveFilterAction {
  type: typeof SET_CONTRACT_ACTIVE_FILTER;
  payload: string;
}

export interface SetPdfBuilderDrawerOpen {
  type: typeof SET_PDF_BUILDER_DRAWER_OPEN;
  payload: boolean;
}
export interface SetDocumentDrawerOpen {
  type: typeof SET_DOCUMENT_DRAWER_OPEN;
  payload: boolean;
}

// Union type for all Contract Management actions
export type ContractManagementAction =
  | SetActiveTabAction
  | SetDocumentActiveFilterAction
  | SetContractActiveFilterAction
  | SetPdfBuilderDrawerOpen
  | SetDocumentDrawerOpen;

// Action Creators
export const setActiveTab = (tab: CONTRACT_MANAGEMENT_TAB): AppDispatch => {
  return async (dispatch: AppDispatch) => {
    dispatch({
      type: SET_ACTIVE_TAB,
      payload: tab,
    });
  };
};

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

export const setPdfBuilderDrawerOpen = (open: boolean): AppDispatch => {
  return async (dispatch: AppDispatch) => {
    dispatch({
      type: SET_PDF_BUILDER_DRAWER_OPEN,
      payload: open,
    });
  };
};

export const setDocumentDrawerOpen = (open: boolean): AppDispatch => {
  return async (dispatch: AppDispatch) => {
    dispatch({
      type: SET_DOCUMENT_DRAWER_OPEN,
      payload: open,
    });
  };
};