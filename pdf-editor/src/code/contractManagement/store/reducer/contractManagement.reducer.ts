import { AppDispatch } from '..';
import { 
  ContractManagementState,
  CONTRACT_MANAGEMENT_ACTION_TYPES,
  CONTRACT_MANAGEMENT_TAB
} from '../../types';

const initialState: ContractManagementState = {
  createPdfDocumentDrawerOpen: false,
  createDocumentDrawerOpen: false,
  activeTab: CONTRACT_MANAGEMENT_TAB.DOCUMENTS,
  documentActiveFilter: 'all',
  contractActiveFilter: 'all',
  documentsFilters: {
    all: 0,
    draft: 0,
    waiting: 0,
    completed: 0,
    archived: 0,
  },
  contractsFilters: {
    all: 0,
    active: 0,
    expired: 0,
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
    case CONTRACT_MANAGEMENT_ACTION_TYPES.SET_CREATE_PDF_DOCUMENT_DRAWER_OPEN:
      return {
        ...state,
        createPdfDocumentDrawerOpen: action.payload,
      };
    case CONTRACT_MANAGEMENT_ACTION_TYPES.SET_CREATE_DOCUMENT_DRAWER_OPEN:
      return {
        ...state,
        createDocumentDrawerOpen: action.payload,
      };
    case CONTRACT_MANAGEMENT_ACTION_TYPES.SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.payload,
      };
    case CONTRACT_MANAGEMENT_ACTION_TYPES.SET_DOCUMENT_ACTIVE_FILTER:
      return {
        ...state,
        documentActiveFilter: action.payload,
      };
    case CONTRACT_MANAGEMENT_ACTION_TYPES.SET_CONTRACT_ACTIVE_FILTER:
      return {
        ...state,
        contractActiveFilter: action.payload,
      };
    default:
      return state;
  }
};
