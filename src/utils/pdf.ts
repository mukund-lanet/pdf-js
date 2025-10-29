import { jsPDF } from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist';
import type { TextBox, Page } from '@/types/document';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function loadPDFFile(file: File): Promise<Page[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  
  const pages: Page[] = [];
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1 });
    
    // Create canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    if (!context) continue;
    
    // Render PDF page to canvas
    await page.render({
      canvasContext: context,
      viewport,
    }).promise;
    
    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, 'image/png');
    });
    
    pages.push({
      id: crypto.randomUUID(),
      width: viewport.width,
      height: viewport.height,
      source: 'uploaded',
      canvasBlob: blob,
      textBoxes: [],
    });
  }
  
  return pages;
}

export async function generatePDF(pages: Page[]): Promise<Blob> {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
  });
  
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    if (i > 0) {
      doc.addPage();
    }
    
    // If page has a canvas blob, add it as background
    if (page.canvasBlob) {
      const url = URL.createObjectURL(page.canvasBlob);
      try {
        doc.addImage(url, 'PNG', 0, 0, page.width, page.height);
      } finally {
        URL.revokeObjectURL(url);
      }
    }
    
    // Add text boxes
    page.textBoxes.forEach((textBox) => {
      addTextBoxToPDF(doc, textBox);
    });
  }
  
  return doc.output('blob');
}

function addTextBoxToPDF(doc: jsPDF, textBox: TextBox) {
  // TODO: Convert rich text to PDF text/formatting
  doc.text(textBox.html, textBox.x, textBox.y);
}