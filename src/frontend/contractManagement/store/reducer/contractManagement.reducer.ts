import * as Actions from '../action/contractManagement.actions';
import { v4 as uuidv4 } from 'uuid';
import {
  DocumentItem,
  ContractItem,
  Page
} from '../../utils/interface';
import { CanvasElement, TextElement, DRAWER_COMPONENT_CATEGORY, DocumentVariable } from '../../utils/interface';

export interface ContractManagementState {
  pdfBuilderDrawerOpen: boolean;
  documentDrawerOpen: boolean;
  documentDrawerMode: 'create' | 'upload' | 'edit' | null;
  documentActiveFilter: string;
  contractActiveFilter: string;
  identityVerificationDialogOpen: boolean;
  globalDocumentSettingsDialogOpen: boolean;
  brandingCustomizationDialogOpen: boolean;
  identityVerificationSettings: {
    isVarifyOn: boolean;
    verificationMethod: string;
    isRequireAllSigners: boolean;
    isRequirePhone: boolean;
  };
  globalDocumentSettings: {
    senderName: string;
    senderEmail: string;
    emailSubject: string;
    emailTemplate: string;
    redirectDateNotification: boolean;
    dueDateNotification: boolean;
    completionNotification: boolean;
    reminderNotification: boolean;
    daysBeforeDueDate: number;
  };
  brandingCustomizationSettings: {
    senderName: string;
    senderEmail: string;
    emailSubjectLine: string;
    emailMessage: string;
    ctaButtonText: string;
    footerText: string;
    companyName: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logo: any;
  };
  contractDrawer: {
    createContractDrawerOpen: boolean;
    contractName: string;
    contractType: string;
    contractValue: number;
    contractValueCurrency: string;
    startDate: string;
    endDate: string;
    renewalPeriod: number;
    noticePeriod: number;
    autoRenewal: boolean;
    termsAndConditions: string;
    paymentTerms: string;
  };
  documentsFilters: {
    all: number;
    draft: number;
    waiting: number;
    completed: number;
    archived: number;
  };
  contractsFilters: {
    all: number;
    active: number;
    expired: number;
  };
  stats: {
    totalDocuments: number;
    activeContracts: number;
    pendingSignatures: number;
    contractValue: number;
  };
  documents: DocumentItem[];
  documentCount: number;
  filters: {
    search: string;
    status: string;
    limit: number;
    offset: number;
  };
  contracts: ContractItem[];
  activeDocument: DocumentItem;
  // PDF Editor State
  totalPages: number;
  currentPage: number;
  canvasElements: CanvasElement[];
  pageDimensions: { [key: number]: { pageWidth: number; pageHeight: number } };
  activeTool: null | 'text' | 'image' | 'signature';
  media: any;
  selectedTextElement: TextElement | null;
  isSignaturePadOpen: boolean;
  signatureForElement: string | null;
  isLoading: boolean;
  drawerComponentCategory: DRAWER_COMPONENT_CATEGORY;
  activeElementId: string | null;
  documentVariables: DocumentVariable[];
  propertiesDrawerState: {
    anchorEl: null | HTMLElement;
    isOpen: boolean;
  };
  documentType: 'upload-existing' | 'new_document' | null;
  uploadPdfUrl: string | null;
  // API Data
  documentsList: any[];
  contractsList: any[];
  settingsData: any | null;
  pages: Page[];
  isUnsaved: boolean;
}

export interface RootState {
  contractManagement: ContractManagementState;
}

