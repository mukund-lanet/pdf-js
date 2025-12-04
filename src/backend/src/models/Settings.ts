import mongoose, { Document as MongoDocument, Schema } from 'mongoose';

export interface ISettings extends MongoDocument {
  business_id: string; // Business identifier for multi-tenancy
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
    logo: string; // Base64 or URL
  };
}

const SettingsSchema = new Schema<ISettings>({
  business_id: { type: String, required: true, unique: true },
  identityVerification: {
    isVarifyOn: { type: Boolean, default: false },
    verificationMethod: { type: String, default: '' },
    isRequireAllSigners: { type: Boolean, default: false },
    isRequirePhone: { type: Boolean, default: false }
  },
  globalDocument: {
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
  branding: {
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

export default mongoose.model<ISettings>('Settings', SettingsSchema);
