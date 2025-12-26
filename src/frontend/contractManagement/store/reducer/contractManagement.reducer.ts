import * as Actions from '../action/contractManagement.actions';
import { v4 as uuidv4 } from 'uuid';
import {
  DocumentItem,
  ContractItem,
  Page
} from '../../utils/interface';
import { CanvasElement, TextElement, DRAWER_COMPONENT_CATEGORY } from '../../utils/interface';

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
  activeDocument: DocumentItem | null;
  // PDF Editor State
  totalPages: number;
  currentPage: number;
  activeTool: null | 'text' | 'image' | 'signature';
  media: any;
  selectedTextElement: TextElement | null;
  isSignaturePadOpen: boolean;
  signatureForElement: string | null;
  isLoading: boolean;
  drawerComponentCategory: DRAWER_COMPONENT_CATEGORY;
  activeElementId: string | null;
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
  activeDocument: null,
  // PDF Editor State
  totalPages: 0,
  currentPage: 1,
  activeTool: null,
  media: null,
  selectedTextElement: null,
  isSignaturePadOpen: false,
  signatureForElement: null,
  isLoading: false,
  drawerComponentCategory: DRAWER_COMPONENT_CATEGORY.ADD_ELEMENTS,
  activeElementId: null,
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
        progress: 0, 
        dueDate: 'No due date', 
        createdBy: 'Current User', 
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

    case Actions.UPDATE_DOCUMENT: {
      const { documentId, documentName, signers, signingOrder, canvasElements } = action.payload;
      const updatedDocuments = state.documents.map(doc =>
        doc._id === documentId
          ? { ...doc, name: documentName, signers, signingOrder, canvasElements }
          : doc
      );

      return {
        ...state,
        documents: updatedDocuments,
        activeDocument: state.activeDocument && state.activeDocument._id === documentId
          ? { ...state.activeDocument, name: documentName, signers, signingOrder, canvasElements }
          : state.activeDocument,
        isUnsaved: false,
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

    case Actions.SET_CANVAS_ELEMENTS:
      // Payload: { pageId, elements }
      return {
        ...state,
        pages: state.pages.map(page =>
          page.id === action.payload.pageId
            ? { ...page, elements: action.payload.elements }
            : page
        ),
        isUnsaved: true,
      };

    case Actions.ADD_CANVAS_ELEMENT:
      // Payload: { pageId, element }
      return {
        ...state,
        pages: state.pages.map(page =>
          page.id === action.payload.pageId
            ? { ...page, elements: [...page.elements, action.payload.element] }
            : page
        ),
        isUnsaved: true,
      };

    case Actions.UPDATE_CANVAS_ELEMENT:
      // Payload: { pageId, element }
      return {
        ...state,
        pages: state.pages.map(page =>
          page.id === action.payload.pageId
            ? {
                ...page,
                elements: page.elements.map(el =>
                  el.id === action.payload.element.id ? action.payload.element : el
                )
              }
            : page
        ),
        selectedTextElement:
          state.selectedTextElement && state.selectedTextElement.id === action.payload.element.id && action.payload.element.type === 'text-field'
            ? (action.payload.element as TextElement)
            : state.selectedTextElement,
        isUnsaved: true,
      };

    case Actions.DELETE_CANVAS_ELEMENT:
      // Payload: { pageId, elementId }
      return {
        ...state,
        pages: state.pages.map(page =>
          page.id === action.payload.pageId
            ? {
                ...page,
                elements: page.elements.filter(el => el.id !== action.payload.elementId)
              }
            : page
        ),
        selectedTextElement:
          state.selectedTextElement && state.selectedTextElement.id === action.payload.elementId
            ? null
            : state.selectedTextElement,
        activeElementId: state.activeElementId === action.payload.elementId ? null : state.activeElementId,
        isUnsaved: true,
      };

    case Actions.ADD_BLOCK_ELEMENT: {
      // Payload: { pageId, element }
      const { pageId, element } = action.payload;
      
      return {
        ...state,
        pages: state.pages.map(page => {
          if (page.id !== pageId) return page;
          
          const pageBlocks = page.elements.filter(
            el => ['heading', 'image', 'video', 'table'].includes(el.type)
          );
          const maxOrder = pageBlocks.length > 0
            ? Math.max(...pageBlocks.map((el: any) => el.order || 0))
            : -1;

          const blockWithOrder = {
            ...element,
            order: maxOrder + 1
          };

          return {
            ...page,
            elements: [...page.elements, blockWithOrder]
          };
        }),
        isUnsaved: true,
      };
    }

    case Actions.REORDER_BLOCK_ELEMENTS: {
      // Payload: { pageId, sourceIndex, destinationIndex }
      const { pageId, sourceIndex, destinationIndex } = action.payload;

      return {
        ...state,
        pages: state.pages.map(page => {
          if (page.id !== pageId) return page;

          const pageBlocks = page.elements
            .filter((el: CanvasElement) => ['heading', 'image', 'video', 'table'].includes(el.type))
            .sort((a: any, b: any) => a.order - b.order);

          const otherElements = page.elements.filter(
            (el: CanvasElement) => !['heading', 'image', 'video', 'table'].includes(el.type)
          );

          const [movedBlock] = pageBlocks.splice(sourceIndex, 1);
          pageBlocks.splice(destinationIndex, 0, movedBlock);

          const updatedBlocks = pageBlocks.map((block: any, index: number) => ({
            ...block,
            order: index
          }));

          return {
            ...page,
            elements: [...otherElements, ...updatedBlocks]
          };
        }),
        isUnsaved: true,
      };
    }

    case Actions.UPDATE_BLOCK_ORDER: {
      // Payload: { pageId, blockOrders }
      const { pageId, blockOrders } = action.payload;
      const orderMap = new Map(blockOrders.map((item: any) => [item.id, item.order]));

      return {
        ...state,
        pages: state.pages.map(page => {
          if (page.id !== pageId) return page;

          return {
            ...page,
            elements: page.elements.map((el: CanvasElement) => {
              if (orderMap.has(el.id)) {
                return {
                  ...el,
                  order: orderMap.get(el.id)!
                } as any;
              }
              return el;
            })
          };
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

    case Actions.UPDATE_MULTIPLE_ELEMENTS: {
      // Payload: [{ pageId, element }, ...]
      const updates = action.payload;
      
      return {
        ...state,
        pages: state.pages.map(page => {
          const pageUpdates = updates.filter((u: any) => u.pageId === page.id);
          if (pageUpdates.length === 0) return page;
          
          const updateMap = new Map(pageUpdates.map((u: any) => [u.element.id, u.element]));
          
          return {
            ...page,
            elements: page.elements.map((el: CanvasElement) => updateMap.get(el.id) || el)
          };
        }),
        isUnsaved: true,
      };
    }

    case Actions.RESET_EDITOR:
      return {
        ...state,
        totalPages: 0,
        currentPage: 1,
        activeTool: null,
        media: null,
        selectedTextElement: null,
        isSignaturePadOpen: false,
        signatureForElement: null,
        isLoading: false,
        drawerComponentCategory: DRAWER_COMPONENT_CATEGORY.PAGES,
        activeElementId: null,
        propertiesDrawerState: {
          anchorEl: null,
          isOpen: false
        },
        pages: [],
        isUnsaved: false,
      };

    case Actions.SET_PAGES:
      // Ensure all pages have elements array
      const pagesWithElements = action.payload.map((page: Page) => ({
        ...page,
        elements: page.elements || []
      }));
      
      return {
        ...state,
        pages: pagesWithElements,
        isUnsaved: true,
      };

    case Actions.REORDER_PAGE_ELEMENTS: {
      const { sourceIndex, destinationIndex } = action.payload;
      
      // Simply reorder pages - elements stay within their pages
      const newPages = [...state.pages];
      const [movedPage] = newPages.splice(sourceIndex, 1);
      newPages.splice(destinationIndex, 0, movedPage);

      // Update current page tracking
      let newCurrentPage = state.currentPage;
      const currentPageIndex = state.currentPage - 1;
      
      if (currentPageIndex === sourceIndex) {
        newCurrentPage = destinationIndex + 1;
      } else if (sourceIndex < destinationIndex) {
        if (currentPageIndex > sourceIndex && currentPageIndex <= destinationIndex) {
          newCurrentPage = state.currentPage - 1;
        }
      } else {
        if (currentPageIndex >= destinationIndex && currentPageIndex < sourceIndex) {
          newCurrentPage = state.currentPage + 1;
        }
      }

      return {
        ...state,
        pages: newPages,
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
