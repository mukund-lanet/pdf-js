import React from 'react';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/reducer/contractManagement.reducer';
import { SET_PROPERTIES_DRAWER_STATE } from '../../../store/action/contractManagement.actions';

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
  activeSide,
}: BoxModelControlProps) => {

  const dispatch = useDispatch();

  const renderValue = (type: 'margin' | 'padding', side: 'top' | 'right' | 'bottom' | 'left', value: number) => {
    const isActive = activeSide?.type === type && activeSide?.side === side;
    const positionClass = styles[`${type}${side.charAt(0).toUpperCase() + side.slice(1)}`];

    return (
      <div
        className={`${styles.boxModelValue} ${positionClass} ${isActive ? styles.boxModelValueActive : ''}`}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          e.stopPropagation();
          onSelectSide(type, side);
          dispatch({ type: SET_PROPERTIES_DRAWER_STATE, payload: { anchorEl: e.currentTarget, isOpen: true } });
        }}
      >
        {value} px
      </div>
    );
  };

  return (
    <div className={styles.boxModelContainer}>
      <div className={styles.boxModelMarginBox}>
        <div className={styles.boxModelMarginLabel}>Margin</div>
        {renderValue('margin', 'top', margin.top)}
        {renderValue('margin', 'right', margin.right)}
        {renderValue('margin', 'bottom', margin.bottom)}
        {renderValue('margin', 'left', margin.left)}

        <div className={styles.boxModelPaddingBox}>
          <div className={styles.boxModelPaddingLabel}>Padding</div>
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
