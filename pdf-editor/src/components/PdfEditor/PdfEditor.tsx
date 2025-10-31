'use client';
import { useState, useRef } from 'react';
import styles from './PdfEditor.module.scss';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import SignaturePad from '../SignaturePad/SignaturePad';
import PDFCanvasViewer from '../PDFCanvasViewer/PDFCanvasViewer';

const PdfEditor = () => {
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const imageUploadInputRef = useRef<HTMLInputElement>(null);
  const [isSignaturePadOpen, setIsSignaturePadOpen] = useState(false);

  const [activeTool, setActiveTool] = useState<null | 'text' | 'image' | 'signature'>(null);
  const stagedImageFile = useRef<File | null>(null);
  const [pendingSignature, setPendingSignature] = useState<string | null>(null);

  const createNewPdf = async () => {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.addPage();
    const bytes = await pdfDoc.save();
    setTotalPages(1);
    setPdfBytes(bytes);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    setTotalPages(pdfDoc.getPageCount());
    const bytes = await pdfDoc.save();
    setPdfBytes(bytes);
  };
  const openFileUpload = () => uploadInputRef.current?.click();

  const handleImageToolbarClick = () => imageUploadInputRef.current?.click();
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    stagedImageFile.current = file || null;
    if (file) setActiveTool('image');
  };

  const addTextField = () => setActiveTool('text');

  const handleSignatureToolbarClick = () => setIsSignaturePadOpen(true);
  const handleSaveSignature = (signature: string) => {
    setIsSignaturePadOpen(false);
    setPendingSignature(signature);
    setActiveTool('signature');
  };
  const handleCancelSignature = () => setIsSignaturePadOpen(false);

  const handleCanvasClick = async (x: number, y: number, info: { pageWidth: number; pageHeight: number }, pageNumber: number) => {
    if (!activeTool || !pdfBytes) return;
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPages()[pageNumber - 1];
    const pdfY = info.pageHeight - y;
    if (activeTool === 'text') {
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      page.drawText('This is a text field!', {
        x,
        y: pdfY,
        font: helveticaFont,
        size: 24,
        color: rgb(0, 0, 0),
      });
      setActiveTool(null);
    } else if (activeTool === 'image' && stagedImageFile.current) {
      const file = stagedImageFile.current;
      const imgBuff = await file.arrayBuffer();
      let image;
      if (file.type === 'image/jpeg') image = await pdfDoc.embedJpg(imgBuff);
      else image = await pdfDoc.embedPng(imgBuff);
      page.drawImage(image, {
        x,
        y: pdfY - (image.height / 4),
        width: image.width / 4,
        height: image.height / 4
      });
      stagedImageFile.current = null;
      setActiveTool(null);
    } else if (activeTool === 'signature' && pendingSignature) {
      const b64 = pendingSignature.split(',')[1];
      const binStr = atob(b64);
      const uint8 = new Uint8Array(binStr.length);
      for (let i = 0; i < binStr.length; i++) uint8[i] = binStr.charCodeAt(i);
      const pngImage = await pdfDoc.embedPng(uint8);
      page.drawImage(pngImage, {
        x,
        y: pdfY - (pngImage.height / 2),
        width: pngImage.width / 2,
        height: pngImage.height / 2,
      });
      setPendingSignature(null);
      setActiveTool(null);
    }
    const bytes = await pdfDoc.save();
    setPdfBytes(bytes);
  };

  return (
    <div className={styles.container}>
      {isSignaturePadOpen && (
        <SignaturePad
          onSave={handleSaveSignature}
          onClose={handleCancelSignature}
        />
      )}
      <div className={styles.header}>
        <button className={styles.button} onClick={createNewPdf}>
          New Document
        </button>
        <input
          type="file"
          accept="application/pdf"
          ref={uploadInputRef}
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <button className={styles.button} onClick={openFileUpload}>
          Upload PDF
        </button>
      </div>
      <div className={styles.main}>
        <div className={styles.previewPanel}>
          <h2>Preview</h2>
        </div>
        <div className={styles.editorPanel}>
          <div className={styles.editorToolbar}>
            <button onClick={addTextField} style={activeTool === 'text' ? { background: '#e0e0ff' } : undefined}>Add Text</button>
            <input
              type="file"
              accept="image/png, image/jpeg"
              ref={imageUploadInputRef}
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <button onClick={handleImageToolbarClick} style={activeTool === 'image' ? { background: '#e0e0ff' } : undefined}>Add Image</button>
            <button onClick={handleSignatureToolbarClick} style={activeTool === 'signature' ? { background: '#e0e0ff' } : undefined}>Add Signature</button>
          </div>
          <div className={styles.pdfViewer} style={{ background: '#fff', minHeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
            {pdfBytes && Array.from({ length: totalPages }, (_, i) => (
              <PDFCanvasViewer
                key={i + 1}
                pdfBytes={pdfBytes}
                pageNumber={i + 1}
                onCanvasClick={activeTool ? (x, y, info) => handleCanvasClick(x, y, info, i + 1) : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfEditor;