const initialState: ContractManagementState = {
  pdfBuilderDrawerOpen: false,
  documentDrawerOpen: false,
  documentDrawerMode: null,
  documentActiveFilter: 'all',
  contractActiveFilter: 'all',
  identityVerificationDialogOpen: false,
  globalDocumentSettingsDialogOpen: false,
  brandingCustomizationDialogOpen: false,
  identityVerificationSettings: {
    isVarifyOn: false,
    verificationMethod: "",
    isRequireAllSigners: false,
    isRequirePhone: false
  },
  globalDocumentSettings: {
    senderName: "",
    senderEmail: "",
    emailSubject: "",
    emailTemplate: "default",
    redirectDateNotification: false,
    dueDateNotification: false,
    completionNotification: false,
    reminderNotification: false,
    daysBeforeDueDate: 3,
  },
  brandingCustomizationSettings: {
    senderName: "",
    senderEmail: "",
    emailSubjectLine: "",
    emailMessage: "",
    ctaButtonText: "",
    footerText: "",
    companyName: "",
    primaryColor: "",
    secondaryColor: "",
    accentColor: "",
    logo: null,
  },
  contractDrawer: {
    createContractDrawerOpen: false,
    contractName: "",
    contractType: "Service Contract",
    contractValue: 0.00,
    contractValueCurrency: "USD",
    startDate: "",
    endDate: "",
    renewalPeriod: 0,
    noticePeriod: 0,
    autoRenewal: false,
    termsAndConditions: "",
    paymentTerms: "",
  },
  documentsFilters: {
    all: 0,
    draft: 0,
    waiting: 0,
    completed: 0,
    archived: 0,
  },
  contractsFilters: {
    all: 0,
    active: 0,
    expired: 0,
  },
  stats: {
    totalDocuments: 0,
    activeContracts: 0,
    pendingSignatures: 0,
    contractValue: 0,
  },
  documents: [],
  documentCount: 0,
  filters: {
    search: '',
    status: 'all',
    limit: 25,
    offset: 0
  },
  contracts: [],
  activeDocument: {
    status: 'draft'
  },
  // PDF Editor State
  totalPages: 0,
  currentPage: 1,
  canvasElements: [],
  pageDimensions: {},
  activeTool: null,
  media: null,
  selectedTextElement: null,
  isSignaturePadOpen: false,
  signatureForElement: null,
  isLoading: false,
  drawerComponentCategory: DRAWER_COMPONENT_CATEGORY.ADD_ELEMENTS,
  activeElementId: null,
  documentVariables: [],
  propertiesDrawerState: {
    anchorEl: null,
    isOpen: false
  },
  documentType: null,
  uploadPdfUrl: null,
  // API Data
  documentsList: [],
  contractsList: [],
  settingsData: null,
  pages: [],
  isUnsaved: false,
};

