import { AppDispatch } from '..';
import { 
  CONTRACT_MANAGEMENT_ACTION_TYPES,
  CONTRACT_MANAGEMENT_TAB
} from '../../types';

export const setActiveTab = (tab: CONTRACT_MANAGEMENT_TAB): AppDispatch => ({
  type: CONTRACT_MANAGEMENT_ACTION_TYPES.SET_ACTIVE_TAB,
  payload: tab,
});

export const setActiveFilter = (filter: string): AppDispatch => ({
  type: CONTRACT_MANAGEMENT_ACTION_TYPES.SET_ACTIVE_FILTER,
  payload: filter,
});

export const toggleFolder = (folderId: string): AppDispatch => ({
  type: CONTRACT_MANAGEMENT_ACTION_TYPES.TOGGLE_FOLDER,
  payload: folderId,
});
