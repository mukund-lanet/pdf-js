import React from 'react';
import styles from '@/app/(after-login)/(with-header)/contract-management/contractManagement.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setDocumentActiveFilter, setDialogDrawerState, setActiveDocument, setDocumentDrawerMode, getDocuments, setDocumentFilters, upsertDocument } from '../store/action/contractManagement.actions';
import { noDocument, documentTableHeaders } from '../utils/utils';
import { DIALOG_DRAWER_NAMES } from '../utils/interface';
import Typography from "@trenchaant/pkg-ui-component-library/build/Components/Typography";
import EmptyMessageComponent from "@trenchaant/pkg-ui-component-library/build/Components/EmptyMessageComponent";
import Table from "@trenchaant/pkg-ui-component-library/build/Components/Table";
import TableBody from '@trenchaant/pkg-ui-component-library/build/Components/TableBody';
import TableRow from '@trenchaant/pkg-ui-component-library/build/Components/TableRow';
import TableCell from '@trenchaant/pkg-ui-component-library/build/Components/TableCell';
import Tabs from "@trenchaant/pkg-ui-component-library/build/Components/Tabs";
import Tab from "@trenchaant/pkg-ui-component-library/build/Components/Tab";
import Menu from '@trenchaant/pkg-ui-component-library/build/Components/Menu';
import MenuItem from '@trenchaant/pkg-ui-component-library/build/Components/MenuItem';
import CustomIcon from "@trenchaant/pkg-ui-component-library/build/Components/CustomIcon";
import IconButton from "@trenchaant/pkg-ui-component-library/build/Components/IconButton";
import Dialog from "@trenchaant/pkg-ui-component-library/build/Components/Dialog";
import SimpleLoading from "@trenchaant/pkg-ui-component-library/build/Components/SimpleLoading";
import {RootState} from "../store/reducer/contractManagement.reducer"

