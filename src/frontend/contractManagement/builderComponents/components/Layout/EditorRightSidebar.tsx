'use client';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Button from '@trenchaant/pkg-ui-component-library/build/Components/Button';
import Checkbox from "@trenchaant/pkg-ui-component-library/build/Components/Checkbox";
import Select from "@trenchaant/pkg-ui-component-library/build/Components/Select/SimpleSelect";
import MenuItem from "@trenchaant/pkg-ui-component-library/build/Components/MenuItem";
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import { RootState } from '../../../store/reducer/contractManagement.reducer';
import {
  HeadingElement,
  ImageElement,
  TableElement,
  VideoElement,
  SignatureElement,
  TextElement,
  DateElement,
  InitialsElement,
  CheckboxElement
} from '../../../utils/interface';
import TextField from "@trenchaant/pkg-ui-component-library/build/Components/TextField";
import InputAdornment from "@trenchaant/pkg-ui-component-library/build/Components/InputAdornment";
import BoxModelControl from '../Properties/BoxModelControl';
import SpacingControl from '../Properties/SpacingControl';
import ColorInput from '../Properties/ColorInput';
import { useDispatch } from 'react-redux';
import { UPDATE_CANVAS_ELEMENT } from '../../../store/action/contractManagement.actions';
import { availableDates, dateFormats } from '../../../utils/utils';

