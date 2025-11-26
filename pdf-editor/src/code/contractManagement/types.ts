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
  activeTab: CONTRACT_MANAGEMENT_TAB;
  activeFilter: string;
  expandedFolders: Record<string, boolean>;
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
  contractManagement: {
    contractManagementReducer: ContractManagementState;
  };
}

export enum CONTRACT_MANAGEMENT_TAB {
  DOCUMENTS = 'documents',
  CONTRACTS = 'contracts'
}

export enum CONTRACT_MANAGEMENT_ACTION_TYPES {
  SET_ACTIVE_TAB = 'CONTRACT_MANAGEMENT/SET_ACTIVE_TAB',
  SET_ACTIVE_FILTER = 'CONTRACT_MANAGEMENT/SET_ACTIVE_FILTER',
  TOGGLE_FOLDER = 'CONTRACT_MANAGEMENT/TOGGLE_FOLDER'
}