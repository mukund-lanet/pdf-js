'use client';

import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist/types/src/display/api';

let pdfjs: any;
let initialized = false;

async function initializePdfJs() {
  if (initialized) return;

  try {
    // Load PDF.js dynamically
    const pdf = await import('pdfjs-dist');
    pdfjs = pdf;
    
    // Configure worker using CDN
    pdfjs.GlobalWorkerOptions.workerSrc = 
      `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  } catch (error) {
    console.error('Error initializing PDF.js:', error);
    throw new Error('Failed to initialize PDF.js');
  }
}

// Initialize immediately in browser environment
if (typeof window !== 'undefined') {
  initializePdfJs().catch(console.error);
}

interface RenderPageParams {
  page: PDFPageProxy;
  scale?: number;
  canvas?: HTMLCanvasElement;
}

export async function loadPDF(file: File): Promise<PDFDocumentProxy> {
  if (typeof window === 'undefined') {
    throw new Error('loadPDF can only be used in browser');
  }

  try {
    if (!initialized) {
      await initializePdfJs();
    }

    const arrayBuffer = await file.arrayBuffer();
    return await pdfjs.getDocument({
      data: arrayBuffer,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@latest/cmaps/',
      cMapPacked: true,
    }).promise;
  } catch (error) {
    console.error('Error loading PDF:', error);
    throw new Error('Failed to load PDF. Please try again.');
  }
}

async function createPageCanvas({ page, scale = 1, canvas }: RenderPageParams) {
  // Get page dimensions at desired scale
  const viewport = page.getViewport({ scale });

  // Create or reuse canvas
  const pageCanvas = canvas || document.createElement('canvas');
  const context = pageCanvas.getContext('2d');
  if (!context) {
    throw new Error('Could not get canvas context');
  }

  // Set canvas dimensions
  pageCanvas.width = viewport.width;
  pageCanvas.height = viewport.height;

  // Render PDF page to canvas
  try {
    await page.render({
      canvasContext: context,
      viewport,
    }).promise;

    return pageCanvas;
  } catch (error) {
    console.error('Error rendering PDF page:', error);
    throw error;
  }
}

export async function renderPageToCanvas(
  page: PDFPageProxy,
  scale: number = 1
): Promise<Blob> {
  const canvas = await createPageCanvas({ page, scale });

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Could not convert canvas to blob'));
      }
    }, 'image/png');
  });
}

export async function generatePageThumbnail(
  page: PDFPageProxy,
  maxWidth: number = 150
): Promise<Blob> {
  // Calculate thumbnail scale
  const viewport = page.getViewport({ scale: 1 });
  const scale = maxWidth / viewport.width;
  
  return renderPageToCanvas(page, scale);
}