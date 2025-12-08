import { Schema, model, Document, Model } from "mongoose";
import { McrServiceMeta } from "mcr-common/src/expresshelper_common/helper/McrServiceMeta";
import eventBus from "mcr-common/src/expresshelper_common/helper/EventBus";

const SERVICE_NAME = "mcr-contract-management-service";

export interface IContract {
  business_id: string;
  company_id: string;
  name: string;
  status: 'active' | 'draft' | 'expired';
  value: number;
  currency: string;
  date: Date;
  startDate: string;
  endDate: string;
  renewalPeriod: number;
  noticePeriod: number;
  autoRenewal: boolean;
  termsAndConditions: string;
  paymentTerms: string;
  contractType: string;
}

export interface ContractInterface extends IContract, Document {}

interface ContractModel extends Model<ContractInterface> {
  save(event: string): string;
}

const contractSchema: Schema<ContractInterface> = new Schema({
  business_id: { type: String, required: true },
  company_id: { type: String, required: true },
  name: { type: String, required: true },
  status: { type: String, enum: ['active', 'draft', 'expired'], default: 'draft' },
  value: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  date: { type: Date, default: Date.now },
  startDate: { type: String },
  endDate: { type: String },
  renewalPeriod: { type: Number, default: 0 },
  noticePeriod: { type: Number, default: 0 },
  autoRenewal: { type: Boolean, default: false },
  termsAndConditions: { type: String },
  paymentTerms: { type: String },
  contractType: { type: String, default: 'Service Contract' }
}, { timestamps: true });

export let Contract = model<ContractInterface, ContractModel>('contract', contractSchema);

eventBus.on(SERVICE_NAME + "_emit", (mcrServiceMeta: McrServiceMeta) => {
  const connection = mcrServiceMeta.mongoDbConnectionObject;
  if (connection) {
    Contract = connection.model<ContractInterface, ContractModel>('contract', contractSchema);
    console.log("Contract model initialized with dynamic connection.");
  }
});
