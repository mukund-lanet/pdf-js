// ==================== GOHIGHLEVEL ARCHITECTURE TYPES ====================

// Core Page-Centric Structure
export interface Page {
  type: "Page";
  version: number;
  id: string;
  children: (BlockElements | FillableElements)[];
  component: PageComponent;
  responsiveStyles: {
    large: PageStyles;
  };
}

export interface PageComponent {
  id?: string;
  name: "Page" | "Body"; // Updated to allow "Body" as seen in PDFPage.tsx
  options: {
    src: string; // Firebase image URL or "" for blank page
    pageDimensions: {
      dimensions: { width: number; height: number };
      margins: { top: number; right: number; bottom: number; left: number };
      rotation: "portrait" | "landscape";
    };
    [key: string]: any; // Allow other GHL options like padding, bgColor
  };
}

export interface PageStyles {
  backgroundColor: string;
  backgroundPosition: string;
  backgroundSize: string;
  backgroundRepeat: string;
  opacity: number;
}

// Element Position & Styling
export interface ElementPosition {
  top: number;
  left: number;
  bottom?: number;
  right?: number;
  width?: number;
  height?: number;
  preferBottom?: boolean;
  preferRight?: boolean;
}

export interface ElementScale {
  scaleX: number;
  scaleY: number;
}

export interface ElementDimensions {
  width: number;
  height: number;
}

export interface ResponsiveStyles {
  large: {
    position?: ElementPosition;
    dimensions?: ElementDimensions;
    scale?: ElementScale;
    paddingTop?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    paddingRight?: string;
    marginTop?: string | null;
    marginBottom?: string | null;
    marginLeft?: string | null;
    marginRight?: string | null;
    backgroundColor?: string;
    align?: string;
    height?: string;
    width?: string;
    imageEffect?: string;
    textAlign?: string;
    fontStyle?: string;
    textDecoration?: string;
    color?: string;
    fontSize?: number;
    fontWeight?: string;
    fontFamily?: string;
  };
}

// Base Element Structure
export interface BaseElement {
  type: string;
  version: number;
  id: string;
  children: [];
  component: {
    name: string;
    isDraggable?: boolean;
    options: Record<string, any>;
  };
  responsiveStyles: ResponsiveStyles;
}

// ==================== BLOCK ELEMENTS ====================

export interface TextElement extends BaseElement {
  type: "Text";
  component: {
    name: "Text Element";
    options: {
      text: string; // HTML content
    };
  };
}

export interface ImageElement extends BaseElement {
  type: "Image";
  component: {
    name: "Image Element";
    options: {
      src: string;
      altText: string;
      href: string;
    };
  };
}

export interface VideoElement extends BaseElement {
  type: "Video";
  component: {
    name: "Video Element";
    options: {
      src: string;
      html: string;
    };
  };
}

export interface TableElement extends BaseElement {
  type: "Table";
  component: {
    name: "Table Element";
    options: {
      text: string; // HTML table content
    };
  };
}

export interface PageBreakElement extends BaseElement {
  type: "PageBreak";
  component: {
    name: "Page Break Element";
    options: {};
  };
}

export type BlockElements = 
  | TextElement 
  | ImageElement 
  | VideoElement 
  | TableElement
  | PageBreakElement;

// ==================== FILLABLE ELEMENTS ====================

export interface SignatureElement extends BaseElement {
  type: "Signature";
  component: {
    isDraggable: true;
    name: "Signature Element";
    options: {
      isGhost: boolean;
      showName: boolean;
      text: string;
      required: boolean;
      fieldId: string;
      src: string;
      recipient: string;
      timestamp: number | null;
      entityName: string;
    };
  };
}

export interface TextFieldElement extends BaseElement {
  type: "TextField";
  component: {
    isDraggable: true;
    name: "Text Field Element";
    options: {
      isGhost: boolean;
      text: string;
      required: boolean;
      fieldId: string;
      src: string;
      recipient: string;
      timestamp: number | null;
      entityName: string;
      placeholder: string;
    };
  };
}

