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

export interface TextElement {
  textDecoration?: string;
  textAlign?: string;
  fontStyle?: string;
  fontWeight?: string;
  type: 'text-field';
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  page: number;
  fontSize?: number;
  color?: string;
  required?: boolean;
  placeholder?: string;
}

export interface ImageElement extends BlockStyle {
  type: 'image';
  id: string;
  order: number; 
  height: number;
  width?: number; 
  imageData?: string; 
  imageUrl?: string;
  page: number;
  align?: 'left' | 'center' | 'right';
  imageEffect?: 'none' | 'grayscale';
}

export interface SignatureElement {
  type: 'signature';
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  imageData: string; 
  page: number;
  content?: string;
  showSignerName?: boolean;
}

export interface DateElement {
  type: 'date';
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  value?: string;
  page: number;
  placeholder?: string;
  dateFormat?: string;
  availableDates?: string;
  required?: boolean;
}

export interface InitialsElement {
  type: 'initials';
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  page: number;
}

export interface CheckboxElement {
  type: 'checkbox';
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  checked: boolean;
  page: number;
  required?: boolean;
}

export interface BoxSpacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface BlockStyle {
  backgroundColor?: string;
  padding?: BoxSpacing;
  margin?: BoxSpacing;
}

export interface HeadingElement extends BlockStyle {
  type: 'heading';
  id: string;
  order: number; 
  height: number;
  content: string; 
  subtitle?: string;
  page: number;
  fontSize?: number;
  fontWeight?: string;
  subtitleFontSize?: number;
  subtitleFontWeight?: string;
  subtitleColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
  color?: string;
  fontFamily?: string;
  tagName?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
}

export interface VideoElement extends BlockStyle {
  type: 'video';
  id: string;
  order: number;
  height: number;
  width?: number;
  videoUrl?: string;
  page: number;
}

export interface TableElement extends BlockStyle {
  type: 'table';
  id: string;
  order: number;
  height: number;
  rows: number;
  columns: number;
  data?: string[][];
  page: number;

  textAlign?: 'left' | 'center' | 'right';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
  color?: string;
  fontSize?: number;
  fontWeight?: string;
  fontFamily?: string;
}

export type BlockElement = HeadingElement | ImageElement | VideoElement | TableElement;

export type FillableFieldElement = TextElement | SignatureElement | DateElement | InitialsElement | CheckboxElement;

export type ICanvasElement = BlockElement | FillableFieldElement;

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

interface Page {
  page_src: String;
  from_pdf: Boolean;
  imagePath: String;
  layout: ICanvasElement[];
}

const DocumentSchema = new Schema<IDocument>({
  name: { type: String, required: true },
  status: { type: String, enum: ['draft', 'waiting', 'completed', 'archived'], default: 'draft' },
  date: { type: Date, default: Date.now },
  progress: { type: Number, default: 0 },
  dueDate: { type: String },
  createdBy: { type: String },
  signingOrder: { type: Boolean, default: false },
  business_id: { type: String, required: true, default: "HY7IAUl86AUMMqVbzGKn" },

  uploadPath: { type: String },
  totalPages: { type: Number, default: 0 },
  canvasElements: { type: Schema.Types.Mixed, default: [] },
  documentType: { type: String, enum: ['upload-existing', 'new_document'], default: 'new_document' }
}, { timestamps: true });

export default mongoose.model<IDocument>('Document', DocumentSchema);
