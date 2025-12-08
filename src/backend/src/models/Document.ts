import mongoose, { Document as MongoDocument, Schema } from 'mongoose';

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

// Canvas Element Interfaces for proper typing
export interface IBlockElement {
  id: string;
  type: 'heading' | 'image' | 'video' | 'table';
  pageNumber: number;
  order: number;
  properties: any; // Flexible for different block types
}

export interface IFillableElement {
  id: string;
  type: 'text' | 'signature' | 'date' | 'checkbox' | 'initial';
  pageNumber: number;
  position: { x: number; y: number };
  properties: any; // Flexible for different fillable types
}

export type ICanvasElement = IBlockElement | IFillableElement;

export interface IDocument extends MongoDocument {
  name: string;
  status: 'draft' | 'waiting' | 'completed' | 'archived';
  date: Date;
  signers: ISigner[];
  progress: number;
  dueDate?: string;
  createdBy?: string;
  signingOrder?: boolean;
  business_id: string; // Business identifier for multi-tenancy
  
  // PDF Editor State
  uploadPath?: string;
  totalPages: number;
  canvasElements: ICanvasElement[];
  pageDimensions: Map<string, { pageWidth: number; pageHeight: number }>;
  variables: IDocumentVariable[];
  documentType: 'upload-existing' | 'new_document' | null;
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

const DocumentSchema = new Schema<IDocument>({
  name: { type: String, required: true },
  status: { type: String, enum: ['draft', 'waiting', 'completed', 'archived'], default: 'draft' },
  date: { type: Date, default: Date.now },
  signers: [SignerSchema],
  progress: { type: Number, default: 0 },
  dueDate: { type: String },
  createdBy: { type: String },
  signingOrder: { type: Boolean, default: false },
  business_id: { type: String, required: true, default: "HY7IAUl86AUMMqVbzGKn" },
  
  uploadPath: { type: String },
  totalPages: { type: Number, default: 0 },
  canvasElements: { type: Schema.Types.Mixed, default: [] },
  pageDimensions: { type: Map, of: new Schema({ pageWidth: Number, pageHeight: Number }) },
  variables: [DocumentVariableSchema],
  documentType: { type: String, enum: ['upload-existing', 'new_document'], default: 'new_document' }
}, { timestamps: true });

export default mongoose.model<IDocument>('Document', DocumentSchema);
