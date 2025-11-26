import { AppDispatch } from '..';
import { 
  ContractManagementState,
  CONTRACT_MANAGEMENT_ACTION_TYPES,
  CONTRACT_MANAGEMENT_TAB
} from '../../types';

const initialState: ContractManagementState = {
  activeTab: CONTRACT_MANAGEMENT_TAB.DOCUMENTS,
  activeFilter: 'all',
  expandedFolders: {
    'my-docs': true,
    'my-contracts': true,
  },
  stats: {
    totalDocuments: 0,
    activeContracts: 0,
    pendingSignatures: 0,
    contractValue: 0,
  },
  documents: [],
  contracts: [],
};

export const contractManagementReducer = (state = initialState, action: AppDispatch): ContractManagementState => {
  switch (action.type) {
    case CONTRACT_MANAGEMENT_ACTION_TYPES.SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.payload,
      };
    case CONTRACT_MANAGEMENT_ACTION_TYPES.SET_ACTIVE_FILTER:
      return {
        ...state,
        activeFilter: action.payload,
      };
    case CONTRACT_MANAGEMENT_ACTION_TYPES.TOGGLE_FOLDER:
      return {
        ...state,
        expandedFolders: {
          ...state.expandedFolders,
          [action.payload]: !state.expandedFolders[action.payload],
        },
      };
    default:
      return state;
  }
};
