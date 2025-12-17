'use client';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import EmptyMessageComponent from "@trenchaant/pkg-ui-component-library/build/Components/EmptyMessageComponent";
import SimpleLoading from "@trenchaant/pkg-ui-component-library/build/Components/SimpleLoading";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import Button from "@trenchaant/pkg-ui-component-library/build/Components/Button";
import Avatar from "@trenchaant/pkg-ui-component-library/build/Components/Avatar";
import Switch from "@trenchaant/pkg-ui-component-library/build/Components/Switch";
import TextField from "@trenchaant/pkg-ui-component-library/build/Components/TextField";
import IconButton from "@trenchaant/pkg-ui-component-library/build/Components/IconButton";
import Divider from "@trenchaant/pkg-ui-component-library/build/Components/Divider";
import Dialog from "@trenchaant/pkg-ui-component-library/build/Components/Dialog";
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import { DraggableBlockItemProps, DraggableToolbarItemProps, DRAWER_COMPONENT_CATEGORY, Signer } from '../../../utils/interface';
import { RootState } from '../../../store/reducer/contractManagement.reducer';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { PDFDocument } from 'pdf-lib';
import { ADD_DOCUMENT_VARIABLE, DELETE_DOCUMENT_VARIABLE, REORDER_PAGE_ELEMENTS, SET_ACTIVE_TOOL, SET_PDF_BYTES, TOOLBAR_ITEM, UPDATE_DOCUMENT } from '@/components/contractManagement/store/action/contractManagement.actions';
import ThumbnailPage from '../ThumbnailPage';
import { blocks, fillableFields, noPdfDocument } from '../../../utils/utils';
import { useDrag } from 'react-dnd';
import { SET_PAGES } from '../../../store/action/contractManagement.actions';

