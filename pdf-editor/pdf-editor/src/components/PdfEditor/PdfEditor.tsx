'use client';
import styles from './PdfEditor.module.scss';

const PdfEditor = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.button}>New Document</button>
        <button className={styles.button}>Upload PDF</button>
      </div>
      <div className={styles.main}>
        <div className={styles.previewPanel}>
          <h2>Preview</h2>
        </div>
        <div className={styles.editorPanel}>
          <div className={styles.editorToolbar}>
            <button>Add Text</button>
            <button>Add Image</button>
            <button>Add Signature</button>
          </div>
          <div className={styles.pdfViewer}>
            {/* PDF will be rendered here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfEditor;
