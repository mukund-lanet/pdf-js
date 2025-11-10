import React from 'react';

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

export type CanvasElement = TextElement | ImageElement | SignatureElement;
  
export interface PageInfo {
  pageWidth: number;
  pageHeight: number;
  scale: number;
}