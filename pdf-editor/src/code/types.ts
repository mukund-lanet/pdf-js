import React from 'react';

export enum DRAWER_COMPONENT_CATEGORY {
  ADD_ELEMENTS = "add_elements",
  PAGES = "Pages",
  DOCUMENT_VARIABLES = "Document variables",
  CONTENT_LIBRARY = "Content Library",
  SETTINGS = "Settings"
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
  order: number; // Position in vertical stack
  height: number;
  width?: number; // Internal width
  imageData?: string; // base64
  imageUrl?: string; // URL-based image
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
  imageData: string; // base64
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
  value?: string; // Selected date value (ISO format)
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
  content: string; // Initials text
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
  order: number; // Position in vertical stack
  height: number;
  content: string; // Heading text
  subtitle?: string; // Subtitle/Description text
  page: number;
  fontSize?: number;
  fontWeight?: string;
  subtitleFontSize?: number;
  subtitleFontWeight?: string;
  subtitleColor?: string;
  // Text formatting properties
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

export type CanvasElement = BlockElement | FillableFieldElement;

export interface PageInfo {
  pageWidth: number;
  pageHeight: number;
  scale: number;
}

export interface PageDimension {
  pageWidth: number;
  pageHeight: number;
}

export interface DocumentVariable {
  name: string;
  value: string;
  isSystem?: boolean;
}

export const isBlockElement = (element: CanvasElement): element is HeadingElement | ImageElement | VideoElement | TableElement => {
  return ['heading', 'image', 'video', 'table'].includes(element.type);
};

export function isFillableElement(element: CanvasElement): element is FillableFieldElement {
  return ['text-field', 'signature', 'date', 'initials', 'checkbox'].includes(element.type);
}

export const noDocument = {
  message: "No documents found",
  description: "There are no documents to display.",
  tips: [
    "Create new document",
    "Upload pdf and start editing",
    "Add docusign in integration"
  ],
  iconName: "pen-line",
  tipsTitle: "Quick tips",
  button: undefined
}