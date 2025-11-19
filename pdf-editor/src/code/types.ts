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
  type: 'text';
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  page: number;
  fontSize?: number;
  color?: string;
}

export interface ImageElement {
  type: 'image';
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  imageData: string; // base64
  page: number;
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
}

export type CanvasElement = TextElement | ImageElement | SignatureElement | DateElement | InitialsElement | CheckboxElement;

export interface PageInfo {
  pageWidth: number;
  pageHeight: number;
  scale: number;
}

export interface PageDimension {
  pageWidth: number;
  pageHeight: number;
}