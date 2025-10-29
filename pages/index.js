"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const RENDER_DEBOUNCE_MS = 500;

export default function Home() {
  const [pageImages, setPageImages] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [error, setError] = useState("");
  const [hoveredPage, setHoveredPage] = useState(null);
  const [filename, setFilename] = useState("edited.pdf");

  const pdfDocRef = useRef(null);
  const [pdfBytes, setPdfBytes] = useState(null);
  const fileInputRef = useRef();
  const renderTimeoutRef = useRef(null);

  const renderPdfToImages = useCallback(async (arrayBuffer) => {
    if (!arrayBuffer) {
        setPageImages([]);
        setPageCount(0);
        return;
    }

    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }

    renderTimeoutRef.current = setTimeout(async () => {
        try {
            const uint8 = Uint8Array.from(arrayBuffer instanceof Uint8Array ? arrayBuffer : new Uint8Array(arrayBuffer));
            
            const pdf = await pdfjsLib.getDocument({ data: uint8 }).promise;
            const numPages = pdf.numPages;
            const pages = [];

            const pageRenderPromises = [];
            for (let i = 1; i <= numPages; i++) {
                pageRenderPromises.push(
                    (async () => {
                        const page = await pdf.getPage(i);
                        const viewport = page.getViewport({ scale: 1.5 });
                        const canvas = document.createElement("canvas");
                        const context = canvas.getContext("2d");
                        canvas.width = viewport.width;
                        canvas.height = viewport.height;
                        await page.render({ canvasContext: context, viewport }).promise;
                        return canvas.toDataURL();
                    })()
                );
            }

            const renderedPages = await Promise.all(pageRenderPromises);
            
            setPageImages(renderedPages);
            setPageCount(numPages);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Failed to render PDF.");
        }
    }, RENDER_DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    renderPdfToImages(pdfBytes);
  }, [pdfBytes, renderPdfToImages]);

  useEffect(() => {
    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, []);


  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.includes("pdf")) {
      setError("Please upload a valid PDF file.");
      return;
    }
    setError("");
    setFilename(`edited-${file.name}`);
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
  
    pdfDocRef.current = await PDFDocument.load(bytes);
    setPdfBytes(bytes);
  }

  const saveAndSetNewBytes = useCallback(async () => {
    if (!pdfDocRef.current) return;
    const newBytes = await pdfDocRef.current.save();
    setPdfBytes(new Uint8Array(newBytes)); 
    setPageCount(pdfDocRef.current.getPageCount());
  }, []);

  async function addBlankPage(index = null) {
    if (!pdfDocRef.current) return;
    
    const doc = pdfDocRef.current;
    const totalPages = doc.getPageCount();
    
    if (index === null || index >= totalPages) {
      doc.addPage();
    } else {
      doc.insertPage(index); 
    }
    
    await saveAndSetNewBytes();
  }

  async function removePage(index) {
    if (!pdfDocRef.current) return;
    const doc = pdfDocRef.current;
    const total = doc.getPageCount();
    
    if (index < 0 || index >= total) return;
    
    // Use the optimized built-in method: removePage
    doc.removePage(index); 

    // Handle case where the last page is removed (PDF-lib seems to keep an empty doc)
    if (doc.getPageCount() === 0) {
        doc.addPage();
    }
    
    await saveAndSetNewBytes();
  }

  async function downloadPdf() {
    if (!pdfBytes) return;
    saveAs(new Blob([pdfBytes], { type: "application/pdf" }), filename);
  }

  return (
    <div className="container card" style={{ maxWidth: "900px", margin: "2rem auto" }}>
      <h2>Simple PDF Reader — Editor</h2>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleUpload}
          style={{ display: 'none' }}
        />
        <button onClick={() => fileInputRef.current.click()} className="button primary">
          Upload PDF
        </button>
        <button onClick={() => addBlankPage(pageCount)} disabled={!pdfBytes} className="button">
          + Add blank page at end
        </button>
        <button onClick={downloadPdf} disabled={!pdfBytes} className="button">
          ⤓ Download PDF
        </button>
      </div>

      {pdfBytes && (
        <>
          <p style={{ marginTop: 10 }}>
            Pages: {pageCount} • File: {filename}
          </p>
        </>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: 20 }}>
        {pageImages.map((src, i) => (
          <div 
            key={i} 
            style={{ marginBottom: 20, position: "relative" }}
            onMouseEnter={() => setHoveredPage(i)}
            onMouseLeave={() => setHoveredPage(null)}
          >
            <img
              src={src}
              alt={`Page ${i + 1}`}
              style={{
                width: "100%",
                border: "1px solid #ddd",
                borderRadius: 8,
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            />
            {hoveredPage === i && (
              <div 
                style={{
                  display: "flex", 
                  width: "100%", 
                  padding: "16px 0px 0px 0px", 
                  gap: "16px", 
                  alignItems: "center", 
                  justifyContent: "center"
                }}
                onMouseEnter={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => addBlankPage(i + 1)}
                  disabled={!pdfBytes} 
                  className="button"
                >
                  +
                </button>
                <button
                  onClick={() => removePage(i)}
                  className="button"
                >
                  -
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}