const DocumentsViewer = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const activeFilter = useSelector((state: RootState) => state.contractManagement?.documentActiveFilter);
  const documents = useSelector((state: RootState) => state.contractManagement?.documents);
  const business = useSelector((state: any) => state?.auth?.business);
  const documentCount = useSelector((state: RootState) => state?.contractManagement?.documentCount) || 0;
  const filters_state = useSelector((state: RootState) => state?.contractManagement?.filters) || { search: '', status: 'all', limit: 25, offset: 0 };

  const isLoading = useSelector((state: RootState) => state.contractManagement?.isLoading);

  const { search = '', status = 'all', limit = 25, offset = 0 } = filters_state;
  const currentPage = offset / limit;

  const filteredDocuments = React.useMemo(() => {
    if (!documents) return [];
    if (activeFilter === 'all') return documents;
    return documents.filter(doc => doc.status === activeFilter);
  }, [documents, activeFilter]);

  const filters = React.useMemo(() => {
    const counts = {
      all: documents?.length || 0,
      draft: documents?.filter(d => d.status === 'draft').length || 0,
      waiting: documents?.filter(d => d.status === 'waiting').length || 0,
      completed: documents?.filter(d => d.status === 'completed').length || 0,
      payments: 0, // Assuming no payment status in DocumentItem yet
      archived: documents?.filter(d => d.status === 'archived').length || 0,
    };

    return [
      { id: 'all', label: 'All', count: counts.all },
      { id: 'draft', label: 'Draft', count: counts.draft },
      { id: 'waiting', label: 'Waiting for others', count: counts.waiting },
      { id: 'completed', label: 'Completed', count: counts.completed },
      { id: 'payments', label: 'Payments', count: counts.payments },
      { id: 'archived', label: 'Archived', count: counts.archived },
    ];
  }, [documents]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedDocId, setSelectedDocId] = React.useState<string | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [documentToDelete, setDocumentToDelete] = React.useState<{ id: string; name: string } | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, docId: string | undefined) => {
    setAnchorEl(event.currentTarget);
    setSelectedDocId(docId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDocId(undefined);
  };

  const handleEditDocument = () => {
    const doc = documents.find(d => d._id === selectedDocId);
    if (doc) {
      dispatch(setActiveDocument(doc));
      dispatch(setDocumentDrawerMode('edit'));
      dispatch(setDialogDrawerState(DIALOG_DRAWER_NAMES.DOCUMENT_DRAWER, true));
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    const doc = documents?.find(d => d._id === selectedDocId);
    if (doc && doc._id) {
      setDocumentToDelete({ id: doc._id, name: doc.name || '' });
      setDeleteDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleConfirmDelete = () => {
    if (documentToDelete) {
      dispatch(upsertDocument({
        id: documentToDelete.id,
        name: documentToDelete.name,
        business_id: business?.id,
      }));
    }
    setDeleteDialogOpen(false);
    setDocumentToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setDocumentToDelete(null);
  };

  const handleChangePage = async (event: unknown, newPage: number) => {
    const newOffset = newPage * limit;
    dispatch(setDocumentFilters({ ...filters_state, offset: newOffset }));
    await dispatch(getDocuments({ ...filters_state, offset: newOffset, business_id: business?.id }));
  };

  const handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10);
    dispatch(setDocumentFilters({ ...filters_state, limit: newLimit, offset: 0 }));
    await dispatch(getDocuments({ ...filters_state, limit: newLimit, offset: 0, business_id: business?.id }));
  };

  return (
    <div className={styles.viewerArea}>
      <div className={styles.viewerHeader}>
        <Typography fontWeight="600" className={styles.tabElementTitle} >Documents</Typography>
        <Tabs 
          // className={styles.filterTabs}
          value={activeFilter}
          indicatorColor="primary"
          textColor="primary"
          onChange={(event: React.ChangeEvent<{}>, newValue: string) => dispatch(setDocumentActiveFilter(newValue))}
        >
          {filters.map(filter => (
            <Tab
              key={filter.id}
              className={styles.filterTab}
              value={filter.id}
              label={ <Typography>{`${filter.label} (${filter.count})`}</Typography> }
            />
          ))}
        </Tabs>
      </div>

      {filteredDocuments && filteredDocuments.length > 0 ? (
        <div className={styles.documentsTableWrapper}>
          <Table 
            className={styles.documentsTable}
            totalRecords={filteredDocuments.length}
            headerList={documentTableHeaders}
            totalLabel="Documents"
            tablePagination={{
              rowsPerPageOptions: [25, 50, 75, 100],
              count: documentCount,
              rowsPerPage: limit,
              page: currentPage,
              onChangePage: handleChangePage,
              onChangeRowsPerPage: handleChangeRowsPerPage,
            }}
          >
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc._id}>
                  <TableCell className={styles.tableCellDocs} >
                    <div className={styles.docNameWrapper}>
                      <div className={styles.docIcon}>
                        <CustomIcon iconName="file-text" width={20} height={20} />
                      </div>
                      <div className={styles.docInfo}>
                        <Typography 
                          onClick={() => {
                            router.push(`/${business?.url_key}/pdf-editor/builder/${doc._id}`);
                            // dispatch(setActiveDocument(doc));
                          }}
                          className={styles.docName}
                        >{doc.name}</Typography>
                        <Typography className={styles.docMeta}>by {doc.createdBy || 'Unknown'}</Typography>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className={`${styles.tableCellDocs} ${styles.widthApply}`} >
                    <div className={`${styles.statusChip} ${styles[doc.status]}`}>
                      <CustomIcon iconName="edit-2" width={12} height={12} />
                      {doc.status.charAt(0).toUpperCase() + doc.status?.slice(1)}
                    </div>
                  </TableCell>
                  <TableCell className={styles.tableCellDocs} >
                    <div className={styles.signersWrapper}>
                      <CustomIcon iconName="users" width={14} height={14} />
                      {doc.signers?.length || 0} signers
                    </div>
                  </TableCell>
                  <TableCell className={styles.tableCellDocs} >
                    <div className={styles.progressWrapper}>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill} 
                          style={{ width: `${doc.progress}%` }}
                        />
                      </div>
                      <Typography className={styles.progressText}>{doc.progress}%</Typography>
                    </div>
                  </TableCell>
                  <TableCell className={styles.tableCellDocs} >
                    <div className={styles.dateWrapper}>
                      <CustomIcon iconName="calendar" width={14} height={14} />
                      <Typography className={styles.docMeta}>
                        {doc.date && new Date(doc.date).toLocaleDateString()}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell className={styles.tableCellDocs} >
                    <div className={styles.dateWrapper}>
                      <Typography className={styles.docMeta}>{doc.dueDate}</Typography>
                    </div>
                  </TableCell>
                  <TableCell className={`${styles.tableCellDocs} ${styles.widthApply}`} >
                    <IconButton 
                      size="small"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleMenuOpen(e, doc._id)}
                    >
                      <CustomIcon iconName="more-vertical" width={16} height={16} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>) 
      : !isLoading ? (
        <div className={styles.emptyMsgComponentWrapper} >
            <EmptyMessageComponent 
              {...noDocument} 
              button={{
                label: "Create Document",
                variant: "contained",
                color: "primary",
                onClick: () => dispatch(setDialogDrawerState(DIALOG_DRAWER_NAMES.PDF_BUILDER_DRAWER, true))
              }} 
            />
        </div>) 
      : (<div>
          <SimpleLoading />
        </div>)}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        className={styles.documentActionMenu}
      >
        <MenuItem
          key="view_document"
          // onClick={() => handleItemClick("view_document")}
          className={styles.menuItem}
        >
          <CustomIcon iconName="eye" width={16} height={16} />
          <Typography>View Document</Typography>
        </MenuItem>

        <MenuItem
          key="certificate_of_completion"
          // onClick={() => handleItemClick("certificate_of_completion")}
          className={styles.menuItem}
        >
          <CustomIcon iconName="file-check-2" width={16} height={16} />
          <Typography> Certificate of Completion </Typography>
        </MenuItem>

        <MenuItem
          key="edit_document"
          onClick={handleEditDocument}
          className={styles.menuItem}
        >
          <CustomIcon iconName="edit-2" width={16} height={16} />
          <Typography> Edit Document </Typography>
        </MenuItem>

        <MenuItem
          key="send_for_signature"
          // onClick={() => handleItemClick("send_for_signature")}
          className={styles.menuItem}
        >
          <CustomIcon iconName="send" width={16} height={16} />
          <Typography> Send for Signature </Typography>
        </MenuItem>

        <MenuItem
          key="download"
          // onClick={() => handleItemClick("download")}
          className={styles.menuItem}
        >
          <CustomIcon iconName="download" width={16} height={16} />
          <Typography> Download </Typography>
        </MenuItem>

        <MenuItem
          key="manage_signers"
          // onClick={() => handleItemClick("manage_signers")}
          className={styles.menuItem}
        >
          <CustomIcon iconName="user" width={16} height={16} />
          <Typography> Manage Signers </Typography>
        </MenuItem>

        <MenuItem
          key="delete"
          onClick={handleDeleteClick}
          className={styles.menuItem}
        >
          <CustomIcon iconName="trash-2" width={16} height={16} />
          <Typography> Delete </Typography>
        </MenuItem>
      </Menu>

      <Dialog
        open={deleteDialogOpen}
        label="Delete Document"
        closeIcon
        size="400px"
        submitBtn={{
          onClick: handleConfirmDelete,
          label: "Delete",
          color: "error"
        }}
        cancelBtn={{
          onClick: handleCancelDelete,
          label: "Cancel"
        }}
      >
        <div style={{ padding: '16px 0' }}>
          <Typography>
            Are you sure you want to delete <strong>{documentToDelete?.name}</strong>?
          </Typography>
          <Typography style={{ marginTop: '8px', color: '#666' }}>
            This action cannot be undone.
          </Typography>
        </div>
      </Dialog>
    </div>
  );
};

export default DocumentsViewer;