const EditorLeftDrawer: React.FC = () => {
  const drawerComponentType = useSelector((state: RootState) => state?.contractManagement?.drawerComponentCategory);

  const SettingsSidebar: React.FC = () => {
    const [overrideEmail, setOverrideEmail] = useState(false);
    const [enableRedirect, setEnableRedirect] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState('');
    const [openInNewTab, setOpenInNewTab] = useState(false);

    return (
      <div className={styles.settingsSidebar}>
        <div className={styles.settingSection}>
          <div className={styles.switchRow}>
            <Switch
              checked={overrideEmail}
              onChange={(e: any) => setOverrideEmail(e.target.checked)}
              color='primary'
            />
            <Typography className={styles.settingLabel}>Override Email Configuration</Typography>
            <CustomIcon iconName="info" width={16} height={16} variant="gray" />
          </div>

          {overrideEmail && (
            <>
              <div className={styles.inputGroup}>
                <Typography className={styles.inputLabel}>From Name</Typography>
                <input type="text" placeholder="Please Input" className={styles.textInput} />
              </div>
              <div className={styles.inputGroup}>
                <Typography className={styles.inputLabel}>From Email</Typography>
                <input type="text" placeholder="Please Input" className={styles.textInput} />
              </div>
            </>
          )}

          <div className={styles.inputGroup}>
            <Typography className={styles.inputLabel}>Email Subject</Typography>
            <div className={styles.inputWithIcon}>
              <input type="text" defaultValue="{{location.name}} {{document.name}}" className={styles.textInput} />
              <div className={styles.inputIcon}>
                <CustomIcon iconName="tag" width={16} height={16} />
              </div>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <Typography className={styles.inputLabel}>Email Template</Typography>
            <select className={styles.selectInput}>
              <option>Default</option>
            </select>
          </div>
        </div>

        <Divider horizontal />

        <div className={styles.settingSection}>
          <div className={styles.switchRow}>
            <Switch
              checked={enableRedirect}
              onChange={(e: any) => setEnableRedirect(e.target.checked)}
              color='primary'
            />
            <Typography className={styles.settingLabel}>Enable redirection to custom URL</Typography>
          </div>

          {enableRedirect && (
            <div className={styles.redirectOptions}>
              <div className={styles.inputGroup}>
                <Typography className={styles.inputLabel}>Enter custom URL</Typography>
                <input
                  type="text"
                  placeholder="https://example.com"
                  className={styles.textInput}
                  value={redirectUrl}
                  onChange={(e) => setRedirectUrl(e.target.value)}
                />
              </div>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="openTab"
                    checked={!openInNewTab}
                    onChange={() => setOpenInNewTab(false)}
                  />
                  Open in Existing Tab
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="openTab"
                    checked={openInNewTab}
                    onChange={() => setOpenInNewTab(true)}
                  />
                  Open in New Tab
                </label>
              </div>
            </div>
          )}
        </div>

        <Divider />

        <div className={styles.settingSection}>
          <div className={styles.sectionTitleRow}>
            <Typography className={styles.settingLabel}>Add Attachments</Typography>
            <CustomIcon iconName="info" width={16} height={16} variant="gray" />
          </div>
          <Button variant="outlined" className={styles.uploadButton} startIcon={<CustomIcon iconName="upload" width={16} height={16} />}>
            Upload
          </Button>
        </div>
      </div>
    );
  };

  const ElementsSidebar: React.FC = () => {

    const dispatch = useDispatch();
    const activeTool = useSelector((state: RootState) => state?.contractManagement?.activeTool);

    const DraggableBlockItem: React.FC<DraggableBlockItemProps> = ({ item, activeTool, dispatch }) => {
      const [{ isDragging }, drag] = useDrag(() => ({
        type: TOOLBAR_ITEM,
        item: { type: item.type, label: item.label },
        collect: (monitor) => ({
          isDragging: monitor.isDragging(),
        }),
      }), [item.type, item.label]);

      return (
        <div
          ref={drag}
          className={`${styles.elementCard} ${activeTool === item.type ? styles.activeElement : ''}`}
          style={{ opacity: isDragging ? 0.5 : 1, cursor: 'grab' }}
          onClick={() => dispatch({ type: SET_ACTIVE_TOOL, payload: item.type })}
        >
          <div className={styles.dragHandle}>
            <CustomIcon iconName="grip-horizontal" width={16} height={16} />
          </div>
          <div className={styles.elementIcon}>
            <CustomIcon iconName={item.icon} width={20} height={20} />
          </div>
          <Typography className={styles.elementLabel}>{item.label}</Typography>
        </div>
      );
    };

    const DraggableToolbarItem: React.FC<DraggableToolbarItemProps> = ({ item, activeTool, dispatch }) => {
      const [{ isDragging }, drag] = useDrag(() => ({
        type: TOOLBAR_ITEM,
        item: { type: item.type, label: item.label },
        collect: (monitor) => ({
          isDragging: monitor.isDragging(),
        }),
      }), [item.type, item.label]);

      return (
        <div
          ref={drag}
          className={`${styles.elementCard} ${activeTool === item.type ? styles.activeElement : ''}`}
          style={{ opacity: isDragging ? 0.5 : 1, cursor: 'grab' }}
          onClick={() => dispatch({ type: SET_ACTIVE_TOOL, payload: item.type })}
        >
          <div className={styles.dragHandle}>
            <CustomIcon iconName="grip-horizontal" width={16} height={16} />
          </div>
          <div className={styles.elementIcon}>
            <CustomIcon iconName={item.icon} width={20} height={20} />
          </div>
          <Typography className={styles.elementLabel}>{item.label}</Typography>
        </div>
      );
    };

    return (
      <div className={styles.elementsSidebar}>
        <div className={styles.sidebarHeader}>
          <Typography variant="h6" className={styles.sidebarTitle}>Add an Element</Typography>
        </div>

        <div className={styles.sidebarContent}>
          <div className={styles.elementSection}>
            <Typography variant="caption" className={styles.sectionTitle}>BLOCKS</Typography>
            <div className={styles.elementsGrid}>
              <div className={styles.blockToolbarWrapper}>
                {blocks.map((item) => (
                  <DraggableBlockItem
                    key={item.type}
                    item={item}
                    activeTool={activeTool}
                    dispatch={dispatch}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={styles.elementSection}>
            <Typography variant="caption" className={styles.sectionTitle}>FILLABLE FIELDS</Typography>
            <div className={styles.elementsGrid}>
              <div className={styles.fillableToolbarWrapper}>
                {fillableFields.map((item) => (
                  <DraggableToolbarItem
                    key={item.type}
                    item={item}
                    activeTool={activeTool}
                    dispatch={dispatch}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const RecipientsSidebar: React.FC = () => {
    const dispatch = useDispatch();
    const activeDocument = useSelector((state: RootState) => state?.contractManagement?.activeDocument);
    const [isAddingRecipient, setIsAddingRecipient] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSigningOrderChange = (checked: boolean) => {
      if (activeDocument) {
        dispatch({
          type: UPDATE_DOCUMENT,
          payload: {
            ...activeDocument,
            documentId: activeDocument._id,
            documentName: activeDocument.name,
            signers: activeDocument.signers,
            signingOrder: checked
          }
        });
      }
    };

    const handleDeleteSigner = (index: number) => {
      if (activeDocument) {
        const newSigners = activeDocument.signers ? [...activeDocument.signers] : [];
        newSigners.splice(index, 1);
        dispatch({
          type: UPDATE_DOCUMENT,
          payload: {
            ...activeDocument,
            documentId: activeDocument._id,
            documentName: activeDocument.name,
            signers: newSigners,
            signingOrder: activeDocument.signingOrder
          }
        });
      }
    };

    return (
      <div className={styles.recipientsSidebar}>
        <div className={styles.sidebarHeader}>
          <Typography variant="h6" className={styles.sidebarTitle}>Recipients</Typography>
        </div>

        <div className={styles.sidebarContent}>
          <div className={styles.signingOrderSection}>
            <div className={styles.signingOrderHeader}>
              <Switch
                checked={activeDocument?.signingOrder || false}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSigningOrderChange(e.target.checked)}
              />
              <Typography className={styles.signingOrderLabel}>Set signing order</Typography>
            </div>
            <Typography variant="caption" className={styles.signingOrderDescription}>
              Emails are sent sequentially: Next recipient can sign only after the previous one completes their action.
            </Typography>
          </div>

          <div className={styles.recipientsList}>
            {activeDocument?.signers?.map((signer: Signer, index: number) => (
              <div key={index} className={styles.recipientItem}>
                <div className={styles.recipientAvatar}>
                  <Avatar>{signer.name.charAt(0).toUpperCase()}</Avatar>
                </div>
                <div className={styles.recipientInfo}>
                  <Typography className={styles.recipientName}>{signer.name}</Typography>
                  <Typography className={styles.recipientEmail}>{signer.email}</Typography>
                  <div className={styles.recipientBadges}>
                    <span className={styles.badgePrimary}>Primary</span>
                    <span className={styles.badgeSigner}>{signer.type}</span>
                  </div>
                </div>
                <div className={styles.recipientActions}>
                  <IconButton size="small">
                    <CustomIcon iconName="edit-2" height={14} width={14} />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDeleteSigner(index)}>
                    <CustomIcon iconName="trash-2" height={14} width={14} />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.addRecipientSection}>
            {isAddingRecipient ? (
              <div className={styles.addRecipientForm}>
                <TextField
                  placeholder="Search client"
                  fullWidth
                  value={searchTerm}
                  onChange={(e: any) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <CustomIcon iconName="search" height={16} width={16} variant="gray" />
                  }}
                />
                <div className={styles.addClientLink}>
                  <Typography variant="caption">LIST OF ALL CLIENTS</Typography>
                  <Button variant="text" size="small" color="primary">Add New Client</Button>
                </div>
                {/* Mock List */}
                <div className={styles.clientList}>
                  <div className={styles.clientItem}>
                    <Avatar className={styles.clientAvatar}>RM</Avatar>
                    <div className={styles.clientInfo}>
                      <Typography className={styles.clientName}>Rakholiya Mukund</Typography>
                      <Typography className={styles.clientEmail}>mukurakholiya119@gmail.com</Typography>
                    </div>
                  </div>
                </div>
                <Button variant="outlined" fullWidth onClick={() => setIsAddingRecipient(false)}>Cancel</Button>
              </div>
            ) : (
              <Button
                variant="outlined"
                fullWidth
                startIcon={<CustomIcon iconName="plus" height={16} width={16} />}
                onClick={() => setIsAddingRecipient(true)}
              >
                Add More Recipients
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const VariablesSidebar: React.FC = () => {
    const dispatch = useDispatch();
    const variables = useSelector((state: RootState) => state?.contractManagement?.documentVariables);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const filteredVariables = variables.filter(v =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.value.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCopy = (text: string) => {
      navigator.clipboard.writeText(text);
    };

    const handleDelete = (name: string) => {
      dispatch({
        type: DELETE_DOCUMENT_VARIABLE,
        payload: name
      });
    };

    const CreateVariableDialog: React.FC<{ isDialogOpen: boolean }> = ({ isDialogOpen }) => {
      const [name, setName] = useState('');
      const [value, setValue] = useState('');
      const dispatch = useDispatch();

      const handleSaveVariable = (name: string, value: string) => {
        const finalName = name.startsWith('document.') ? name : `document.${name}`;

        dispatch({
          type: ADD_DOCUMENT_VARIABLE,
          payload: { name: finalName, value, isSystem: false }
        });
      };

      const onClose = () => setIsDialogOpen(false);

      const handleSave = () => {
        if (name && value) {
          handleSaveVariable(name, value);
          onClose();
        }
      };

      return (
        <Dialog
            open={isDialogOpen}
            label={"Create Document variable"}
            description={"Create variable for your document"}
            // icon={"plus"}
            disableEscapeKeyDown
            onClose={onClose}
            submitBtn={{ onClick: handleSave, label: "Save" }}
            cancelBtn={{ onClick: onClose, label: "Cancel" }}
            className={styles.dialogMainWHoleWrapper}
            classes={{ innerContent: styles.dialogContentWrapper }}
          >
          <div className={styles.dialogContent}>
            <div className={styles.inputGroup}>
              <Typography className={styles.typoLabel} >Variable name <span className={styles.required}>*</span></Typography>
              <TextField
                placeholder="Variable name"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <Typography className={styles.typoLabel} >Variable value <span className={styles.required}>*</span></Typography>
              <TextField
                placeholder="Variable value"
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
              />
            </div>
          </div>
        </Dialog>
      );
    };

    return (
      <div className={styles.variablesSidebar}>
        <div className={styles.sidebarHeader}>
          <Typography variant="h6" className={styles.sidebarTitle}>Document variables</Typography>
        </div>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search"
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            className={styles.addButton}
            variant="outlined"
            onClick={() => setIsDialogOpen(true)}
          >
            <CustomIcon iconName="plus" width={20} height={20} />
          </Button>
        </div>

        <div className={styles.variablesList}>
          <div className={styles.variableItemsWrapper} >
            {filteredVariables.map((variable) => (
              <div key={variable.name} className={styles.variableItem}>
                <Typography className={styles.variableKey}>{variable.name}</Typography>
                <div className={styles.variableValueContainer}>
                  <div className={styles.variableValue}>{variable.value}</div>
                  <div className={styles.variableActions}>
                    <Button className={styles.copyButton} onClick={() => handleCopy(variable.value)}>
                      <CustomIcon iconName="copy" width={16} height={16} />
                    </Button>
                    {!variable.isSystem && (
                      <Button className={styles.deleteButton} onClick={() => handleDelete(variable.name)}>
                        <CustomIcon iconName="trash2" width={16} height={16} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <CreateVariableDialog isDialogOpen={isDialogOpen}  />
      </div>
    );
  };

  const ThumbnailSidebar: React.FC = () => {
    const dispatch = useDispatch();
    const [pdfjsLib, setPdfjsLib] = useState<any>(null);
    const [pdfDoc, setPdfDoc] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const totalPages = useSelector((state: RootState) => state?.contractManagement?.totalPages);
    const pdfBytes = useSelector((state: RootState) => state?.contractManagement?.pdfBytes);
    const pages = useSelector((state: RootState) => state?.contractManagement?.pages || []);
    const [pageIds, setPageIds] = useState<string[]>([]);

    // StrictModeDroppable component
    const StrictModeDroppable = ({ children, ...props }: any) => {
      const [enabled, setEnabled] = useState(false);
      useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
          cancelAnimationFrame(animation);
          setEnabled(false);
        };
      }, []);
      if (!enabled) {
        return null;
      }
      return <Droppable {...props}>{children}</Droppable>;
    };

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
      // Initialize pageIds based on pages array length
      // If we have pages data, initialize pageIds based on that
      if (pages && pages.length > 0) {
        if (pageIds.length !== pages.length) {
          setPageIds(Array.from({ length: pages.length }, (_, i) => `page-${i + 1}-${Date.now()}`));
        }
      } else if (pdfBytes && pdfjsLib) {
        // Fallback to original pdfBytes loading if no pages data
        const loadPdf = async () => {
          try {
            const pdfBytesCopy = new Uint8Array(pdfBytes);
            const loadingTask = pdfjsLib.getDocument({ data: pdfBytesCopy });
            const pdf = await loadingTask.promise;
            setPdfDoc(pdf);

            // Initialize page IDs if not already set or if count mismatches
            if (pageIds.length !== pdf.numPages) {
              setPageIds(Array.from({ length: pdf.numPages }, (_, i) => `page-${i + 1}-${Date.now()}`));
            }
          } catch (error) {
            console.error('Error loading PDF for thumbnails:', error);
          }
        };

        loadPdf();
      }
    }, [pdfBytes, pdfjsLib, pages]);

    const onDragEnd = async (result: DropResult) => {
      if (!result.destination) return;

      const sourceIndex = result.source.index;
      const destinationIndex = result.destination.index;

      if (sourceIndex === destinationIndex) return;

      // Reorder local state immediately for UI responsiveness
      const newPageIds = Array.from(pageIds);
      const [movedPageId] = newPageIds.splice(sourceIndex, 1);
      newPageIds.splice(destinationIndex, 0, movedPageId);
      setPageIds(newPageIds);

      try {
        setIsLoading(true);
        
        // Update pages array
        const currentPages = [...pages];
        const [movedPage] = currentPages.splice(sourceIndex, 1);
        currentPages.splice(destinationIndex, 0, movedPage);
        dispatch({ type: SET_PAGES, payload: currentPages });
        
        dispatch({
          type: REORDER_PAGE_ELEMENTS,
          payload: { sourceIndex, destinationIndex }
        });

      } catch (error) {
        console.error('Error reordering pages:', error);
        // Revert local state on error
        setPageIds(pageIds);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className={styles.thumbnailSidebar}>
        <div className={styles.sidebarHeader}>
          <Typography variant="h6" className={styles.sidebarTitle}>Pages</Typography>
        </div>

        <div className={styles.thumbnailContainer}>
          {(pages && pages.length > 0) || (pdfDoc && totalPages > 0) ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <StrictModeDroppable droppableId="thumbnail-pages">
                {(provided: any) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{ height: '100%' }}
                  >
                    {pageIds.map((pageId, index) => (
                      <Draggable key={pageId} draggableId={pageId} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                              ...provided.draggableProps.style,
                              marginBottom: '16px'
                            }}
                          >
                            <ThumbnailPage
                              key={`thumbnail_${pageId}`}
                              pdfDoc={pdfDoc}
                              pageNumber={index + 1}
                              isLoading={isLoading}
                              dragHandleProps={provided.dragHandleProps}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </StrictModeDroppable>
            </DragDropContext>
          ) : !isLoading ? (
            <div className={styles.noPdfLoaded} >
              <EmptyMessageComponent className={styles.noPdfLoadedEmptyMessage} {...noPdfDocument} />
            </div>
          ) : isLoading && (
            <div className={styles.loadingWrapper}>
              <SimpleLoading />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`${styles.leftSideDrawerWrapper} ${drawerComponentType === DRAWER_COMPONENT_CATEGORY.ADD_ELEMENTS ? styles.leftSideDrawerElement : ''}`}>
      {drawerComponentType === DRAWER_COMPONENT_CATEGORY.ADD_ELEMENTS && (
        <ElementsSidebar />
      )}
      {drawerComponentType === DRAWER_COMPONENT_CATEGORY.PAGES && (
        <ThumbnailSidebar />
      )}
      {drawerComponentType === DRAWER_COMPONENT_CATEGORY.DOCUMENT_VARIABLES && (
        <VariablesSidebar />
      )}
      {drawerComponentType === DRAWER_COMPONENT_CATEGORY.SETTINGS && (
        <SettingsSidebar />
      )}
      {drawerComponentType === DRAWER_COMPONENT_CATEGORY.RECIPIENTS && (
        <RecipientsSidebar />
      )}
    </div>
  );
};

export default EditorLeftDrawer;
