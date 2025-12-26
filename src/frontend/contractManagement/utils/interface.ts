export interface Signer {
  name: string;
  email: string;
  type: 'signer' | 'approver' | 'cc';
  order?: number;
}

export interface DocumentItem {
  _id?: string;
  name?: string;
  status: 'draft' | 'waiting' | 'completed' | 'archived';
  date?: string;
  signers?: Signer[];
  progress?: number;
  dueDate?: string;
  createdBy?: string;
  signingOrder?: boolean;
  canvasElements?: CanvasElement[];
}

export interface ContractItem {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'expired';
  value: number;
  date: string;
}

export enum CONTRACT_MANAGEMENT_TAB {
  DOCUMENTS = 'documents',
  CONTRACTS = 'contracts'
}

export enum DIALOG_DRAWER_NAMES {
  PDF_BUILDER_DRAWER = 'pdfBuilderDrawerOpen',
  DOCUMENT_DRAWER = 'documentDrawerOpen',
  IDENTITY_VERIFICATION_DIALOG = 'identityVerificationDialogOpen',
  GLOBAL_DOCUMENT_SETTINGS_DIALOG = 'globalDocumentSettingsDialogOpen',
  BRANDING_CUSTOMIZATION_DIALOG = 'brandingCustomizationDialogOpen'
}

// pdf-editor
export enum DRAWER_COMPONENT_CATEGORY {
  ADD_ELEMENTS = "add_elements",
  PAGES = "pages",
  RECIPIENTS = "recipients"
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
}

export interface CheckboxElement {
  type: 'checkbox';
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  checked: boolean;
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
}

export interface TableElement extends BlockStyle {
  type: 'table';
  id: string;
  order: number;
  height: number;
  rows: number;
  columns: number;
  data?: string[][];

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

export type CanvasElement = BlockElement | FillableFieldElement;

export interface PageInfo {
  pageWidth: number;
  pageHeight: number;
  scale: number;
}

export const isBlockElement = (element: CanvasElement): element is HeadingElement | ImageElement | VideoElement | TableElement => {
  return ['heading', 'image', 'video', 'table'].includes(element.type);
};

export function isFillableElement(element: CanvasElement): element is FillableFieldElement {
  return ['text-field', 'signature', 'date', 'initials', 'checkbox'].includes(element.type);
}

export interface DraggableBlockItemProps {
  item: { type: string; label: string; icon: string };
  activeTool: string | null;
  dispatch: any;
}

export interface DraggableToolbarItemProps {
  item: { type: string; label: string; icon: string };
  activeTool: string | null;
  dispatch: any;
}

export interface Page {
  id?: string;
  pageSrc?: string;
  fromPdf?: boolean;
  elements: CanvasElement[];
}