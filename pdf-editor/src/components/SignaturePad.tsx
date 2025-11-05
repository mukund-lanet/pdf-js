'use client';
import { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import styles from 'app/(after-login)/(with-header)/pdf-editor/pdfEditor.module.scss';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";

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
          penColor="darkblue"
          canvasProps={{ className: styles.signatureCanvas }}
        />
        <div className={styles.signatureButtonGroup}>
          <Button className={styles.signatureButton} onClick={clear}>
            <Typography className={styles.label} >Clear</Typography>
          </Button>
          <Button className={styles.signatureButton} onClick={save}>
            <Typography className={styles.label} >Save</Typography>
          </Button>
          <Button className={styles.signatureButton} onClick={onClose}>
            <Typography className={styles.label} >Close</Typography>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignaturePad;