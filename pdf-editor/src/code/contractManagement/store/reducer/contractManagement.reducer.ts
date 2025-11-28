import * as Actions from '../action/contractManagement.actions';
import { 
  CONTRACT_MANAGEMENT_TAB,
  DocumentItem,
  ContractItem
} from '../../types';

export interface ContractManagementState {
  pdfBuilderDrawerOpen: boolean;
  activeTab: CONTRACT_MANAGEMENT_TAB;
  documentActiveFilter: string;
  contractActiveFilter: string;
  documentDrawerOpen: boolean;
  identityVerification: boolean;
  identityVerificationDialogOpen: boolean;
  contractDrawer: {
    createContractDrawerOpen: boolean;
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
  pdfBuilderDrawerOpen: false,
  activeTab: CONTRACT_MANAGEMENT_TAB.DOCUMENTS,
  documentActiveFilter: 'all',
  contractActiveFilter: 'all',
  documentDrawerOpen: false,
  identityVerification: false,
  identityVerificationDialogOpen: false,
  contractDrawer: {
    createContractDrawerOpen: false,
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

export const contractManagementReducer = (state = initialState, action: Actions.ContractManagementAction): ContractManagementState => {
  switch (action.type) {
    case Actions.SET_PDF_BUILDER_DRAWER_OPEN:
      return {
        ...state,
        pdfBuilderDrawerOpen: action.payload,
      };
    case Actions.SET_DOCUMENT_DRAWER_OPEN:
      return {
        ...state,
        documentDrawerOpen: action.payload,
      };
    case Actions.SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.payload,
      };
    case Actions.SET_DOCUMENT_ACTIVE_FILTER:
      return {
        ...state,
        documentActiveFilter: action.payload,
      };
    case Actions.SET_CONTRACT_ACTIVE_FILTER:
      return {
        ...state,
        contractActiveFilter: action.payload,
      };
    case Actions.SET_IDENTITY_VERIFICATION:
      return {
        ...state,
        identityVerification: action.payload,
      };
    case Actions.SET_IDENTITY_VERIFICATION_DIALOG_OPEN:
      return {
        ...state,
        identityVerificationDialogOpen: action.payload,
      };
    default:
      return state;
  }
};
