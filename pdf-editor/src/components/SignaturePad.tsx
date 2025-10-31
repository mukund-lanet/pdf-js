'use client';
import { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import styles from '../styles/SignaturePad.module.scss';

interface SignaturePadProps {
  onSave: (signature: string) => void;
  onClose: () => void;
}

const SignaturePad = ({ onSave, onClose }: SignaturePadProps) => {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clear = () => {
    sigCanvas.current?.clear();
  };

  const save = () => {
    const signature = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');
    if (signature) {
      onSave(signature);
    }
  };

  return (
    <div className={styles.signaturePadOverlay}>
      <div className={styles.signaturePad}>
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{ className: styles.signatureCanvas }}
        />
        <div className={styles.buttons}>
          <button onClick={clear}>Clear</button>
          <button onClick={save}>Save</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default SignaturePad;