export const contractManagementReducer = (state = initialState, action: Actions.ContractManagementAction): ContractManagementState => {
  switch (action.type) {
    case Actions.SET_ACTIVE_DOCUMENT:
      return {
        ...state,
        activeDocument: action.payload,
        isUnsaved: false,
      };
    case Actions.SET_DIALOG_STATE:
      return {
        ...state,
        [action.payload.dialogName]: action.payload.isOpen,
      };
    case Actions.SET_DOCUMENT_ACTIVE_FILTER:
      return {
        ...state,
        documentActiveFilter: action.payload,
      };
    case Actions.SET_CONTRACT_ACTIVE_FILTER:
      return {
        ...state,
        contractActiveFilter: action.payload,
      };
    case Actions.SET_IDENTITY_VERIFICATION_SETTINGS:
      return {
        ...state,
        identityVerificationSettings: action.payload,
      };
    case Actions.SET_GLOBAL_DOCUMENT_SETTINGS:
      return {
        ...state,
        globalDocumentSettings: action.payload,
      };
    case Actions.SET_BRANDING_CUSTOMIZATION_SETTINGS:
      return {
        ...state,
        brandingCustomizationSettings: action.payload,
      };
    case Actions.CREATE_NEW_DOCUMENT: {
      const newDoc: DocumentItem = {
        _id: uuidv4(),
        name: action.payload.documentName,
        status: 'draft',
        date: new Date().toISOString(),
        signers: action.payload.signers,
        progress: 0, // Start at 0% for new documents
        dueDate: 'No due date', // Default or calculate based on settings
        createdBy: 'Current User', // Replace with actual user info if available
        signingOrder: action.payload.signingOrder || false,
      };

      return {
        ...state,
        documents: [newDoc, ...state.documents],
        stats: {
          ...state.stats,
          totalDocuments: state.stats.totalDocuments + 1,
        },
        documentsFilters: {
          ...state.documentsFilters,
          all: state.documentsFilters.all + 1,
          draft: state.documentsFilters.draft + 1,
        }
      };
    }
    case Actions.UPLOAD_DOCUMENT_PDF: {
      const newDoc: DocumentItem = {
        _id: uuidv4(),
        name: action.payload.documentName,
        status: 'draft',
        date: new Date().toISOString(),
        signers: action.payload.signers,
        progress: 0,
        dueDate: 'No due date',
        createdBy: 'Current User',
      };

      return {
        ...state,
        documents: [newDoc, ...state.documents],
        stats: {
          ...state.stats,
          totalDocuments: state.stats.totalDocuments + 1,
        },
        documentsFilters: {
          ...state.documentsFilters,
          all: state.documentsFilters.all + 1,
          draft: state.documentsFilters.draft + 1,
        }
      };
    }

    // case Actions.SET_ACTIVE_DOCUMENT: {
    //   return {
    //     ...state,
    //     activeDocument: action.payload,
    //   };
    // }

    case Actions.UPDATE_DOCUMENT: {
      const { documentId, documentName, signers, signingOrder, canvasElements, pageDimensions } = action.payload;
      const updatedDocuments = state.documents.map(doc =>
        doc._id === documentId
          ? { ...doc, name: documentName, signers, signingOrder, canvasElements, pageDimensions }
          : doc
      );

      return {
        ...state,
        documents: updatedDocuments,
        // Update activeDocument if it's the one being modified, otherwise keep it as is (or null)
        activeDocument: state.activeDocument && state.activeDocument._id === documentId
          ? { ...state.activeDocument, name: documentName, signers, signingOrder, canvasElements, pageDimensions }
          : state.activeDocument,
        isUnsaved: true,
      };
    }

    case Actions.SET_DOCUMENT_DRAWER_MODE: {
      return {
        ...state,
        documentDrawerMode: action.payload,
      };
    }

    // PDF Editor Actions
    case Actions.SET_PROPERTIES_DRAWER_STATE:
      return {
        ...state,
        propertiesDrawerState: action.payload
      };

    case Actions.SET_PDF_MEDIA:
      return {
        ...state,
        media: action.payload
      };

    case Actions.SET_DOCUMENT_TYPE:
      return {
        ...state,
        documentType: action.payload
      };

    case Actions.SET_UPLOAD_PDF_URL:
      return {
        ...state,
        uploadPdfUrl: action.payload
      };

    case Actions.SET_DRAWER_COMPONENT_CATEGORY:
      return {
        ...state,
        drawerComponentCategory: action.payload
      };

    case Actions.SET_ACTIVE_ELEMENT_ID:
      return {
        ...state,
        activeElementId: action.payload
      };

    case Actions.ADD_DOCUMENT_VARIABLE:
      return {
        ...state,
        documentVariables: [...state.documentVariables, action.payload],
        isUnsaved: true,
      };

    case Actions.DELETE_DOCUMENT_VARIABLE:
      return {
        ...state,
        documentVariables: state.documentVariables.filter(v => v.name !== action.payload),
        isUnsaved: true,
      };

    case Actions.UPDATE_DOCUMENT_VARIABLE:
      return {
        ...state,
        documentVariables: state.documentVariables.map(v =>
          v.name === action.payload.name ? action.payload : v
        ),
        isUnsaved: true,
      };

    case Actions.SET_IS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };



    case Actions.SET_TOTAL_PAGES:
      return {
        ...state,
        totalPages: action.payload
      };

    case Actions.SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload
      };

    case Actions.SET_PAGE_DIMENSIONS:
      return {
        ...state,
        pageDimensions: action.payload,
        isUnsaved: true,
      };

    case Actions.SET_CANVAS_ELEMENTS:
      return {
        ...state,
        canvasElements: action.payload,
        isUnsaved: true,
      };

    case Actions.ADD_CANVAS_ELEMENT:
      return {
        ...state,
        canvasElements: [...state.canvasElements, action.payload],
        isUnsaved: true,
      };

    case Actions.UPDATE_CANVAS_ELEMENT:
      return {
        ...state,
        canvasElements: state.canvasElements.map(el =>
          el.id === action.payload.id ? action.payload : el
        ),
        // also update the selectedTextElement if its the one being updated
        selectedTextElement:
          state.selectedTextElement && state.selectedTextElement.id === action.payload.id && action.payload.type === 'text-field'
            ? (action.payload as TextElement)
            : state.selectedTextElement,
        isUnsaved: true,
      };

    case Actions.DELETE_CANVAS_ELEMENT:
      const filteredElements = state.canvasElements.filter(el => el.id !== action.payload);
      return {
        ...state,
        canvasElements: filteredElements,
        // clear the selected text element if it's the one being deleted
        selectedTextElement:
          state.selectedTextElement && state.selectedTextElement.id === action.payload
            ? null
            : state.selectedTextElement,
        activeElementId: state.activeElementId === action.payload ? null : state.activeElementId,
        isUnsaved: true,
      };

    case Actions.ADD_BLOCK_ELEMENT: {
      const { element, pageNumber } = action.payload;
      // calculate the next order for this page
      const pageBlocks = state.canvasElements.filter(
        el => el.page === pageNumber && ['heading', 'image', 'video', 'table'].includes(el.type)
      );
      const maxOrder = pageBlocks.length > 0
        ? Math.max(...pageBlocks.map((el: any) => el.order || 0))
        : -1;

      const blockWithOrder = {
        ...element,
        order: maxOrder + 1
      };

      return {
        ...state,
        canvasElements: [...state.canvasElements, blockWithOrder],
        isUnsaved: true,
      };
    }

    case Actions.REORDER_BLOCK_ELEMENTS: {
      const { pageNumber, sourceIndex, destinationIndex } = action.payload;

      // get all blocks for this page and sorted by order
      const pageBlocks = state.canvasElements
        .filter(el => el.page === pageNumber && ['heading', 'image', 'video', 'table'].includes(el.type))
        .sort((a: any, b: any) => a.order - b.order);

      // get non-block elements
      const otherElements = state.canvasElements.filter(
        el => !(el.page === pageNumber && ['heading', 'image', 'video', 'table'].includes(el.type))
      );

      // reorder the blocks
      const [movedBlock] = pageBlocks.splice(sourceIndex, 1);
      pageBlocks.splice(destinationIndex, 0, movedBlock);

      // update the orders
      const updatedBlocks = pageBlocks.map((block, index) => ({
        ...block,
        order: index
      }));

      return {
        ...state,
        canvasElements: [...otherElements, ...updatedBlocks],
        isUnsaved: true,
      };
    }

    case Actions.UPDATE_BLOCK_ORDER: {
      const { pageNumber, blockOrders } = action.payload;
      const orderMap = new Map(blockOrders.map(item => [item.id, item.order]));

      return {
        ...state,
        canvasElements: state.canvasElements.map(el => {
          if (el.page === pageNumber && orderMap.has(el.id)) {
            return {
              ...el,
              order: orderMap.get(el.id)!
            };
          }
          return el;
        }),
        isUnsaved: true,
      };
    }

    case Actions.SET_ACTIVE_TOOL:
      return {
        ...state,
        activeTool: action.payload
      };

    case Actions.SET_SELECTED_TEXT_ELEMENT:
      return {
        ...state,
        selectedTextElement: action.payload
      };

    case Actions.SET_SIGNATURE_PAD_OPEN:
      return {
        ...state,
        isSignaturePadOpen: action.payload
      };

    case Actions.SET_SIGNATURE_FOR_ELEMENT:
      return {
        ...state,
        signatureForElement: action.payload
      };

    case Actions.UPDATE_MULTIPLE_ELEMENTS:
      const updates = action.payload;
      const updateMap = new Map(updates.map((el: CanvasElement) => [el.id, el]));

      return {
        ...state,
        canvasElements: state.canvasElements.map(el => updateMap.get(el.id) || el),
        isUnsaved: true,
      };

    case Actions.RESET_EDITOR:
      return {
        ...state,
        totalPages: 0,
        currentPage: 1,
        canvasElements: [],
        pageDimensions: {},
        activeTool: null,
        media: null,
        selectedTextElement: null,
        isSignaturePadOpen: false,
        signatureForElement: null,
        isLoading: false,
        drawerComponentCategory: DRAWER_COMPONENT_CATEGORY.PAGES,
        activeElementId: null,
        documentVariables: [
          {
            name: 'document.createdDate',
            value: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            isSystem: true
          },
          {
            name: 'document.refNumber',
            value: `P${Math.floor(10000 + Math.random() * 90000)} `,
            isSystem: true
          },
          {
            name: 'document.subAccountName',
            value: "CRMOne",
            isSystem: true
          },
        ],
        propertiesDrawerState: {
          anchorEl: null,
          isOpen: false
        },
        isUnsaved: false,
      };

    case Actions.SET_PAGES:
      return {
        ...state,
        pages: action.payload,
        isUnsaved: true,
      };

    case Actions.REORDER_PAGE_ELEMENTS: {
      const { sourceIndex, destinationIndex } = action.payload;
      const sourcePage = sourceIndex + 1;
      const destPage = destinationIndex + 1;

      // Update Canvas Elements
      const updatedElements = state.canvasElements.map(el => {
        if (el.page === sourcePage) {
          return { ...el, page: destPage };
        }

        if (sourcePage < destPage) {
          if (el.page > sourcePage && el.page <= destPage) {
            return { ...el, page: el.page - 1 };
          }
        } else {
          if (el.page >= destPage && el.page < sourcePage) {
            return { ...el, page: el.page + 1 };
          }
        }

        return el;
      });

      const newPageDimensions: { [key: number]: { pageWidth: number; pageHeight: number } } = {};
      Object.entries(state.pageDimensions).forEach(([key, value]) => {
        const pageNum = parseInt(key);
        let newPageNum = pageNum;

        if (pageNum === sourcePage) {
          newPageNum = destPage;
        } else if (sourcePage < destPage) {
          if (pageNum > sourcePage && pageNum <= destPage) {
            newPageNum = pageNum - 1;
          }
        } else {
          if (pageNum >= destPage && pageNum < sourcePage) {
            newPageNum = pageNum + 1;
          }
        }
        newPageDimensions[newPageNum] = value;
      });

      let newCurrentPage = state.currentPage;
      if (state.currentPage === sourcePage) {
        newCurrentPage = destPage;
      } else if (sourcePage < destPage) {
        if (state.currentPage > sourcePage && state.currentPage <= destPage) {
          newCurrentPage = state.currentPage - 1;
        }
      } else {
        if (state.currentPage >= destPage && state.currentPage < sourcePage) {
          newCurrentPage = state.currentPage + 1;
        }
      }

      return {
        ...state,
        canvasElements: updatedElements,
        pageDimensions: newPageDimensions,
        currentPage: newCurrentPage,
        isUnsaved: true,
      };
    }

    case Actions.SET_IS_UNSAVED:
      return {
        ...state,
        isUnsaved: action.payload,
      };

    // API Data Actions
    case Actions.SET_DOCUMENTS:
      return {
        ...state,
        documents: action.payload.documents,
        documentCount: action.payload.count,
        documentsList: action.payload.documents // Keep for compatibility
      };

    case Actions.SET_DOCUMENT_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };

    case Actions.SET_FETCHING_DOCUMENTS:
      return {
        ...state,
        isLoading: action.payload
      };

    case Actions.SET_DOCUMENTS_LIST:
      return {
        ...state,
        documentsList: action.payload,
        documents: action.payload // Also update documents for compatibility
      };

    case Actions.SET_CONTRACTS_LIST:
      return {
        ...state,
        contractsList: action.payload,
        contracts: action.payload // Also update contracts for compatibility
      };

    case Actions.SET_SETTINGS_DATA:
      return {
        ...state,
        settingsData: action.payload
      };

    default:
      return state;
  }
};
