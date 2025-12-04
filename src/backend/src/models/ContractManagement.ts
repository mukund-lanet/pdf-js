import mongoose, { Document as MongoDocument, Schema } from 'mongoose';

export interface IContractManagement extends MongoDocument {
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
  
  // Settings embedded here as they are part of the "state"
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

const ContractManagementSchema = new Schema<IContractManagement>({
  documents: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
  contracts: [{ type: Schema.Types.ObjectId, ref: 'Contract' }],
  
  documentsFilters: {
    all: { type: Number, default: 0 },
    draft: { type: Number, default: 0 },
    waiting: { type: Number, default: 0 },
    completed: { type: Number, default: 0 },
    archived: { type: Number, default: 0 }
  },
  contractsFilters: {
    all: { type: Number, default: 0 },
    active: { type: Number, default: 0 },
    expired: { type: Number, default: 0 }
  },
  stats: {
    totalDocuments: { type: Number, default: 0 },
    activeContracts: { type: Number, default: 0 },
    pendingSignatures: { type: Number, default: 0 },
    contractValue: { type: Number, default: 0 }
  },
  
  identityVerificationSettings: {
    isVarifyOn: { type: Boolean, default: false },
    verificationMethod: { type: String, default: '' },
    isRequireAllSigners: { type: Boolean, default: false },
    isRequirePhone: { type: Boolean, default: false }
  },
  globalDocumentSettings: {
    senderName: { type: String, default: '' },
    senderEmail: { type: String, default: '' },
    emailSubject: { type: String, default: '' },
    emailTemplate: { type: String, default: 'default' },
    redirectDateNotification: { type: Boolean, default: false },
    dueDateNotification: { type: Boolean, default: false },
    completionNotification: { type: Boolean, default: false },
    reminderNotification: { type: Boolean, default: false },
    daysBeforeDueDate: { type: Number, default: 3 }
  },
  brandingCustomizationSettings: {
    senderName: { type: String, default: '' },
    senderEmail: { type: String, default: '' },
    emailSubjectLine: { type: String, default: '' },
    emailMessage: { type: String, default: '' },
    ctaButtonText: { type: String, default: '' },
    footerText: { type: String, default: '' },
    companyName: { type: String, default: '' },
    primaryColor: { type: String, default: '' },
    secondaryColor: { type: String, default: '' },
    accentColor: { type: String, default: '' },
    logo: { type: String, default: null }
  }
}, { timestamps: true });

export default mongoose.model<IContractManagement>('ContractManagement', ContractManagementSchema);
