import { Schema, model, Document, Model } from "mongoose";
import { McrServiceMeta } from "mcr-common/src/expresshelper_common/helper/McrServiceMeta";
import eventBus from "mcr-common/src/expresshelper_common/helper/EventBus";
import { getMcrServiceNameByDevOpsName, MCR_SERVICES } from "mcr-common/src/expresshelper_common/helper/McrCommonServiceList";
import { ContractDocumentInterface } from "../helper/interface";

// const SERVICE_NAME = "mcr-contract-management-service";

interface ContractDocumentModel extends Model<ContractDocumentInterface> {
  save(event: string): string;
}

const SignerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  type: { type: String, enum: ['signer', 'approver', 'cc'], required: true },
  order: { type: Number }
});

const DocumentVariableSchema = new Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
  isSystem: { type: Boolean }
});

const contractDocumentSchema: Schema<ContractDocumentInterface> = new Schema({
  business_id: { type: String, required: true },
  company_id: { type: String },
  name: { type: String, required: true },
  status: { type: String, enum: ['draft', 'waiting', 'completed', 'archived'], default: 'draft' },
  date: { type: Date, default: Date.now },
  signers: [SignerSchema],
  progress: { type: Number, default: 0 },
  dueDate: { type: String },
  createdBy: { type: String },
  signingOrder: { type: Boolean, default: false },
  uploadPath: { type: String },
  totalPages: { type: Number, default: 0 },
  canvasElements: { type: Schema.Types.Mixed, default: [] },
  pageDimensions: { type: Map, of: new Schema({ pageWidth: Number, pageHeight: Number }) },
  variables: [DocumentVariableSchema],
  documentType: { type: String, enum: ['upload-existing', 'new_document'], default: 'new_document' },
  pages: { type: Schema.Types.Mixed, default: [] }
}, { timestamps: true });

export let ContractDocument = model<ContractDocumentInterface, ContractDocumentModel>('contract_document', contractDocumentSchema);

eventBus.on(getMcrServiceNameByDevOpsName(MCR_SERVICES.MCR_ESIGN_CONTRACT_MANAGEMENT) + "_emit", (mcrServiceMeta: McrServiceMeta) => {
  const connection = mcrServiceMeta.mongoDbConnectionObject;
  if (connection) {
    ContractDocument = connection.model<ContractDocumentInterface, ContractDocumentModel>('contract_document', contractDocumentSchema);
    console.log("ContractDocument model initialized with dynamic connection.");
  }
});
