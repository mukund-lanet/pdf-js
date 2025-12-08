import { DRAWER_COMPONENT_CATEGORY } from "./interface";

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
  { icon: "eye", label: "View Document", key: "view_document" },
  { icon: "file-check-2", label: "Certificate of Completion", key: "certificate_of_completion" },
  { icon: "edit-2", label: "Edit Document", key: "edit_document" },
  { icon: "send", label: "Send for Signature", key: "send_for_signature" },
  { icon: "download", label: "Download", key: "download" },
  { icon: "user", label: "Manage Signers", key: "manage_signers" },
  { icon: "trash-2", label: "Delete", key: "delete" },
];


// pdf-editor
export const noPdfDocument = {
  message: "No documents found",
  description: "There are no documents to display.",
  tips: [
    "Create new document",
    "Upload pdf and start editing",
    "Add docusign in integration"
  ],
  iconName: "pen-line",
  tipsTitle: "Quick tips",
  button: undefined
}

export const blocks = [
  { type: 'heading', label: 'Heading', icon: 'type' },
  { type: 'image', label: 'Image', icon: 'image' },
  { type: 'video', label: 'Video', icon: 'video' },
  { type: 'table', label: 'Table', icon: 'table' },
  { type: 'product-list', label: 'Product list', icon: 'file-text' },
  { type: 'page-break', label: 'Page break', icon: 'scissors' },
];

export const fillableFields = [
  { type: 'signature', label: 'Signature', icon: 'pencil-line' },
  { type: 'text-field', label: 'Text Field', icon: 'type' },
  { type: 'date', label: 'Date', icon: 'calendar' },
  { type: 'initials', label: 'Initials', icon: 'type' },
  { type: 'checkbox', label: 'Checkbox', icon: 'check-square' },
];

export const fontSizeList = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48];

export const fontFamilyList = [
  { name: 'Open Sans', value: 'Open Sans, sans-serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Noto Sans JP', value: '"Noto Sans JP", sans-serif' },
  { name: 'Poppins', value: 'Poppins, sans-serif' },
  { name: 'Roboto Condensed', value: '"Roboto Condensed", sans-serif' },
  { name: 'Inter', value: 'Inter, sans-serif' },
];

export const headingLevels = [
  { label: 'Heading 1', value: 'h1' },
  { label: 'Heading 2', value: 'h2' },
  { label: 'Heading 3', value: 'h3' },
  { label: 'Heading 4', value: 'h4' },
  { label: 'Heading 5', value: 'h5' },
  { label: 'Paragraph', value: 'p' },
];

export const dateFormats = [
  'YYYY-MM-DD',
  'MM/DD/YYYY',
  'DD/MM/YYYY',
  'DD-MMM-YYYY',
  'MMM DD, YYYY'
];

export const availableDates = [
  "Any Date",
  "Past Date",
  "Future Date",
  "Today's Date",
];

export const tabItems = {
  [DRAWER_COMPONENT_CATEGORY.ADD_ELEMENTS]: {
    name: "Elements",
    icon: "square",
    title: "Add elements",
    description: "Drag components into your document",
  },
  [DRAWER_COMPONENT_CATEGORY.PAGES]: {
    name: "Pages",
    icon: "layers",
    title: "Page Manager",
    description: "Organize and manage document pages",
  },
  [DRAWER_COMPONENT_CATEGORY.DOCUMENT_VARIABLES]: {
    name: "Variables",
    icon: "braces",
    title: "Document Variables",
    description: "Create and manage dynamic variables",
  },
  [DRAWER_COMPONENT_CATEGORY.SETTINGS]: {
    name: "Settings",
    icon: "settings",
    title: "Document Settings",
    description: "Configure document preferences",
  },
  [DRAWER_COMPONENT_CATEGORY.RECIPIENTS]: {
    name: "Recipients",
    icon: "user",
    title: "Manage Recipients",
    description: "Add and manage document signers",
  },
};