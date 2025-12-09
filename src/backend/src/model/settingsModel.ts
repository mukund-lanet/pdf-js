import { Schema, model, Document, Model } from "mongoose";
import { McrServiceMeta } from "mcr-common/src/expresshelper_common/helper/McrServiceMeta";
import eventBus from "mcr-common/src/expresshelper_common/helper/EventBus";
import { getMcrServiceNameByDevOpsName, MCR_SERVICES } from "mcr-common/src/expresshelper_common/helper/McrCommonServiceList";
import { SettingsInterface } from "../helper/interface";

// const SERVICE_NAME = "mcr-contract-management-service";

interface SettingsModel extends Model<SettingsInterface> {
  save(event: string): string;
}

const settingsSchema: Schema<SettingsInterface> = new Schema({
  business_id: { type: String, required: true },
  company_id: { type: String },
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

settingsSchema.index({ business_id: 1 }, { unique: true });

export let Settings = model<SettingsInterface, SettingsModel>('contract_settings', settingsSchema);

eventBus.on(getMcrServiceNameByDevOpsName(MCR_SERVICES.MCR_ESIGN_CONTRACT_MANAGEMENT) + "_emit", (mcrServiceMeta: McrServiceMeta) => {
  const connection = mcrServiceMeta.mongoDbConnectionObject;
  if (connection) {
    Settings = connection.model<SettingsInterface, SettingsModel>('contract_settings', settingsSchema);
    console.log("Settings model initialized with dynamic connection.");
  }
});
