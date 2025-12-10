import * as pdfjsLib from "pdfjs-dist";
import pdf2img from "pdf-img-convert";

// IMPORTANT: you MUST set workerSrc for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Convert a PDF file into an array of PNG Blobs using pdf-img-convert
 * @param {File | ArrayBuffer} pdfInput
 * @returns {Promise<Blob[]>} array of blobs (one per page)
 */
export async function pdfToImages(pdfInput: File | ArrayBuffer) {
  let arrayBuffer;

  if (pdfInput instanceof File) {
    arrayBuffer = await pdfInput.arrayBuffer();
  } else if (pdfInput instanceof ArrayBuffer) {
    arrayBuffer = pdfInput;
  } else {
    throw new Error("pdfInput must be a File or ArrayBuffer");
  }

  // Convert pages to PNGs
  const imagesArray = await pdf2img.convert(arrayBuffer, {
    scale: 2,        // Higher = better quality (1–3 recommended)
    outputType: "png"
  });

  // pdf-img-convert returns Uint8Array objects → convert to Blob
  const blobs = imagesArray.map((uint8: Uint8Array) => {
    return new Blob([uint8], { type: "image/png" });
  });

  return blobs;
}
