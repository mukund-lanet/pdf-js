export interface DocumentItem {
  id: string;
  name: string;
  status: 'draft' | 'waiting' | 'completed' | 'archived';
  date: string;
}

export interface ContractItem {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'expired';
  value: number;
  date: string;
}

export interface ContractManagementState {
  createPdfDocumentDrawerOpen: boolean;
  createDocumentDrawerOpen: boolean;
  activeTab: CONTRACT_MANAGEMENT_TAB;
  documentActiveFilter: string;
  contractActiveFilter: string;
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

export enum CONTRACT_MANAGEMENT_TAB {
  DOCUMENTS = 'documents',
  CONTRACTS = 'contracts'
}

export enum CONTRACT_MANAGEMENT_ACTION_TYPES {
  SET_CREATE_PDF_DOCUMENT_DRAWER_OPEN = "SET_CREATE_PDF_DOCUMENT_DRAWER_OPEN",
  SET_ACTIVE_TAB = 'CONTRACT_MANAGEMENT/SET_ACTIVE_TAB',
  SET_DOCUMENT_ACTIVE_FILTER = 'CONTRACT_MANAGEMENT/SET_DOCUMENT_ACTIVE_FILTER',
  SET_CONTRACT_ACTIVE_FILTER = 'CONTRACT_MANAGEMENT/SET_CONTRACT_ACTIVE_FILTER',
  TOGGLE_FOLDER = 'CONTRACT_MANAGEMENT/TOGGLE_FOLDER',
  SET_CREATE_DOCUMENT_DRAWER_OPEN = "SET_CREATE_DOCUMENT_DRAWER_OPEN"
}

export const displayCardList = [
  {
    title: 'Total Documents',
    value: 2,
    description: 'All documents',
    iconName: 'file-text',
    iconColor: '#1d4ed8',
    iconBgColor: '#bfdbfe',
  },
  {
    title: 'Active Contracts',
    value: 4,
    description: 'Contracts currently active',
    iconName: 'file-check',
    iconColor: '#15803d',
    iconBgColor: '#dcfce7',
  },
  {
    title: 'Pending Signatures',
    value: 5,
    description: 'Awaiting signature',
    iconName: 'clock',
    iconColor: '#ea580c',
    iconBgColor: '#ffedd5',
  },
  {
    title: 'Contract Value',
    value: `$${10000}`,
    description: 'Total contract value',
    iconName: 'dollar-sign',
    iconColor: '#444444',
    iconBgColor: '#f3f4f6',
  }
];

export const noDocument = {
  message: "No documents found",
  description: "There are no documents to display.",
  tips: [
    "Create new document",
    "Upload pdf and start editing",
    "Add docusign in integration",
    "Import from template library"
  ],
  iconName: "file-pen-line",
  tipsTitle: "Quick tips",
}

export const noContracts = {
  message: "No contracts found",
  description: "There are no contracts to display.",
  tips: [
    "Create new contract",
    "Add docusign in integration",
    "Import from template library"
  ],
  iconName: "file-check",
  tipsTitle: "Quick tips",
}