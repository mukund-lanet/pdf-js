export interface TextBox {
  id: string;
  pageId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  html: string;
  style: {
    fontSize?: number;
    color?: string;
    textAlign?: 'left' | 'center' | 'right';
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Page {
  id: string;
  width: number;
  height: number;
  source: 'blank' | 'uploaded' | 'appended';
  canvasBlob?: Blob;
  thumbnailBlob?: Blob;
  textBoxes: TextBox[];
  editorHtml?: string;
}

export interface Document {
  id: string;
  title: string;
  pages: Page[];
  createdAt: Date;
  updatedAt: Date;
}