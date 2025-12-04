import mongoose, { Document as MongoDocument, Schema } from 'mongoose';

export interface IContract extends MongoDocument {
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
  business_id: string; // Business identifier for multi-tenancy
}

const ContractSchema = new Schema<IContract>({
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
  contractType: { type: String, default: 'Service Contract' },
  business_id: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IContract>('Contract', ContractSchema);