export interface DateFieldElement extends BaseElement {
  type: "DateField";
  component: {
    isDraggable: true;
    name: "Text Field Element"; // GHL uses same name
    options: {
      isGhost: boolean;
      text: string;
      required: boolean;
      fieldId: string;
      src: string;
      recipient: string;
      timestamp: number | null;
      entityName: string;
      placeholder: string;
      availableDates: string;
      dateFormat: string;
    };
  };
}

export interface InitialsFieldElement extends BaseElement {
  type: "InitialsField";
  component: {
    isDraggable: true;
    name: "Initials Field Element";
    options: {
      isGhost: boolean;
      text: string;
      required: boolean;
      fieldId: string;
      src: string;
      recipient: string;
      timestamp: number | null;
      entityName: string;
    };
  };
}

export interface CheckboxElement extends BaseElement {
  type: "Checkbox";
  component: {
    isDraggable: true;
    name: "Checkbox Field Element";
    options: {
      isGhost: boolean;
      text: string;
      required: boolean;
      preChecked: boolean;
      isConditionalLogic: boolean;
      fieldId: string;
      src: string;
      recipient: string;
      timestamp: number | null;
      entityName: string;
    };
  };
}

export type FillableElements = 
  | SignatureElement 
  | TextFieldElement 
  | DateFieldElement
  | InitialsFieldElement 
  | CheckboxElement;

// ==================== FILLABLE FIELDS GLOBAL REGISTRY ====================

export interface FillableField {
  value: string;
  fieldId: string;
  isRequired: boolean;
  recipient: string;
  hasCompleted: boolean;
  entityType: string;
  id: string;
  type: "TextField" | "DateField" | "Checkbox" | "Signature" | "InitialsField";
}

// ==================== DOCUMENT & CONTRACT TYPES ====================

export interface Signer {
  name: string;
  email: string;
  type: 'signer' | 'approver' | 'cc';
  order?: number;
}

export interface DocumentItem {
  _id?: string;
  name: string;
  status: 'draft' | 'waiting' | 'completed' | 'archived';
  date: string;
  signers: Signer[];
  progress: number;
  dueDate?: string;
  createdBy?: string;
  signingOrder?: boolean;
  // GHL structure
  pages?: Page[];
  fillableFields?: FillableField[];
  variables?: DocumentVariable[];
}

export interface ContractItem {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'expired';
  value: number;
  date: string;
}

// ==================== ENUMS ====================

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

export enum DRAWER_COMPONENT_CATEGORY {
  ADD_ELEMENTS = "add_elements",
  PAGES = "Pages",
  DOCUMENT_VARIABLES = "Document variables",
  CONTENT_LIBRARY = "Content Library",
  SETTINGS = "Settings",
  RECIPIENTS = "Recipients"
}

// ==================== VARIABLES ====================

export interface DocumentVariable {
  fieldKey?: string; // GHL uses fieldKey
  name?: string;     // Our old format uses name
  value: string;
  type?: "default" | "custom";
  isSystem?: boolean;
}

// ==================== HELPER FUNCTIONS ====================

export const isBlockElement = (element: BlockElements | FillableElements): element is BlockElements => {
  return ['Text', 'Image', 'Video', 'Table', 'PageBreak'].includes(element.type);
};

export const isFillableElement = (element: BlockElements | FillableElements): element is FillableElements => {
  return ['TextField', 'DateField', 'Checkbox', 'Signature', 'InitialsField'].includes(element.type);
};

// ==================== LEGACY SUPPORT (Temporary during migration) ====================

// export interface PageDimension {
//   pageWidth: number;
//   pageHeight: number;
// }

// export interface PageInfo {
//   pageWidth: number;
//   pageHeight: number;
//   scale: number;
// }

