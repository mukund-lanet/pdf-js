export interface Signer {
  name: string;
  email: string;
  type: 'signer' | 'approver' | 'cc';
  order?: number;
}

export interface DocumentItem {
  id: string;
  name: string;
  status: 'draft' | 'waiting' | 'completed' | 'archived';
  date: string;
  signers: Signer[];
  progress: number;
  dueDate?: string;
  createdBy?: string;
  signingOrder?: boolean;
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

export enum DIALOG_DRAWER_NAMES {
  PDF_BUILDER_DRAWER = 'pdfBuilderDrawerOpen',
  DOCUMENT_DRAWER = 'documentDrawerOpen',
  IDENTITY_VERIFICATION_DIALOG = 'identityVerificationDialogOpen',
  GLOBAL_DOCUMENT_SETTINGS_DIALOG = 'globalDocumentSettingsDialogOpen',
  BRANDING_CUSTOMIZATION_DIALOG = 'brandingCustomizationDialogOpen'
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
  // {
  //   title: 'Active Contracts',
  //   value: 4,
  //   description: 'Contracts currently active',
  //   iconName: 'file-check',
  //   iconColor: '#15803d',
  //   iconBgColor: '#dcfce7',
  // },
  {
    title: 'Pending Signatures',
    value: 5,
    description: 'Awaiting signature',
    iconName: 'clock',
    iconColor: '#ea580c',
    iconBgColor: '#ffedd5',
  },
  // {
  //   title: 'Contract Value',
  //   value: `$${10000}`,
  //   description: 'Total contract value',
  //   iconName: 'dollar-sign',
  //   iconColor: '#444444',
  //   iconBgColor: '#f3f4f6',
  // }
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

export const radioGroupList = [
  {
    value: "sms_verification",
    title: "SMS Verification",
    description: "Send a one-time code via text message to the signer's mobile phone",
    icon: "smartphone",
    chip: "Recommended",
    subDescription: "Requires mobile phone number"
  },
  {
    value: "phone_call_verification",
    title: "Phone Call Verification",
    description: "Call the signer and provide a verification code",
    icon: "phone",
    subDescription: "Works with landline or mobile"
  },
  {
    value: "kba_verification",
    title: "Knowledge-Based Authentication (KBA)",
    description: "Ask the signer questions based on public records and credit history",
    icon: "shield",
    chip: "High Security",
    subDescription: "5-10 personal questions • USA only"
  },
  {
    value: "id_verification",
    title: "ID Verification",
    description: "Upload and verify government-issued photo ID",
    icon: "id-card",
    chip: "Premium",
    subDescription: "Driver's license, passport, or national ID"
  },
  {
    value: "no_verification",
    title: "No Verification",
    description: "Standard email-only authentication",
    icon: "mail"
  }
];

export const  defaultEmailTemplate = [
  {key: "default", value: "Default Template"},
  {key: "professional", value: "Professional"},
  {key: "friendly", value: "Friendly"},
  {key: "formal", value: "Formal"},
  {key: "minimal", value: "Minimal"},
]

export const brandingTabItems = [
  {
    name: "visual",
    icon: "palette",
    title: "Visual",
  },
  {
    name: "email",
    icon: "mail",
    title: "Email",
  },
  {
    name: "preview",
    icon: "eye",
    title: "Preview",
  },
]

export const documentTableHeaders = [
  {
    id: "document_name",
    numeric: false,
    disablePadding: false,
    value: "Document Name",
    key: "document_name",
    hasPermission: true,
    customColumnWidth: "200px",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    value: "Status",
    key: "status",
    hasPermission: true,
    customColumnWidth: "120px",
  },
  {
    id: "signers",
    numeric: false,
    disablePadding: false,
    value: "Signers",
    key: "signers",
    hasPermission: true,
    customColumnWidth: "120px",
  },
  {
    id: "progress",
    numeric: false,
    disablePadding: false,
    value: "Progress",
    key: "progress",
    hasPermission: true,
    customColumnWidth: "120px",
  },
  {
    id: "created",
    numeric: false,
    disablePadding: false,
    value: "Created",
    key: "created",
    hasPermission: true,
    customColumnWidth: "120px",
  },
  {
    id: "due_date",
    numeric: false,
    disablePadding: false,
    value: "Due Date",
    key: "due_date",
    hasPermission: true,
    customColumnWidth: "140px",
  },
  {
    id: "actions",
    numeric: false,
    disablePadding: false,
    value: "Actions",
    key: "actions",
    hasPermission: true,
    customColumnWidth: "80px",
  }
];

export const actionsMenuItems = [
  { icon: "eye", label: "View Document" },
  { icon: "file-check-2", label: "Certificate of Completion" },
  { icon: "edit-2", label: "Edit Document" },
  { icon: "send", label: "Send for Signature" },
  { icon: "download", label: "Download" },
  { icon: "user", label: "Manage Signers" },
  { icon: "trash-2", label: "Delete" },
];