const EditorRightSidebar = () => {
  const activeElementId = useSelector((state: RootState) => state?.contractManagement?.activeElementId);
  const canvasElements = useSelector((state: RootState) => state?.contractManagement?.canvasElements);

  const activeElement = canvasElements?.find(el => el.id === activeElementId);

  const HeadingProperties: React.FC<{ element: HeadingElement }> = ({ element }) => {
    const dispatch = useDispatch();
    const [activeSide, setActiveSide] = useState<{ type: 'margin' | 'padding'; side: 'top' | 'right' | 'bottom' | 'left' } | null>(null);

    const updateElement = (updates: Partial<HeadingElement>) => {
      dispatch({
        type: UPDATE_CANVAS_ELEMENT,
        payload: { ...element, ...updates }
      });
    };

    const handleSpacingChange = (value: number) => {
      if (!activeSide) return;

      const { type, side } = activeSide;
      const currentSpacing = element[type] || { top: 0, right: 0, bottom: 0, left: 0 };

      updateElement({
        [type]: {
          ...currentSpacing,
          [side]: value
        }
      });
    };

    const getActiveValue = () => {
      if (!activeSide) return 0;
      const { type, side } = activeSide;
      return element[type]?.[side] || 0;
    };

    return (
      <div className={styles.propertiesContentWrapper}>
        <div className={styles.propertyGroup}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={"Please enter heading font size"}
            label="Heading font size"
            required
            hideBorder={true}
            value={element.fontSize}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateElement({ fontSize: parseInt(event.target.value) || 32 })}
            inputProps={{ className: 'py-10 text-13' }}
            endAdornment={(
              <InputAdornment position="end" >
                <span className={styles.unitLabel}>px</span>
              </InputAdornment>
            )}
          />
        </div>

        <div className={styles.propertyGroup}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={"Please enter subtitle font size"}
            label="Subtitle font size"
            required
            hideBorder={true}
            value={element.subtitleFontSize}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateElement({ subtitleFontSize: parseInt(event.target.value) || 16 })}
            inputProps={{ className: 'py-10 text-13' }}
            endAdornment={(
              <InputAdornment position="end" >
                <span className={styles.unitLabel}>px</span>
              </InputAdornment>
            )}
          />
        </div>

        <div className={styles.propertyGroup}>
          <TextField
            fullWidth
            variant="outlined"
            label="Subtitle color"
            placeholder="Enter subtitle color"
            hideBorder={true}
            value={element.subtitleColor || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateElement({ subtitleColor: e.target.value })}
            inputProps={{ className: 'py-10 text-13' }}
            endAdornment={(
              <InputAdornment position="end">
                <ColorInput
                  value={element.subtitleColor}
                  onChange={(value) => updateElement({ subtitleColor: value })}
                />
              </InputAdornment>
            )}
          />
        </div>

        <div className={styles.propertyGroup}>
          <TextField
            fullWidth
            variant="outlined"
            label="Background color"
            placeholder="Enter background color"
            hideBorder={true}
            value={element.backgroundColor || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateElement({ backgroundColor: e.target.value })}
            inputProps={{ className: 'py-10 text-13' }}
            endAdornment={(
              <InputAdornment position="end">
                <ColorInput
                  value={element.backgroundColor}
                  onChange={(value) => updateElement({ backgroundColor: value })}
                />
              </InputAdornment>
            )}
          />
        </div>

        <BoxModelControl
          margin={element.margin}
          padding={element.padding}
          onSelectSide={(type, side) => setActiveSide({ type, side })}
          activeSide={activeSide}
        />

        {activeSide && (
          <SpacingControl
            label={`${activeSide.type} ${activeSide.side}`}
            value={getActiveValue()}
            onChange={handleSpacingChange}
            onReset={() => handleSpacingChange(0)}
          />
        )}
      </div>
    );
  };

  const ImageProperties: React.FC<{ element: ImageElement }> = ({ element }) => {
    const dispatch = useDispatch();
    const [activeSide, setActiveSide] = useState<{ type: 'margin' | 'padding'; side: 'top' | 'right' | 'bottom' | 'left' } | null>(null);

    const updateElement = (updates: Partial<ImageElement>) => {
      dispatch({
        type: UPDATE_CANVAS_ELEMENT,
        payload: { ...element, ...updates }
      });
    };

    const handleSpacingChange = (value: number) => {
      if (!activeSide) return;
      const { type, side } = activeSide;
      const currentSpacing = element[type] || { top: 0, right: 0, bottom: 0, left: 0 };
      updateElement({ [type]: { ...currentSpacing, [side]: value } });
    };

    const getActiveValue = () => activeSide ? element[activeSide.type]?.[activeSide.side] || 0 : 0;

    return (
      <div className={styles.propertiesContentWrapper}>
        <div className={styles.propertyGroup}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={"Please enter image url"}
            label="Image URL"
            hideBorder={true}
            value={element.imageUrl}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateElement({ imageUrl: event.target?.value })}
            inputProps={{ className: 'py-10 text-13' }}
            endAdornment={(
              <InputAdornment position="end" >
                <CustomIcon iconName='image' height={20} width={20} variant="grey" />
              </InputAdornment>
            )}
          />
        </div>

        <div className={styles.propertyGroup}>
          <Typography className={styles.propertyLabel}>Align</Typography>
          <div className={styles.buttonGroup}>
            {['left', 'center', 'right'].map((align) => (
              <Button
                key={align}
                className={`${styles.buttonGroupButton} ${element.align === align ? styles.active : ''}`}
                onClick={() => updateElement({ align: align as any })}
              >
                {align.charAt(0).toUpperCase() + align.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className={styles.propertyGroup}>
          <Typography className={styles.propertyLabel}>Image effects</Typography>
          <div className={styles.buttonGroup}>
            <Button
              className={`${styles.buttonGroupButton} ${element.imageEffect !== 'grayscale' ? styles.active : ''}`}
              onClick={() => updateElement({ imageEffect: 'none' })}
            >
              Full color
            </Button>
            <Button
              className={`${styles.buttonGroupButton} ${element.imageEffect === 'grayscale' ? styles.active : ''}`}
              onClick={() => updateElement({ imageEffect: 'grayscale' })}
            >
              Black & White
            </Button>
          </div>
        </div>

        <div className={styles.propertyGroup}>
          <TextField
            fullWidth
            variant="outlined"
            label="Background color"
            placeholder="Enter background color"
            hideBorder={true}
            value={element.backgroundColor || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateElement({ backgroundColor: e.target.value })}
            inputProps={{ className: 'py-10 text-13' }}
            endAdornment={(
              <InputAdornment position="end">
                <ColorInput
                  value={element.backgroundColor}
                  onChange={(backgroundColor) => updateElement({ backgroundColor })}
                />
              </InputAdornment>
            )}
          />
        </div>

        <div className={styles.propertyGroup}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={"Please enter height"}
            label="Height"
            hideBorder={true}
            value={element.height}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateElement({ height: parseInt(event.target?.value) || 0 })}
            inputProps={{ className: 'py-10 text-13' }}
            endAdornment={(
              <InputAdornment position="end" >
                <span className={styles.unitLabel}>px</span>
              </InputAdornment>
            )}
          />
        </div>

        <div className={styles.propertyGroup}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={"Please enter width"}
            label="Width"
            hideBorder={true}
            value={element.width}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateElement({ width: parseInt(event.target?.value) || 0 })}
            inputProps={{ className: 'py-10 text-13' }}
            endAdornment={(
              <InputAdornment position="end" >
                <span className={styles.unitLabel}>px</span>
              </InputAdornment>
            )}
          />
        </div>

        <BoxModelControl
          margin={element.margin}
          padding={element.padding}
          onSelectSide={(type, side) => setActiveSide({ type, side })}
          activeSide={activeSide}
        />

        {activeSide && (
          <SpacingControl
            label={`${activeSide.type} ${activeSide.side}`}
            value={getActiveValue()}
            onChange={handleSpacingChange}
            onReset={() => handleSpacingChange(0)}
          />
        )}
      </div>
    );
  };

  const VideoProperties: React.FC<{ element: VideoElement }> = ({ element }) => {
    const dispatch = useDispatch();
    const [activeSide, setActiveSide] = useState<{ type: 'margin' | 'padding'; side: 'top' | 'right' | 'bottom' | 'left' } | null>(null);

    const updateElement = (updates: Partial<VideoElement>) => {
      dispatch({
        type: UPDATE_CANVAS_ELEMENT,
        payload: { ...element, ...updates }
      });
    };

    const handleSpacingChange = (value: number) => {
      if (!activeSide) return;
      const { type, side } = activeSide;
      const currentSpacing = element[type] || { top: 0, right: 0, bottom: 0, left: 0 };
      updateElement({ [type]: { ...currentSpacing, [side]: value } });
    };

    const getActiveValue = () => activeSide ? element[activeSide.type]?.[activeSide.side] || 0 : 0;

    return (
      <div className={styles.propertiesContentWrapper}>
        <div className={styles.infoBox}>
          <Typography className={styles.infoBoxTitle}>Supported providers:</Typography>
          <Typography className={styles.infoBoxContent}>
            YouTube, Vimeo, Dailymotion, Wistia, Inc., Vidyard, loom
          </Typography>
        </div>

        <div className={styles.propertyGroup}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={"Please enter video url"}
            label="Video URL"
            hideBorder={true}
            value={element.videoUrl}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateElement({ videoUrl: event.target?.value })}
            inputProps={{ className: 'py-10 text-13' }}
            endAdornment={(
              <InputAdornment position="end" >
                <CustomIcon iconName='video' height={20} width={20} variant="grey" />
              </InputAdornment>
            )}
          />
          <Typography className={styles.helperText}>
            Paste a video URL to embed it in your document. YouTube, Vimeo, Wistia and Vidyard are supported.
          </Typography>
        </div>

        <div className={styles.propertyGroup}>
          <TextField
            fullWidth
            variant="outlined"
            label="Background color"
            placeholder="Enter background color"
            hideBorder={true}
            value={element.backgroundColor || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateElement({ backgroundColor: e.target.value })}
            inputProps={{ className: 'py-10 text-13' }}
            endAdornment={(
              <InputAdornment position="end">
                <ColorInput
                  value={element.backgroundColor}
                  onChange={(value) => updateElement({ backgroundColor: value })}
                />
              </InputAdornment>
            )}
          />
        </div>

        <div className={styles.propertyGroup}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={"Please enter video height"}
            label="Height"
            hideBorder={true}
            value={element.height || ''}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateElement({ height: parseInt(event.target?.value) })}
            inputProps={{ className: 'py-10 text-13' }}
            endAdornment={(
              <InputAdornment position="end" >
                <span className={styles.unitLabel}>px</span>
              </InputAdornment>
            )}
          />
        </div>

        <div className={styles.propertyGroup}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={"Please enter video width"}
            label="Width"
            hideBorder={true}
            value={element.width || ''}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateElement({ width: parseInt(event.target?.value) || undefined })}
            inputProps={{ className: 'py-10 text-13' }}
            endAdornment={(
              <InputAdornment position="end" >
                <span className={styles.unitLabel}>px</span>
              </InputAdornment>
            )}
          />
        </div>

        <BoxModelControl
          margin={element.margin}
          padding={element.padding}
          onSelectSide={(type, side) => setActiveSide({ type, side })}
          activeSide={activeSide}
        />

        {activeSide && (
          <SpacingControl
            label={`${activeSide.type} ${activeSide.side}`}
            value={getActiveValue()}
            onChange={handleSpacingChange}
            onReset={() => handleSpacingChange(0)}
          />
        )}
      </div>
    );
  };

  const TableProperties: React.FC<{ element: TableElement }> = ({ element }) => {
    const dispatch = useDispatch();
    const [activeSide, setActiveSide] = useState<{ type: 'margin' | 'padding'; side: 'top' | 'right' | 'bottom' | 'left' } | null>(null);

    const updateElement = (updates: Partial<TableElement>) => {
      dispatch({
        type: UPDATE_CANVAS_ELEMENT,
        payload: { ...element, ...updates }
      });
    };

    const handleSpacingChange = (value: number) => {
      if (!activeSide) return;
      const { type, side } = activeSide;
      const currentSpacing = element[type] || { top: 0, right: 0, bottom: 0, left: 0 };
      updateElement({ [type]: { ...currentSpacing, [side]: value } });
    };

    const getActiveValue = () => activeSide ? element[activeSide.type]?.[activeSide.side] || 0 : 0;

    return (
      <div className={styles.propertiesContentWrapper}>
        <div className={styles.propertyGroup}>
          <TextField
            fullWidth
            variant="outlined"
            label="Background color"
            placeholder="Enter background color"
            hideBorder={true}
            value={element.backgroundColor || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateElement({ backgroundColor: e.target.value })}
            inputProps={{ className: 'py-10 text-13' }}
            endAdornment={(
              <InputAdornment position="end">
                <ColorInput
                  value={element.backgroundColor}
                  onChange={(value) => updateElement({ backgroundColor: value })}
                />
              </InputAdornment>
            )}
          />
        </div>

        <BoxModelControl
          margin={element.margin}
          padding={element.padding}
          onSelectSide={(type, side) => setActiveSide({ type, side })}
          activeSide={activeSide}
        />

        {activeSide && (
          <SpacingControl
            label={`${activeSide.type} ${activeSide.side}`}
            value={getActiveValue()}
            onChange={handleSpacingChange}
            onReset={() => handleSpacingChange(0)}
          />
        )}
      </div>
    );
  };

  const SignatureProperties: React.FC<{ element: SignatureElement }> = ({ element }) => {
    const dispatch = useDispatch();

    const updateElement = (updates: Partial<SignatureElement>) => {
      dispatch({
        type: UPDATE_CANVAS_ELEMENT,
        payload: { ...element, ...updates }
      });
    };

    const mockUser = {
      name: 'John Doe',
      email: 'johndoe12@gmail.com',
      avatar: 'JD',
      role: 'Primary',
      type: 'Signer'
    };

    return (
      <div className={styles.propertiesContentWrapper}>
        <div className={styles.propertyGroup}>
          <Typography className={styles.propertyLabel}>To be signed by</Typography>
          <Select
            fullWidth
            value={mockUser.name}
            onChange={() => { }}
            size="small"
          >
            <MenuItem value={mockUser.name}>{mockUser.name}</MenuItem>
          </Select>
        </div>

        <div className={styles.userInfoCard}>
          <div className={styles.userAvatar}>{mockUser.avatar}</div>
          <div className={styles.userDetails}>
            <Typography className={styles.userName}>{mockUser.name}</Typography>
            <Typography className={styles.userEmail}>{mockUser.email}</Typography>
            <div className={styles.userBadges}>
              <span className={styles.badgePrimary}>{mockUser.role}</span>
              <span className={styles.badgeSigner}>{mockUser.type}</span>
            </div>
          </div>
        </div>

        <div className={styles.propertyGroup}>
          <Typography className={styles.propertyLabel}>Placeholder</Typography>
          <TextField
            fullWidth
            variant="outlined"
            hideBorder={true}
            // @ts-ignore
            value={element.content || 'Signature'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateElement({ content: e.target.value })}
            inputProps={{ className: 'py-10 text-13' }}
          />
        </div>

        <div className={styles.propertyGroup}>
          <Checkbox
            // @ts-ignore
            checked={element.showSignerName || false}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateElement({ showSignerName: e.target.checked })}
            label="Show signer name"
          />
        </div>
      </div>
    );
  };

  const TextFieldProperties: React.FC<{ element: TextElement }> = ({ element }) => {
    const dispatch = useDispatch();

    const updateElement = (updates: Partial<TextElement>) => {
      dispatch({
        type: UPDATE_CANVAS_ELEMENT,
        payload: { ...element, ...updates }
      });
    };

    const mockUser = {
      name: 'John Doe',
      email: 'johndoe12@gmail.com',
      avatar: 'JD',
      role: 'Primary',
      type: 'Signer'
    };

    return (
      <div className={styles.propertiesContentWrapper}>
        <div className={styles.propertyGroup}>
          <Typography className={styles.propertyLabel}>To be filled by</Typography>
          <Select
            fullWidth
            value={mockUser.name}
            onChange={() => { }}
            size="small"
          >
            <MenuItem value={mockUser.name}>{mockUser.name}</MenuItem>
          </Select>
        </div>

        <div className={styles.userInfoCard}>
          <div className={styles.userAvatar}>{mockUser.avatar}</div>
          <div className={styles.userDetails}>
            <Typography className={styles.userName}>{mockUser.name}</Typography>
            <Typography className={styles.userEmail}>{mockUser.email}</Typography>
            <div className={styles.userBadges}>
              <span className={styles.badgePrimary}>{mockUser.role}</span>
              <span className={styles.badgeSigner}>{mockUser.type}</span>
            </div>
          </div>
        </div>

        <Typography className={styles.sectionHeader}>OPTIONS</Typography>

        <div className={styles.propertyGroup}>
          <Typography className={styles.propertyLabel}>Placeholder</Typography>
          <TextField
            fullWidth
            variant="outlined"
            hideBorder={true}
            // @ts-ignore
            value={element.content || 'Enter value'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateElement({ content: e.target.value })}
            inputProps={{ className: 'py-10 text-13' }}
          />
        </div>

        <div className={styles.propertyGroup}>
          <Checkbox
            // @ts-ignore
            checked={element.required || false}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateElement({ required: e.target.checked })}
            label="Required"
          />
        </div>

        <Typography className={styles.sectionHeader}>LINKED FIELDS</Typography>

        {/* <div className={styles.propertyGroup}>
          <Button
            fullWidth
            variant="text"
            className={styles.addCustomFieldsBtn}
          >
            Add custom fields
          </Button>
        </div> */}
      </div>
    );
  };

  const DateProperties: React.FC<{ element: DateElement }> = ({ element }) => {
    const dispatch = useDispatch();

    const updateElement = (updates: Partial<DateElement>) => {
      dispatch({
        type: UPDATE_CANVAS_ELEMENT,
        payload: { ...element, ...updates }
      });
    };

    const mockUser = {
      name: 'John Doe',
      email: 'johndoe12@gmail.com',
      avatar: 'JD',
      role: 'Primary',
      type: 'Signer'
    };

    return (
      <div className={styles.propertiesContentWrapper}>
        <div className={styles.propertyGroup}>
          <Typography className={styles.propertyLabel}>To be filled by</Typography>
          <Select
            fullWidth
            value={mockUser.name}
            onChange={() => { }}
            size="small"
          >
            <MenuItem value={mockUser.name}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className={styles.userAvatarSmall}>{mockUser.avatar}</div>
                <span>{mockUser.name}</span>
              </div>
            </MenuItem>
          </Select>
        </div>

        <div className={styles.userInfoCard}>
          <div className={styles.userAvatar}>{mockUser.avatar}</div>
          <div className={styles.userDetails}>
            <Typography className={styles.userName}>{mockUser.name}</Typography>
            <Typography className={styles.userEmail}>{mockUser.email}</Typography>
            <div className={styles.userBadges}>
              <span className={styles.badgePrimary}>{mockUser.role}</span>
              <span className={styles.badgeSigner}>{mockUser.type}</span>
            </div>
          </div>
        </div>

        <Typography className={styles.sectionHeader}>OPTIONS</Typography>

        <div className={styles.propertyGroup}>
          <Typography className={styles.propertyLabel}>Placeholder</Typography>
          <TextField
            fullWidth
            variant="outlined"
            hideBorder={true}
            placeholder='Select date'
            value={element.placeholder}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateElement({ placeholder: e.target.value })}
            inputProps={{ className: 'py-10 text-13' }}
          />
        </div>

        <div className={styles.propertyGroup}>
          <Typography className={styles.propertyLabel}>Date Formats</Typography>
          <Select
            fullWidth
            value={element.dateFormat || 'YYYY-MM-DD'}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateElement({ dateFormat: e.target.value })}
            size="small"
          >
            {dateFormats.map(format => (
              <MenuItem key={format} value={format}>{format}</MenuItem>
            ))}
          </Select>
        </div>

        <div className={styles.propertyGroup}>
          <Typography className={styles.propertyLabel}>Available Dates</Typography>
          <Select
            fullWidth
            value={element.availableDates || 'Any Date'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateElement({ availableDates: e.target.value })}
            size="small"
          >
            {availableDates.map(date => (
              <MenuItem key={date} value={date}>{date}</MenuItem>
            ))}
          </Select>
        </div>

        <div className={styles.propertyGroup}>
          <Checkbox
            checked={element.required || false}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateElement({ required: e.target.checked })}
            label="Required"
          />
        </div>

        {/* <Typography className={styles.sectionHeader}>LINKED FIELDS</Typography>

        <div className={styles.propertyGroup}>
          <Button
            fullWidth
            variant="text"
            className={styles.addCustomFieldsBtn}
          >
            Add custom fields
          </Button>
        </div> */}
      </div>
    );
  };

  const InitialsProperties: React.FC<{ element: InitialsElement }> = ({ element }) => {
    const dispatch = useDispatch();

    const updateElement = (updates: Partial<InitialsElement>) => {
      dispatch({
        type: UPDATE_CANVAS_ELEMENT,
        payload: { ...element, ...updates }
      });
    };

    const mockUser = {
      name: 'John Doe',
      email: 'johndoe12@gmail.com',
      avatar: 'JD',
      role: 'Primary',
      type: 'Signer'
    };

    return (
      <div className={styles.propertiesContentWrapper}>
        <div className={styles.propertyGroup}>
          <Typography className={styles.propertyLabel}>To be signed by</Typography>
          <Select
            fullWidth
            value={mockUser.name}
            onChange={() => { }}
            size="small"
          >
            <MenuItem value={mockUser.name}>{mockUser.name}</MenuItem>
          </Select>
        </div>

        <div className={styles.userInfoCard}>
          <div className={styles.userAvatar}>{mockUser.avatar}</div>
          <div className={styles.userDetails}>
            <Typography className={styles.userName}>{mockUser.name}</Typography>
            <Typography className={styles.userEmail}>{mockUser.email}</Typography>
            <div className={styles.userBadges}>
              <span className={styles.badgePrimary}>{mockUser.role}</span>
              <span className={styles.badgeSigner}>{mockUser.type}</span>
            </div>
          </div>
        </div>

        <div className={styles.propertyGroup}>
          <Typography className={styles.propertyLabel}>Placeholder</Typography>
          <TextField
            fullWidth
            variant="outlined"
            hideBorder={true}
            // @ts-ignore
            value={element.content || 'Initials'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateElement({ content: e.target.value })}
            inputProps={{ className: 'py-10 text-13' }}
          />
        </div>
      </div>
    );
  };

  const CheckboxProperties: React.FC<{ element: CheckboxElement }> = ({ element }) => {
    const dispatch = useDispatch();

    const updateElement = (updates: Partial<CheckboxElement>) => {
      dispatch({
        type: UPDATE_CANVAS_ELEMENT,
        payload: { ...element, ...updates }
      });
    };

    const mockUser = {
      name: 'John Doe',
      email: 'johndoe12@gmail.com',
      avatar: 'JD',
      role: 'Primary',
      type: 'Signer'
    };

    return (
      <div className={styles.propertiesContentWrapper}>
        <div className={styles.propertyGroup}>
          <Typography className={styles.propertyLabel}>To be filled by</Typography>
          <Select
            fullWidth
            value={mockUser.name}
            onChange={() => { }}
            size="small"
          >
            <MenuItem value={mockUser.name}>{mockUser.name}</MenuItem>
          </Select>
        </div>

        <div className={styles.userInfoCard}>
          <div className={styles.userAvatar}>{mockUser.avatar}</div>
          <div className={styles.userDetails}>
            <Typography className={styles.userName}>{mockUser.name}</Typography>
            <Typography className={styles.userEmail}>{mockUser.email}</Typography>
            <div className={styles.userBadges}>
              <span className={styles.badgePrimary}>{mockUser.role}</span>
              <span className={styles.badgeSigner}>{mockUser.type}</span>
            </div>
          </div>
        </div>

        <Typography className={styles.sectionHeader}>OPTIONS</Typography>

        <div className={styles.propertyGroup}>
          {element.type === 'checkbox' && (
            <Checkbox
              checked={element.checked}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch({
                  type: UPDATE_CANVAS_ELEMENT,
                  payload: { ...element, checked: e.target.checked },
                })
              }
              label="Is checked"
            />
          )}
          <Checkbox
            checked={element.required || false}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateElement({ required: e.target.checked })}
            label="Required"
          />
        </div>

        <Typography className={styles.sectionHeader}>LINKED FIELDS</Typography>

        {/* <div className={styles.propertyGroup}>
          <Button
            fullWidth
            variant="text"
            className={styles.addCustomFieldsBtn}
          >
            Add custom fields
          </Button>
        </div> */}
      </div>
    );
  };

  const renderPropertiesPanel = () => {
    if (!activeElement) {
      return (
        <div className={styles.emptyMessage}>
          <div className={styles.iconWrapper}>
            <CustomIcon iconName="settings" width={48} height={48} customColor="#d1d5db" />
          </div>
          <h3 className={styles.title}>No Element Selected</h3>
          <p className={styles.description}>
            Click on an element in the canvas to view and edit its properties
          </p>
        </div>
      );
    }

    switch (activeElement.type) {
      case 'heading':
        return <HeadingProperties element={activeElement as HeadingElement} />;
      case 'image':
        return <ImageProperties element={activeElement as ImageElement} />;
      case 'video':
        return <VideoProperties element={activeElement as VideoElement} />;
      case 'table':
        return <TableProperties element={activeElement as TableElement} />;
      case 'signature':
        return <SignatureProperties element={activeElement as SignatureElement} />;
      case 'text-field':
        return <TextFieldProperties element={activeElement as TextElement} />;
      case 'date':
        return <DateProperties element={activeElement as DateElement} />;
      case 'initials':
        return <InitialsProperties element={activeElement as InitialsElement} />;
      case 'checkbox':
        return <CheckboxProperties element={activeElement as CheckboxElement} />;
      default:
        return (
          <div className={styles.emptyMessage}>
            <div className={styles.iconWrapper}>
              <CustomIcon iconName="settings" width={48} height={48} customColor="#d1d5db" />
            </div>
            <h3 className={styles.title}>No Properties Available</h3>
            <p className={styles.description}>
              This element type doesn't have editable properties yet
            </p>
          </div>
        );
    }
  };

  return (
    <div className={styles.rightSideBarDrawer} >
      <div className={styles.builderRightSideHeaderTitleWrapper}>
        <CustomIcon iconName="settings" width={20} height={20} />
        <Typography fontWeight="600" className={styles.builderRightSideHeaderTitle}>Properties</Typography>
      </div>

      {renderPropertiesPanel()}
    </div>
  );
};

export default EditorRightSidebar;
