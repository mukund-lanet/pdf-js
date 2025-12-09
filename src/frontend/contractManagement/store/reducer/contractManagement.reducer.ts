import * as Actions from '../action/contractManagement.actions';
import { v4 as uuidv4 } from 'uuid';
import { 
  DocumentItem,
  ContractItem,
  Page,
  FillableField
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
  contracts: ContractItem[];
  activeDocument: DocumentItem | null;
  // PDF Editor State
  pdfBytes: Uint8Array | null;
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
  
  // GHL Architecture State
  pages: Page[];
  fillableFields: FillableField[];
  fontsToLoad: string[];
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
  contracts: [],
  activeDocument: null,
  // PDF Editor State
  pdfBytes: null,
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
  documentType: null,
  uploadPdfUrl: null,
  // API Data
  documentsList: [],
  contractsList: [],
  settingsData: null,
  
  // GHL Architecture State
  pages: [],
  fillableFields: [],
  fontsToLoad: ['Open Sans']
};

const createDefaultPage = (): Page => ({
  type: "Page",
  version: 1,
  id: uuidv4(),
  children: [],
  component: {
    name: "Page",
    options: {
      src: "",
      pageDimensions: {
        dimensions: { width: 816, height: 1056 }, // Standard US Letter @ 96 DPI
        margins: { top: 0, right: 0, bottom: 0, left: 0 },
        rotation: "portrait"
      }
    }
  },
  responsiveStyles: {
    large: {
       backgroundColor: "#ffffff",
       backgroundPosition: "center",
       backgroundSize: "contain",
       backgroundRepeat: "no-repeat",
       opacity: 1
    }
  }
});

