
'use client';
import { useEffect, useRef, useState } from 'react';
import styles from 'app/(after-login)/(with-header)/pdf-editor/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import { useSelector } from 'react-redux';
import { RootState } from './store/reducer/pdfEditor.reducer';

interface ThumbnailSidebarProps {
  pdfBytes: Uint8Array | null;
  currentPage: number;
  onThumbnailClick: (pageNumber: number) => void;
}

const ThumbnailSidebar = ({ pdfBytes, currentPage, onThumbnailClick }: ThumbnailSidebarProps) => {
  const thumbnailContainerRef = useRef<HTMLDivElement | null>(null);
  const [pdfjsLib, setPdfjsLib] = useState<any>(null);
  const totalPages = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.totalPages);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('pdfjs-dist').then((pdfjs) => {
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
        setPdfjsLib(pdfjs);
      }).catch((error) => {
        console.error('Failed to load PDF.js:', error);
      });
    }
  }, []);

  useEffect(() => {
    const renderThumbnails = async () => {
      if (!pdfBytes || !pdfjsLib || !thumbnailContainerRef.current) return;

      thumbnailContainerRef.current.innerHTML = ''; // Clear previous thumbnails

      try {
        const pdfBytesCopy = new Uint8Array(pdfBytes);
        const loadingTask = pdfjsLib.getDocument({ data: pdfBytesCopy });
        const pdf = await loadingTask.promise;

        for (let i = 1; i <= totalPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.5 });

          const thumbnailWrapper = document.createElement('div');
          thumbnailWrapper.className = `${styles.thumbnailItem} ${i === currentPage ? styles.activeThumbnail : ''}`;
          thumbnailWrapper.onclick = () => onThumbnailClick(i);

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) continue;

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          page.render(renderContext);

          const pageNumberDiv = document.createElement('div');
          pageNumberDiv.className = styles.thumbnailPageNumber;
          pageNumberDiv.innerText = `Page ${i}`;

          thumbnailWrapper.appendChild(canvas);
          thumbnailWrapper.appendChild(pageNumberDiv);
          thumbnailContainerRef.current?.appendChild(thumbnailWrapper);
        }
      } catch (error) {
        console.error('Error rendering thumbnails:', error);
      }
    };

    renderThumbnails();
  }, [pdfBytes, totalPages, currentPage, pdfjsLib, onThumbnailClick]);

  return (
    <div className={styles.thumbnailSidebar}>
        <div className={styles.previewWrapper} >
            <Typography className={styles.previewTitle} >Thumbnails</Typography>
            <div className={styles.previewTexts} >
              <Typography className={styles.label} >Total Pages: {pdfBytes ? totalPages : 0}</Typography>
            </div>
        </div>
      <div ref={thumbnailContainerRef} className={styles.thumbnailContainer}>
        {!pdfBytes && <Typography className={styles.label}>No PDF Loaded</Typography>}
      </div>
    </div>
  );
};

export default ThumbnailSidebar;