// export interface DraggableBlockItemProps {
//   item: { type: string; label: string; icon: string };
//   activeTool: string | null;
//   dispatch: any;
// }

// export interface DraggableToolbarItemProps {
//   item: { type: string; label: string; icon: string };
//   activeTool: string | null;
//   dispatch: any;
// }

// // Legacy Element Types
// export interface TextElement {
//   textDecoration?: string;
//   textAlign?: string;
//   fontStyle?: string;
//   fontWeight?: string;
//   type: 'text-field';
//   id: string;
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   content: string;
//   page: number;
//   fontSize?: number;
//   color?: string;
//   required?: boolean;
//   placeholder?: string;
// }

// export interface BoxSpacing {
//   top: number;
//   right: number;
//   bottom: number;
//   left: number;
// }

// export interface BlockStyle {
//   backgroundColor?: string;
//   padding?: BoxSpacing;
//   margin?: BoxSpacing;
// }

// export interface ImageElement extends BlockStyle {
//   type: 'image';
//   id: string;
//   order: number; 
//   height: number;
//   width?: number; 
//   imageData?: string; 
//   imageUrl?: string;
//   page: number;
//   align?: 'left' | 'center' | 'right';
//   imageEffect?: 'none' | 'grayscale';
// }

// export interface SignatureElement {
//   type: 'signature';
//   id: string;
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   imageData: string; 
//   page: number;
//   content?: string;
//   showSignerName?: boolean;
// }

// export interface DateElement {
//   type: 'date';
//   id: string;
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   value?: string;
//   page: number;
//   placeholder?: string;
//   dateFormat?: string;
//   availableDates?: string;
//   required?: boolean;
// }

// export interface InitialsElement {
//   type: 'initials';
//   id: string;
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   content: string;
//   page: number;
// }

// export interface CheckboxElement {
//   type: 'checkbox';
//   id: string;
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   checked: boolean;
//   page: number;
//   required?: boolean;
// }

// export interface HeadingElement extends BlockStyle {
//   type: 'heading';
//   id: string;
//   order: number; 
//   height: number;
//   content: string; 
//   subtitle?: string;
//   page: number;
//   fontSize?: number;
//   fontWeight?: string;
//   subtitleFontSize?: number;
//   subtitleFontWeight?: string;
//   subtitleColor?: string;
//   textAlign?: 'left' | 'center' | 'right';
//   fontStyle?: 'normal' | 'italic';
//   textDecoration?: 'none' | 'underline';
//   color?: string;
//   fontFamily?: string;
//   tagName?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
// }

// export interface VideoElement extends BlockStyle {
//   type: 'video';
//   id: string;
//   order: number;
//   height: number;
//   width?: number;
//   videoUrl?: string;
//   page: number;
// }

// export interface TableElement extends BlockStyle {
//   type: 'table';
//   id: string;
//   order: number;
//   height: number;
//   rows: number;
//   columns: number;
//   data?: string[][];
//   page: number;

//   textAlign?: 'left' | 'center' | 'right';
//   fontStyle?: 'normal' | 'italic';
//   textDecoration?: 'none' | 'underline';
//   color?: string;
//   fontSize?: number;
//   fontWeight?: string;
//   fontFamily?: string;
// }

export type CanvasElement = BlockElements | FillableElements;

// export type BlockElement = HeadingElement | ImageElement | VideoElement | TableElement;

// export type FillableFieldElement = TextElement | SignatureElement | DateElement | InitialsElement | CheckboxElement;
// export type CanvasElement = BlockElement | FillableFieldElement;

// export const isBlockElement = (element: CanvasElement): element is HeadingElement | ImageElement | VideoElement | TableElement => {
//   return ['heading', 'image', 'video', 'table'].includes(element.type);
// };

// export function isFillableElement(element: CanvasElement): element is FillableFieldElement {
//   return ['text-field', 'signature', 'date', 'initials', 'checkbox'].includes(element.type);
// }