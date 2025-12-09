import { Schema, model, Document, Model } from "mongoose";
import { McrServiceMeta } from "mcr-common/src/expresshelper_common/helper/McrServiceMeta";
import eventBus from "mcr-common/src/expresshelper_common/helper/EventBus";
import { getMcrServiceNameByDevOpsName, MCR_SERVICES } from "mcr-common/src/expresshelper_common/helper/McrCommonServiceList";
import * as moment from "moment";
import { ContractInterface } from "../helper/interface";

interface ContractModel extends Model<ContractInterface> {
  save(event: string): string;
}

const contractSchema: Schema<ContractInterface> = new Schema({
  business_id: { type: String, required: true },
  company_id: { type: String },
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

eventBus.on(getMcrServiceNameByDevOpsName(MCR_SERVICES.MCR_ESIGN_CONTRACT_MANAGEMENT) + "_emit", (mcrServiceMeta: McrServiceMeta) => {
  const connection = mcrServiceMeta.mongoDbConnectionObject;
  if (connection) {
    Contract = connection.model<ContractInterface, ContractModel>('contract', contractSchema);
    console.log("Contract model initialized with dynamic connection.");
  }
});
