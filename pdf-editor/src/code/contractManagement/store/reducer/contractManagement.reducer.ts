import * as Actions from '../action/contractManagement.actions';
import { 
  CONTRACT_MANAGEMENT_TAB,
  DocumentItem,
  ContractItem
} from '../../types';

export interface ContractManagementState {
  pdfBuilderDrawerOpen: boolean;
  newDocumentDrawerOpen: boolean;
  documentActiveFilter: string;
  contractActiveFilter: string;
  identityVerificationDialogOpen: boolean;
  globalDocumentSettingsDialogOpen: boolean;
  brandingCustomizationDialogOpen: boolean;
  uploadPdfDocumentDrawerOpen: boolean;
  identityVerificationSettings: {
    isVarifyOn: boolean;
    verificationMethod: string;
    isRequireAllSigners: boolean;
    isRequirePhone: boolean;
  };
  globalDocumentSettings: {
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
  brandingCustomizationSettings: {
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
  },
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
  newDocumentDrawerOpen: false,
  documentActiveFilter: 'all',
  contractActiveFilter: 'all',
  identityVerificationDialogOpen: false,
  globalDocumentSettingsDialogOpen: false,
  brandingCustomizationDialogOpen: false,
  uploadPdfDocumentDrawerOpen: false,
  identityVerificationSettings: {
    isVarifyOn: false,
    verificationMethod: "",
    isRequireAllSigners: false,
    isRequirePhone: false
  },
  globalDocumentSettings: {
    senderName: "",
    senderEmail: "",
    emailSubject: "",
    emailTemplate: "default",
    redirectDateNotification: false,
    dueDateNotification: false,
    completionNotification: false,
    reminderNotification: false,
    daysBeforeDueDate: 3,
  },
  brandingCustomizationSettings: {
    senderName: "",
    senderEmail: "",
    emailSubjectLine: "",
    emailMessage: "",
    ctaButtonText: "",
    footerText: "",
    companyName: "",
    primaryColor: "",
    secondaryColor: "",
    accentColor: "",
    logo: null,
  },
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
    case Actions.SET_DIALOG_STATE:
      return {
        ...state,
        [action.payload.dialogName]: action.payload.isOpen,
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
    case Actions.SET_IDENTITY_VERIFICATION_SETTINGS:
      return {
        ...state,
        identityVerificationSettings: action.payload,
      };
    case Actions.SET_GLOBAL_DOCUMENT_SETTINGS:
      return {
        ...state,
        globalDocumentSettings: action.payload,
      };
    case Actions.SET_BRANDING_CUSTOMIZATION_SETTINGS:
      return {
        ...state,
        brandingCustomizationSettings: action.payload,
      };
    default:
      return state;
  }
};
