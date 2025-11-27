import { AppDispatch } from '..';
import { 
  CONTRACT_MANAGEMENT_ACTION_TYPES,
  CONTRACT_MANAGEMENT_TAB
} from '../../types';

export const setActiveTab = (tab: CONTRACT_MANAGEMENT_TAB): AppDispatch => ({
  type: CONTRACT_MANAGEMENT_ACTION_TYPES.SET_ACTIVE_TAB,
  payload: tab,
});

export const setCreateDocumentDrawerOpen = (open: boolean): AppDispatch => ({
  type: CONTRACT_MANAGEMENT_ACTION_TYPES.SET_CREATE_DOCUMENT_DRAWER_OPEN,
  payload: open,
});

export const setCreatePdfDocumentDrawerOpen = (open: boolean): AppDispatch => ({
  type: CONTRACT_MANAGEMENT_ACTION_TYPES.SET_CREATE_PDF_DOCUMENT_DRAWER_OPEN,
  payload: open,
});

export const setDocumentActiveFilter = (filter: string): AppDispatch => ({
  type: CONTRACT_MANAGEMENT_ACTION_TYPES.SET_DOCUMENT_ACTIVE_FILTER,
  payload: filter,
});

export const setContractActiveFilter = (filter: string): AppDispatch => ({
  type: CONTRACT_MANAGEMENT_ACTION_TYPES.SET_CONTRACT_ACTIVE_FILTER,
  payload: filter,
});
