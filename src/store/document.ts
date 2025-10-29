import { create } from 'zustand';
import { Document, Page, TextBox } from '@/types/document';

interface DocumentState {
  currentDocument: Document | null;
  currentPageIndex: number;
  isEditing: boolean;
  
  // Actions
  createDocument: (title: string) => void;
  setCurrentPageIndex: (index: number) => void;
  addPage: (page: Page) => void;
  updatePage: (pageId: string, updates: Partial<Page>) => void;
  deletePage: (pageIndex: number) => void;
  movePage: (fromIndex: number, toIndex: number) => void;
  addTextBox: (pageId: string, textBox: Omit<TextBox, 'id' | 'pageId' | 'createdAt' | 'updatedAt'>) => void;
  updateTextBox: (pageId: string, textBoxId: string, updates: Partial<TextBox>) => void;
  deleteTextBox: (pageId: string, textBoxId: string) => void;
  setEditing: (isEditing: boolean) => void;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  currentDocument: null,
  currentPageIndex: 0,
  isEditing: false,

  createDocument: (title: string) => {
    const newDocument: Document = {
      id: crypto.randomUUID(),
      title,
      pages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set({ currentDocument: newDocument, currentPageIndex: 0 });
  },

  setCurrentPageIndex: (index: number) => {
    set({ currentPageIndex: index });
  },

  addPage: (page: Page) => {
    set((state) => ({
      currentDocument: state.currentDocument
        ? {
            ...state.currentDocument,
            pages: [...state.currentDocument.pages, page],
            updatedAt: new Date(),
          }
        : null,
    }));
  },

  addTextBox: (pageId: string, textBox: Omit<TextBox, 'id' | 'pageId' | 'createdAt' | 'updatedAt'>) => {
    set((state) => {
      if (!state.currentDocument) return state;

      const now = new Date();
      const newTextBox: TextBox = {
        ...textBox,
        id: crypto.randomUUID(),
        pageId,
        createdAt: now,
        updatedAt: now,
      };

      const updatedPages = state.currentDocument.pages.map((page) =>
        page.id === pageId
          ? { ...page, textBoxes: [...page.textBoxes, newTextBox] }
          : page
      );

      return {
        currentDocument: {
          ...state.currentDocument,
          pages: updatedPages,
          updatedAt: now,
        },
      };
    });
  },

  updateTextBox: (pageId: string, textBoxId: string, updates: Partial<TextBox>) => {
    set((state) => {
      if (!state.currentDocument) return state;

      const updatedPages = state.currentDocument.pages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              textBoxes: page.textBoxes.map((textBox) =>
                textBox.id === textBoxId
                  ? { ...textBox, ...updates, updatedAt: new Date() }
                  : textBox
              ),
            }
          : page
      );

      return {
        currentDocument: {
          ...state.currentDocument,
          pages: updatedPages,
          updatedAt: new Date(),
        },
      };
    });
  },

  updatePage: (pageId: string, updates: Partial<Page>) => {
    set((state) => {
      if (!state.currentDocument) return state;

      const updatedPages = state.currentDocument.pages.map((page) =>
        page.id === pageId
          ? { ...page, ...updates }
          : page
      );

      return {
        currentDocument: {
          ...state.currentDocument,
          pages: updatedPages,
          updatedAt: new Date(),
        },
      };
    });
  },

  setEditing: (isEditing: boolean) => {
    set({ isEditing });
  },

  deleteTextBox: (pageId: string, textBoxId: string) => {
    set((state) => {
      if (!state.currentDocument) return state;

      const updatedPages = state.currentDocument.pages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              textBoxes: page.textBoxes.filter((textBox) => textBox.id !== textBoxId),
            }
          : page
      );

      return {
        currentDocument: {
          ...state.currentDocument,
          pages: updatedPages,
          updatedAt: new Date(),
        },
      };
    });
  },

  deletePage: (pageIndex: number) => {
    set((state) => {
      if (!state.currentDocument) return state;

      const updatedPages = [...state.currentDocument.pages];
      updatedPages.splice(pageIndex, 1);

      return {
        currentDocument: {
          ...state.currentDocument,
          pages: updatedPages,
          updatedAt: new Date(),
        },
      };
    });
  },

  movePage: (fromIndex: number, toIndex: number) => {
    set((state) => {
      if (!state.currentDocument) return state;

      const updatedPages = [...state.currentDocument.pages];
      const [page] = updatedPages.splice(fromIndex, 1);
      updatedPages.splice(toIndex, 0, page);

      return {
        currentDocument: {
          ...state.currentDocument,
          pages: updatedPages,
          updatedAt: new Date(),
        },
      };
    });
  },
}));