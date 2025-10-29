"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.entry";
import { Editor, EditorState, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';
import Draggable from 'react-draggable';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const RENDER_DEBOUNCE_MS = 500;

export default function Home() {
  const [pageImages, setPageImages] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [error, setError] = useState("");
  const [hoveredPage, setHoveredPage] = useState(null);
  const [filename, setFilename] = useState("edited.pdf");
  const [textBoxes, setTextBoxes] = useState({}); 
  const [selectedTextBox, setSelectedTextBox] = useState(null);
  const [textStyle, setTextStyle] = useState({
    fontSize: '14px',
    color: '#000000',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none'
  });
  const [isAddingTextbox, setIsAddingTextbox] = useState(false);

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

  const addTextBox = (pageIndex, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    console.log('Adding textbox at:', { x, y, pageIndex });
    
    setTextBoxes(prev => {
      const newBox = {
        id: Date.now(),
        position: { x, y },
        content: EditorState.createEmpty(),
        style: { ...textStyle }
      };
      
      return {
        ...prev,
        [pageIndex]: [...(prev[pageIndex] || []), newBox]
      };
    });
  };

  const handleTextBoxChange = (pageIndex, boxId, newEditorState) => {
    setTextBoxes(prev => ({
      ...prev,
      [pageIndex]: prev[pageIndex].map(box => 
        box.id === boxId ? { ...box, content: newEditorState } : box
      )
    }));
  };

  const handleStyleChange = (style) => {
    if (selectedTextBox) {
      setTextBoxes(prev => ({
        ...prev,
        [selectedTextBox.pageIndex]: prev[selectedTextBox.pageIndex].map(box =>
          box.id === selectedTextBox.boxId ? { ...box, style: { ...box.style, ...style } } : box
        )
      }));
      setTextStyle(prev => ({ ...prev, ...style }));
    }
  };

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
        <button 
          onClick={() => setIsAddingTextbox(prev => !prev)} 
          disabled={!pdfBytes} 
          className={`button ${isAddingTextbox ? 'primary' : ''}`}
        >
          {isAddingTextbox ? 'Cancel Add Text' : '+ Add Text Box'}
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

      {pdfBytes && (
        <div className="properties-panel" style={{ marginTop: 20, marginBottom: 20 }}>
          <h3 style={{ marginBottom: 10 }}>Text Properties</h3>
          <div className="properties-content">
            <div className="property-group">
              <label>Font Size:</label>
              <select 
                value={textStyle.fontSize}
                onChange={(e) => handleStyleChange({ fontSize: e.target.value })}
                disabled={!selectedTextBox}
              >
                {['12px', '14px', '16px', '18px', '20px', '24px'].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            
            <div className="property-group">
              <label>Text Color:</label>
              <input 
                type="color"
                value={textStyle.color}
                onChange={(e) => handleStyleChange({ color: e.target.value })}
                disabled={!selectedTextBox}
              />
            </div>

            <div className="property-group">
              <label>Style:</label>
              <div className="button-group">
                <button 
                  onClick={() => handleStyleChange({ 
                    fontWeight: textStyle.fontWeight === 'bold' ? 'normal' : 'bold' 
                  })}
                  className={`format-btn ${textStyle.fontWeight === 'bold' ? 'active' : ''}`}
                  disabled={!selectedTextBox}
                >
                  B
                </button>
                <button 
                  onClick={() => handleStyleChange({ 
                    fontStyle: textStyle.fontStyle === 'italic' ? 'normal' : 'italic' 
                  })}
                  className={`format-btn ${textStyle.fontStyle === 'italic' ? 'active' : ''}`}
                  disabled={!selectedTextBox}
                >
                  I
                </button>
                <button 
                  onClick={() => handleStyleChange({ 
                    textDecoration: textStyle.textDecoration === 'underline' ? 'none' : 'underline' 
                  })}
                  className={`format-btn ${textStyle.textDecoration === 'underline' ? 'active' : ''}`}
                  disabled={!selectedTextBox}
                >
                  U
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        {pageImages.map((src, i) => (
          <div 
            key={i} 
            style={{ 
              marginBottom: 20, 
              position: "relative",
              cursor: isAddingTextbox ? 'crosshair' : 'default'
            }}
            onMouseEnter={() => setHoveredPage(i)}
            onMouseLeave={() => setHoveredPage(null)}
            onClick={(e) => {
              if (isAddingTextbox) {
                addTextBox(i, e);
                setIsAddingTextbox(false);
              }
            }}
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
            {textBoxes[i]?.map((box) => (
              <Draggable
                key={box.id}
                defaultPosition={box.position}
                bounds="parent"
              >
                <div
                  className={`text-box ${selectedTextBox?.boxId === box.id ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTextBox({ pageIndex: i, boxId: box.id });
                  }}
                  style={{
                    left: `${box.position.x}px`,
                    top: `${box.position.y}px`,
                    cursor: 'move',
                    ...box.style
                  }}
                >
                  <button
                    className="delete-textbox"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTextBoxes(prev => ({
                        ...prev,
                        [i]: prev[i].filter(b => b.id !== box.id)
                      }));
                      if (selectedTextBox?.boxId === box.id) {
                        setSelectedTextBox(null);
                      }
                    }}
                    title="Delete text box"
                  >
                    ×
                  </button>
                  <div style={{ position: 'relative' }}>
                    <Editor
                      editorState={box.content}
                      onChange={(newState) => handleTextBoxChange(i, box.id, newState)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              </Draggable>
            ))}
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