import * as mongoose from "mongoose";

export interface ISigner {
  name: string;
  email: string;
  type: 'signer' | 'approver' | 'cc';
  order?: number;
}

export interface IDocumentVariable {
  name: string;
  value: string;
  isSystem?: boolean;
}

export interface IBlockElement {
  id: string;
  type: 'heading' | 'image' | 'video' | 'table';
  pageNumber: number;
  order: number;
  properties: any;
}

export interface IFillableElement {
  id: string;
  type: 'text' | 'signature' | 'date' | 'checkbox' | 'initial';
  pageNumber: number;
  position: { x: number; y: number };
  properties: any;
}

export type ICanvasElement = IBlockElement | IFillableElement;

export interface IPage {
  id: string;
  name: string;
  path: string;
  updatedAt: string;
  previewImage: string;
  component: {
    id: string;
    type: string;
    options: {
      paddingTop: string;
      paddingBottom: string;
      paddingLeft: string;
      paddingRight: string;
      src: string;
      bgColor: string;
      pageDimensions: {
        dimensions: { width: number; height: number };
        margins: { top: number; right: number; bottom: number; left: number };
        rotation: 'portrait' | 'landscape';
      };
    };
  };
  children: any[];
}

export interface IContractDocument {
  business_id: string;
  company_id?: string;
  name: string;
  status: 'draft' | 'waiting' | 'completed' | 'archived';
  date: Date;
  signers: ISigner[];
  progress: number;
  dueDate?: string;
  createdBy?: string;
  signingOrder?: boolean;
  uploadPath?: string;
  totalPages: number;
  canvasElements: ICanvasElement[];
  pageDimensions: Map<string, { pageWidth: number; pageHeight: number }>;
  variables: IDocumentVariable[];
  documentType: 'upload-existing' | 'new_document' | null;
  pages?: IPage[];
}

export interface ContractDocumentInterface extends IContractDocument, Document {}


export interface IContractManagement {
  business_id: string;
  company_id?: string;
  documents: mongoose.Types.ObjectId[];
  contracts: mongoose.Types.ObjectId[];
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
    logo: string;
  };
}

export interface ContractManagementInterface extends IContractManagement, Document {}


export interface IContract {
  business_id: string;
  company_id?: string;
  name: string;
  status: 'active' | 'draft' | 'expired';
  value: number;
  currency: string;
  date: Date;
  startDate: moment.Moment;
  endDate: moment.Moment;
  renewalPeriod: number;
  noticePeriod: number;
  autoRenewal: boolean;
  termsAndConditions: string;
  paymentTerms: string;
  contractType: string;
}

export interface ContractInterface extends IContract, Document {}


export interface ISettings {
  business_id: string;
  company_id?: string;
  identityVerification: {
    isVarifyOn: boolean;
    verificationMethod: string;
    isRequireAllSigners: boolean;
    isRequirePhone: boolean;
  };
  globalDocument: {
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
  branding: {
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
    logo: string;
  };
}

export interface SettingsInterface extends ISettings, Document {}
