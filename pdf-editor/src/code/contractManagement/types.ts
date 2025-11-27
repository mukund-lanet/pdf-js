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

export enum CONTRACT_MANAGEMENT_TAB {
  DOCUMENTS = 'documents',
  CONTRACTS = 'contracts'
}

export enum CONTRACT_MANAGEMENT_ACTION_TYPES {
  SET_CREATE_PDF_DOCUMENT_DRAWER_OPEN = "SET_CREATE_PDF_DOCUMENT_DRAWER_OPEN",
  SET_ACTIVE_TAB = 'CONTRACT_MANAGEMENT_SET_ACTIVE_TAB',
  SET_DOCUMENT_ACTIVE_FILTER = 'CONTRACT_MANAGEMENT_SET_DOCUMENT_ACTIVE_FILTER',
  SET_CONTRACT_ACTIVE_FILTER = 'CONTRACT_MANAGEMENT_SET_CONTRACT_ACTIVE_FILTER',
  TOGGLE_FOLDER = 'CONTRACT_MANAGEMENT_TOGGLE_FOLDER',
  SET_CREATE_DOCUMENT_DRAWER_OPEN = "SET_CREATE_DOCUMENT_DRAWER_OPEN",
  SET_CREATE_CONTRACT_DRAWER_OPEN = "SET_CREATE_CONTRACT_DRAWER_OPEN",
  SET_CONTRACT_DRAWER_FIELDS = "SET_CONTRACT_DRAWER_FIELDS"
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

export const contractTypeOptions = [
  { key: "employment", value: "Employment" },
  { key: "sales_agreement", value: "Sales Agreement" },
  { key: "service_contract", value: "Service Contract" },
  { key: "nda", value: "NDA" },
  { key: "partnership", value: "Partnership" },
  { key: "lease_agreement", value: "Lease Agreement" },
  { key: "other", value: "Other" }
];

export const contractValueOptions = [
  {key: "usd", value: "USD"},
  {key: "eur", value: "EUR"},
  {key: "gbp", value: "GBP"},
]