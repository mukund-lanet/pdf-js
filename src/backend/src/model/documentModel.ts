import { Schema, model, Document, Model } from "mongoose";
import { McrServiceMeta } from "mcr-common/src/expresshelper_common/helper/McrServiceMeta";
import eventBus from "mcr-common/src/expresshelper_common/helper/EventBus";

const SERVICE_NAME = "mcr-contract-management-service";

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

export interface IDocument {
  business_id: string;
  company_id: string;
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
}

export interface DocumentInterface extends IDocument, Document {}

interface DocumentModel extends Model<DocumentInterface> {
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

const documentSchema: Schema<DocumentInterface> = new Schema({
  business_id: { type: String, required: true },
  company_id: { type: String, required: true },
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
  documentType: { type: String, enum: ['upload-existing', 'new_document'], default: 'new_document' }
}, { timestamps: true });

export let ContractDocument = model<DocumentInterface, DocumentModel>('contract_document', documentSchema);

eventBus.on(SERVICE_NAME + "_emit", (mcrServiceMeta: McrServiceMeta) => {
  const connection = mcrServiceMeta.mongoDbConnectionObject;
  if (connection) {
    ContractDocument = connection.model<DocumentInterface, DocumentModel>('contract_document', documentSchema);
    console.log("ContractDocument model initialized with dynamic connection.");
  }
});
