import mongoose, { Document as MongoDocument, Schema } from 'mongoose';
import { ICanvasElement, IDocumentVariable, ISigner, Page } from '../helper/interface';

export interface IDocument extends MongoDocument {
  name: string;
  status: 'draft' | 'waiting' | 'completed' | 'archived';
  date: Date;
  signers: ISigner[];
  progress: number;
  dueDate?: string;
  createdBy?: string;
  signingOrder?: boolean;
  variables: IDocumentVariable[];
  business_id: string; // Business identifier for multi-tenancy
  pages: Page[];
  // PDF Editor State
  uploadPath?: string;
  totalPages: number;
  canvasElements: ICanvasElement[];
  pageDimensions: Map<string, { pageWidth: number; pageHeight: number }>;
  documentType: 'upload-existing' | 'new_document' | null;
}

const DocumentSchema = new Schema<IDocument>({
  name: { type: String, required: true },
  status: { type: String, enum: ['draft', 'waiting', 'completed', 'archived'], default: 'draft' },
  date: { type: Date, default: Date.now },
  signers: [{
    name: { type: String, required: true },
    email: { type: String, required: true },
    type: { type: String, enum: ['signer', 'approver', 'cc'], required: true },
    order: { type: Number }
  }],
  progress: { type: Number, default: 0 },
  dueDate: { type: String },
  createdBy: { type: String },
  signingOrder: { type: Boolean, default: false },
  business_id: { type: String, required: true },
  pages: [{
    page_src: { type: String },
    from_pdf: { type: Boolean, default: false },
    imagePath: { type: String },
    layout: [{ type: Schema.Types.Mixed }]
  }],
  uploadPath: { type: String },
  totalPages: { type: Number, default: 0 },
  canvasElements: [{ type: Schema.Types.Mixed }],
  pageDimensions: { type: Map, of: { pageWidth: Number, pageHeight: Number } },
  documentType: { type: String, enum: ['upload-existing', 'new_document'], default: 'new_document' }
}, { timestamps: true });

export default mongoose.model<IDocument>('Document', DocumentSchema);
