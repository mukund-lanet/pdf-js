import React from 'react';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Popper from '@trenchaant/pkg-ui-component-library/build/Components/Popper';
import { useDispatch, useSelector } from 'react-redux';
import { SET_PROPERTIES_DRAWER_STATE } from '../../../store/action/contractManagement.actions';
import { RootState } from '../../../store/reducer/contractManagement.reducer';

interface SpacingControlProps {
  value: number;
  onChange: (value: number) => void;
  onReset: () => void;
  label?: string;
}

const SpacingControl: React.FC<SpacingControlProps> = ({ value, onChange, onReset, label }) => {
  const presets = [0, 10, 20, 40, 60, 80];
  const dispatch = useDispatch();
  const propertiesDrawerState = useSelector((state: RootState) => state?.contractManagement?.propertiesDrawerState);

  return (
    <>
      <Popper
        open={Boolean(propertiesDrawerState?.isOpen)}
        anchorEl={propertiesDrawerState?.anchorEl}
        closeIcon
        anchor={'right'}
        className={styles.announcementPopperWrp}
        onClose={() => dispatch({ type: SET_PROPERTIES_DRAWER_STATE, payload: { anchorEl: null, isOpen: false } })}
      >
        <div className={styles.spacingControlContainer}>
          {label && <div className={styles.spacingControlLabel}>{label}</div>}

          <div className={styles.spacingSliderWrapper}>
            <input
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={(e) => onChange(parseInt(e.target.value))}
              // @ts-ignore
              style={{ "--val": `${value}%` }}
              className={styles.spacingSlider}
            />
            <div className={styles.spacingInputWrapper}>
              <input
                type="number"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                className={styles.spacingInput}
              />
              <span className={styles.spacingUnit}>px</span>
            </div>
          </div>

          <div className={styles.spacingPresets}>
            <Button
              className={styles.spacingPresetButton}
              onClick={() => onChange(0)}
              variant="outlined"
            >
              AUTO
            </Button>
            {presets.map(preset => (
              <Button
                key={preset}
                className={styles.spacingPresetButton}
                onClick={() => onChange(preset)}
                variant="outlined"
              >
                {preset}
              </Button>
            ))}
          </div>

          <div className={styles.spacingReset} onClick={onReset}>
            <CustomIcon iconName="rotate-ccw" width={14} height={14} />
            <span>Reset</span>
          </div>
        </div>
      </Popper>
    </>
  );
};

export default SpacingControl;
