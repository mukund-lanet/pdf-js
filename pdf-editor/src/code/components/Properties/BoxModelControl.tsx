import React from 'react';
import styles from 'app/(after-login)/(with-header)/pdf-builder/pdfEditor.module.scss';

interface BoxSpacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface BoxModelControlProps {
  margin?: BoxSpacing;
  padding?: BoxSpacing;
  onSelectSide: (type: 'margin' | 'padding', side: 'top' | 'right' | 'bottom' | 'left') => void;
  activeSide?: { type: 'margin' | 'padding'; side: 'top' | 'right' | 'bottom' | 'left' } | null;
}

const BoxModelControl = ({
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  padding = { top: 0, right: 0, bottom: 0, left: 0 },
  onSelectSide,
  activeSide
}: BoxModelControlProps) => {

  const renderValue = (type: 'margin' | 'padding', side: 'top' | 'right' | 'bottom' | 'left', value: number) => {
    const isActive = activeSide?.type === type && activeSide?.side === side;
    // Construct class names manually since dynamic keys might not work with CSS modules object directly if not defined
    // But assuming standard CSS modules usage where classes are properties
    const positionClass = styles[`${type}${side.charAt(0).toUpperCase() + side.slice(1)}`];

    return (
      <div
        className={`${styles.boxModelValue} ${positionClass} ${isActive ? styles.boxModelValueActive : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onSelectSide(type, side);
        }}
      >
        {value} px
      </div>
    );
  };

  return (
    <div className={styles.boxModelContainer}>
      <div className={styles.boxModelMarginLabel}>MARGIN</div>
      <div className={styles.boxModelMarginBox}>
        {renderValue('margin', 'top', margin.top)}
        {renderValue('margin', 'right', margin.right)}
        {renderValue('margin', 'bottom', margin.bottom)}
        {renderValue('margin', 'left', margin.left)}

        <div className={styles.boxModelPaddingBox}>
          <div className={styles.boxModelPaddingLabel}>PADDING</div>
          {renderValue('padding', 'top', padding.top)}
          {renderValue('padding', 'right', padding.right)}
          {renderValue('padding', 'bottom', padding.bottom)}
          {renderValue('padding', 'left', padding.left)}

          <div className={styles.boxModelContentBox} />
        </div>
      </div>
    </div>
  );
};

export default BoxModelControl;
