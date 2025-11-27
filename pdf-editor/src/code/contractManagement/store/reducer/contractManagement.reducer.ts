import { AppDispatch } from '..';
import { 
  CONTRACT_MANAGEMENT_ACTION_TYPES,
  CONTRACT_MANAGEMENT_TAB,
  DocumentItem,
  ContractItem
} from '../../types';

export interface ContractManagementState {
  createPdfDocumentDrawerOpen: boolean;
  createDocumentDrawerOpen: boolean;
  activeTab: CONTRACT_MANAGEMENT_TAB;
  documentActiveFilter: string;
  contractActiveFilter: string;
  contractDrawer: {
    createContractDrawerOpen: boolean;
    contractDrawerProgress: number;
    contractName: string;
    contractType: string;
    contractValue: number;
    contractValueCurrency: string;
    startDate: string;
    endDate: string;
    renewalPeriod: number;
    noticePeriod: number;
    autoRenewal: boolean;
    termsAndConditions: string;
    paymentTerms: string;
  };
  documentsFilters: {
    all: number;
    draft: number;
    waiting: number;
    completed: number;
    archived: number;
  };
  contractsFilters: {
    all: number;
    active: number;
    expired: number;
  };
  stats: {
    totalDocuments: number;
    activeContracts: number;
    pendingSignatures: number;
    contractValue: number;
  };
  documents: DocumentItem[];
  contracts: ContractItem[];
}

export interface RootState {
  contractManagement: ContractManagementState;
}

const initialState: ContractManagementState = {
  createPdfDocumentDrawerOpen: false,
  createDocumentDrawerOpen: false,
  activeTab: CONTRACT_MANAGEMENT_TAB.DOCUMENTS,
  documentActiveFilter: 'all',
  contractActiveFilter: 'all',
  contractDrawer: {
    createContractDrawerOpen: false,
    contractDrawerProgress: 0,
    contractName: "",
    contractType: "Service Contract",
    contractValue: 0.00,
    contractValueCurrency: "USD",
    startDate: "",
    endDate: "",
    renewalPeriod: 0,
    noticePeriod: 0,
    autoRenewal: false,
    termsAndConditions: "",
    paymentTerms: "",
  },
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
    case CONTRACT_MANAGEMENT_ACTION_TYPES.SET_CONTRACT_DRAWER_FIELDS:
      return {
        ...state,
        contractDrawer: {
          ...state.contractDrawer,
          ...action.payload,
        },
      };
    case CONTRACT_MANAGEMENT_ACTION_TYPES.SET_CREATE_CONTRACT_DRAWER_OPEN:
      return {
        ...state,
        contractDrawer: {
          ...state.contractDrawer,
          createContractDrawerOpen: action.payload,
        },
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