export const contractManagementReducer = (state = initialState, action: Actions.ContractManagementAction): ContractManagementState => {
  // console.log('ContractManagement Reducer Action:', action.type);
  switch (action.type) {
    case Actions.SET_ACTIVE_DOCUMENT:
      console.log('SET_ACTIVE_DOCUMENT payload:', action.payload);
      return {
        ...state,
        activeDocument: action.payload,
        pages: action.payload?.pages || [],
        fillableFields: action.payload?.fillableFields || [],
        totalPages: action.payload?.pages?.length || 0,
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

      const defaultPage = createDefaultPage();
      
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
        },
        pages: [defaultPage],
        totalPages: 1,
        currentPage: 1
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
      const { documentId, documentName, signers, signingOrder, pages, fillableFields, variables } = action.payload;
      const updatedDocuments = state.documents.map(doc => 
        doc._id === documentId 
          ? { ...doc, name: documentName, signers, signingOrder, pages, fillableFields, variables }
          : doc
      );
      
      return {
        ...state,
        documents: updatedDocuments,
        // Update activeDocument if it's the one being modified
        activeDocument: state.activeDocument && state.activeDocument._id === documentId 
          ? { ...state.activeDocument, name: documentName, signers, signingOrder, pages, fillableFields, variables }
          : state.activeDocument,
        // Also update the global state pages/fillableFields if this is the active document
        pages: state.activeDocument && state.activeDocument._id === documentId && pages ? pages : state.pages,
        fillableFields: state.activeDocument && state.activeDocument._id === documentId && fillableFields ? fillableFields : state.fillableFields,
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
        documentVariables: [...state.documentVariables, action.payload]
      };

    case Actions.DELETE_DOCUMENT_VARIABLE:
      return {
        ...state,
        documentVariables: state.documentVariables.filter(v => v.name !== action.payload)
      };

    case Actions.UPDATE_DOCUMENT_VARIABLE:
      return {
        ...state,
        documentVariables: state.documentVariables.map(v =>
          v.name === action.payload.name ? action.payload : v
        )
      };

    case Actions.SET_IS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case Actions.SET_PDF_BYTES:
      return {
        ...state,
        pdfBytes: action.payload
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
        pageDimensions: action.payload
      };

    case Actions.SET_CANVAS_ELEMENTS:
      return {
        ...state,
        canvasElements: action.payload
      };

    case Actions.ADD_CANVAS_ELEMENT:
      return {
        ...state,
        canvasElements: [...state.canvasElements, action.payload]
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
            : state.selectedTextElement
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
        activeElementId: state.activeElementId === action.payload ? null : state.activeElementId
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
        canvasElements: [...state.canvasElements, blockWithOrder]
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
        canvasElements: [...otherElements, ...updatedBlocks]
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
        })
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
        canvasElements: state.canvasElements.map(el => updateMap.get(el.id) || el)
      };

    case Actions.RESET_EDITOR:
      return {
        ...state,
        pdfBytes: null,
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
        pages: [],
        fillableFields: []
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
        currentPage: newCurrentPage
      };
    }
    
    // API Data Actions
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
    
    // ==================== GHL Architecture Actions ====================
    
    case Actions.SET_PAGES:
      return {
        ...state,
        pages: action.payload,
        totalPages: action.payload.length
      };

    case Actions.ADD_PAGE: {
      const { page, index } = action.payload;
      const newPages = [...state.pages];
      
      if (typeof index === 'number' && index >= 0 && index <= newPages.length) {
        newPages.splice(index, 0, page);
      } else {
        newPages.push(page);
      }
      
      return {
        ...state,
        pages: newPages,
        totalPages: newPages.length
      };
    }

    case Actions.DELETE_PAGE: {
      const newPages = state.pages.filter(p => p.id !== action.payload);
      // Adjust current page if needed
      let newCurrentPage = state.currentPage;
      if (newCurrentPage > newPages.length) {
        newCurrentPage = Math.max(1, newPages.length);
      }
      
      return {
        ...state,
        pages: newPages,
        totalPages: newPages.length,
        currentPage: newCurrentPage
      };
    }

    case Actions.REORDER_PAGES: {
      const { sourceIndex, destinationIndex } = action.payload;
      const newPages = [...state.pages];
      const [movedPage] = newPages.splice(sourceIndex, 1);
      newPages.splice(destinationIndex, 0, movedPage);
      
      return {
        ...state,
        pages: newPages
      };
    }

    case Actions.UPDATE_PAGE_STYLES: {
      const { pageId, styles } = action.payload;
      return {
        ...state,
        pages: state.pages.map(page => 
          page.id === pageId 
            ? { 
                ...page, 
                responsiveStyles: {
                  ...page.responsiveStyles,
                  large: {
                    ...page.responsiveStyles.large,
                    ...styles
                  }
                }
              }
            : page
        )
      };
    }

    case Actions.ADD_ELEMENT_TO_PAGE: {
      const { pageNumber, element } = action.payload;
      const pageIndex = pageNumber - 1;

      if (pageIndex < 0 || pageIndex >= state.pages.length) return state;

      const newPages = [...state.pages];
      const page = { ...newPages[pageIndex] };
      
      page.children = [...page.children, element];
      newPages[pageIndex] = page;

      return {
        ...state,
        pages: newPages
      };
    }

    case Actions.UPDATE_ELEMENT_IN_PAGE: {
      const { pageNumber, element } = action.payload;
      const pageIndex = pageNumber - 1;

      if (pageIndex < 0 || pageIndex >= state.pages.length) return state;

      const newPages = [...state.pages];
      const page = { ...newPages[pageIndex] };

      page.children = page.children.map(child => 
        child.id === element.id ? element : child
      );

      newPages[pageIndex] = page;

      return {
        ...state,
        pages: newPages
      };
    }



    case Actions.DELETE_ELEMENT_FROM_PAGE: {
      const { pageNumber, elementId } = action.payload;
      const pageIndex = pageNumber - 1;

      if (pageIndex < 0 || pageIndex >= state.pages.length) return state;

      const newPages = [...state.pages];
      const page = { ...newPages[pageIndex] };

      page.children = page.children.filter(child => child.id !== elementId);
      newPages[pageIndex] = page;

      return {
        ...state,
        pages: newPages
      };
    }

    case Actions.REORDER_ELEMENTS_IN_PAGE: {
      const { pageNumber, sourceIndex, destinationIndex } = action.payload;
      const pageIndex = pageNumber - 1;

      if (pageIndex < 0 || pageIndex >= state.pages.length) return state;

      const newPages = [...state.pages];
      const page = { ...newPages[pageIndex] };
      const newChildren = [...page.children];

      const [movedElement] = newChildren.splice(sourceIndex, 1);
      newChildren.splice(destinationIndex, 0, movedElement);

      page.children = newChildren;
      newPages[pageIndex] = page;

      return {
        ...state,
        pages: newPages
      };
    }

    case Actions.MOVE_ELEMENT_BETWEEN_PAGES: {
      const { sourcePageId, destPageId, elementId, newPosition } = action.payload;
      
      // Find the element and source page
      const sourcePage = state.pages.find(p => p.id === sourcePageId);
      const elementToMove = sourcePage?.children.find(c => c.id === elementId);
      
      if (!sourcePage || !elementToMove) return state;

      // Create updated element with new position if provided
      const updatedElement = newPosition 
        ? {
            ...elementToMove,
            responsiveStyles: {
              ...elementToMove.responsiveStyles,
              large: {
                ...elementToMove.responsiveStyles.large,
                position: {
                  ...elementToMove.responsiveStyles.large.position,
                  ...newPosition
                }
              }
            }
          }
        : elementToMove;

      return {
        ...state,
        pages: state.pages.map(page => {
          if (page.id === sourcePageId) {
            return {
              ...page,
              children: page.children.filter(c => c.id !== elementId)
            };
          }
          if (page.id === destPageId) {
            return {
              ...page,
              children: [...page.children, updatedElement]
            };
          }
          return page;
        })
      };
    }

    case Actions.REGISTER_FILLABLE_FIELD:
      // Avoid duplicates
      if (state.fillableFields.some(f => f.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        fillableFields: [...state.fillableFields, action.payload]
      };

    case Actions.UNREGISTER_FILLABLE_FIELD:
      return {
        ...state,
        fillableFields: state.fillableFields.filter(f => f.fieldId !== action.payload)
      };

    case Actions.SET_PAGE_FIREBASE_URL: {
      const { pageId, url } = action.payload;
      return {
        ...state,
        pages: state.pages.map(page => 
          page.id === pageId 
            ? { 
                ...page, 
                component: {
                  ...page.component,
                  options: {
                    ...page.component.options,
                    src: url
                  }
                }
              }
            : page
        )
      };
    }
    default:
      return state;
  }
};
