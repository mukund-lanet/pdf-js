import {
  CanvasElement,
  GHLBlockElement,
  GHLFillableElement,
  Page,
  PageDimension,
  TextElement,
  ImageElement,
  GHLVideoElement,
  GHLTableElement,
  GHLSignatureElement,
  GHLTextFieldElement,
  GHLDateFieldElement,
  GHLInitialsFieldElement,
  GHLCheckboxElement,
  HeadingElement,
  ImageElement,
  VideoElement,
  TableElement,
  TextElement,
  SignatureElement,
  DateElement,
  InitialsElement,
  CheckboxElement,
  PageComponent,
  PageStyles
} from './interface';

/**
 * Converts a legacy CanvasElement to a GHLBlockElement or GHLFillableElement.
 */
export const convertLegacyElementToGHL = (
  element: CanvasElement
): GHLBlockElement | GHLFillableElement | null => {
  const commonResponsiveStyles = {
    large: {
      position: {
        top: element.y,
        left: element.x,
        width: element.width,
        height: element.height,
      },
      dimensions: {
        width: element.width,
        height: element.height,
      },
    },
  };

  switch (element.type) {
    // --- Block Elements ---
    case 'heading': {
      const headingEl = element as HeadingElement;
      const newElement: TextElement = {
        type: 'Text',
        version: 1,
        id: headingEl.id,
        children: [],
        component: {
          name: 'Text Element',
          options: {
            text: headingEl.content,
          },
        },
        responsiveStyles: {
          large: {
            ...commonResponsiveStyles.large,
            color: headingEl.color,
            fontSize: headingEl.fontSize,
            fontWeight: headingEl.fontWeight,
            textAlign: headingEl.textAlign,
            fontStyle: headingEl.fontStyle,
            textDecoration: headingEl.textDecoration,
            fontFamily: headingEl.fontFamily,
          },
        },
      };
      return newElement;
    }

    case 'image': {
      const imageEl = element as ImageElement;
      const newElement: ImageElement = {
        type: 'Image',
        version: 1,
        id: imageEl.id,
        children: [],
        component: {
          name: 'Image Element',
          options: {
            src: imageEl.imageUrl || imageEl.imageData || '',
            altText: 'Image',
            href: '',
          },
        },
        responsiveStyles: {
          large: {
            ...commonResponsiveStyles.large,
            imageEffect: imageEl.imageEffect,
            align: imageEl.align,
          },
        },
      };
      return newElement;
    }

    case 'video': {
      const videoEl = element as VideoElement;
      const newElement: GHLVideoElement = {
        type: 'Video',
        version: 1,
        id: videoEl.id,
        children: [],
        component: {
          name: 'Video Element',
          options: {
            src: videoEl.videoUrl || '',
            html: '', // Legacy didn't have this
          },
        },
        responsiveStyles: commonResponsiveStyles,
      };
      return newElement;
    }

    case 'table': {
      const tableEl = element as TableElement;
      // Legacy table data structure is different, might need serialization or simplification
      // For now, we'll just put a placeholder or basic structure
      const newElement: GHLTableElement = {
        type: 'Table',
        version: 1,
        id: tableEl.id,
        children: [],
        component: {
          name: 'Table Element',
          options: {
            text: JSON.stringify(tableEl.data || []), // Storing raw data as text for now
          },
        },
        responsiveStyles: {
          large: {
            ...commonResponsiveStyles.large,
            textAlign: tableEl.textAlign,
            fontStyle: tableEl.fontStyle,
            textDecoration: tableEl.textDecoration,
            color: tableEl.color,
            fontSize: tableEl.fontSize,
            fontWeight: tableEl.fontWeight,
            fontFamily: tableEl.fontFamily,
          },
        },
      };
      return newElement;
    }

    // --- Fillable Elements ---
    case 'text-field': {
      const textEl = element as TextElement;
      const newElement: GHLTextFieldElement = {
        type: 'TextField',
        version: 1,
        id: textEl.id,
        children: [],
        component: {
          isDraggable: true,
          name: 'Text Field Element',
          options: {
            isGhost: false,
            text: textEl.content,
            required: textEl.required || false,
            fieldId: textEl.id, // Using ID as fieldId for now
            src: '',
            recipient: '', // Needs to be filled from context if available
            timestamp: null,
            entityName: '',
            placeholder: textEl.placeholder || '',
          },
        },
        responsiveStyles: {
          large: {
            ...commonResponsiveStyles.large,
            textAlign: textEl.textAlign,
            fontStyle: textEl.fontStyle,
            fontWeight: textEl.fontWeight,
            textDecoration: textEl.textDecoration,
            fontSize: textEl.fontSize,
            color: textEl.color,
          },
        },
      };
      return newElement;
    }

    case 'signature': {
      const sigEl = element as SignatureElement;
      const newElement: GHLSignatureElement = {
        type: 'Signature',
        version: 1,
        id: sigEl.id,
        children: [],
        component: {
          isDraggable: true,
          name: 'Signature Element',
          options: {
            isGhost: false,
            showName: sigEl.showSignerName || false,
            text: sigEl.content || '',
            required: true, // Signatures usually required
            fieldId: sigEl.id,
            src: sigEl.imageData,
            recipient: '',
            timestamp: null,
            entityName: '',
          },
        },
        responsiveStyles: commonResponsiveStyles,
      };
      return newElement;
    }

    case 'date': {
      const dateEl = element as DateElement;
      const newElement: GHLDateFieldElement = {
        type: 'DateField',
        version: 1,
        id: dateEl.id,
        children: [],
        component: {
          isDraggable: true,
          name: 'Text Field Element', // GHL reuses this name sometimes, or we can use specific
          options: {
            isGhost: false,
            text: dateEl.value || '',
            required: dateEl.required || false,
            fieldId: dateEl.id,
            src: '',
            recipient: '',
            timestamp: null,
            entityName: '',
            placeholder: dateEl.placeholder || '',
            availableDates: dateEl.availableDates || '',
            dateFormat: dateEl.dateFormat || 'MM/DD/YYYY',
          },
        },
        responsiveStyles: commonResponsiveStyles,
      };
      return newElement;
    }

    case 'initials': {
      const initEl = element as InitialsElement;
      const newElement: GHLInitialsFieldElement = {
        type: 'InitialsField',
        version: 1,
        id: initEl.id,
        children: [],
        component: {
          isDraggable: true,
          name: 'Initials Field Element',
          options: {
            isGhost: false,
            text: initEl.content,
            required: true,
            fieldId: initEl.id,
            src: '',
            recipient: '',
            timestamp: null,
            entityName: '',
          },
        },
        responsiveStyles: commonResponsiveStyles,
      };
      return newElement;
    }

    case 'checkbox': {
      const checkEl = element as CheckboxElement;
      const newElement: GHLCheckboxElement = {
        type: 'Checkbox',
        version: 1,
        id: checkEl.id,
        children: [],
        component: {
          isDraggable: true,
          name: 'Checkbox Field Element',
          options: {
            isGhost: false,
            text: '',
            required: checkEl.required || false,
            preChecked: checkEl.checked,
            isConditionalLogic: false,
            fieldId: checkEl.id,
            src: '',
            recipient: '',
            timestamp: null,
            entityName: '',
          },
        },
        responsiveStyles: commonResponsiveStyles,
      };
      return newElement;
    }

    default:
      console.warn(`Unknown element type: ${(element as any).type}`);
      return null;
  }
};

/**
 * Groups flat legacy elements into pages based on their 'page' property.
 */
export const groupElementsIntoPages = (
  elements: CanvasElement[],
  pageDimensions: PageDimension[]
): Page[] => {
  return pageDimensions.map((dim, index) => {
    const pageIndex = index + 1; // Legacy pages are 1-indexed usually, but let's check. 
    // Assuming 'page' in CanvasElement is 1-indexed based on typical usage.
    
    const pageElements = elements.filter((el) => el.page === pageIndex);
    
    const children = pageElements
      .map(convertLegacyElementToGHL)
      .filter((el): el is GHLBlockElement | GHLFillableElement => el !== null);

    const pageComponent: PageComponent = {
      name: 'Page',
      options: {
        src: '', // Will be filled by Firebase upload later
        pageDimensions: {
          dimensions: {
            width: dim.pageWidth,
            height: dim.pageHeight,
          },
          margins: { top: 0, right: 0, bottom: 0, left: 0 },
          rotation: 'portrait', // Default
        },
      },
    };

    const pageStyles: PageStyles = {
      backgroundColor: '#ffffff',
      backgroundPosition: 'center',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      opacity: 1,
    };

    const page: Page = {
      type: 'Page',
      version: 1,
      id: `page-${pageIndex}-${Date.now()}`,
      children,
      component: pageComponent,
      responsiveStyles: {
        large: pageStyles,
      },
    };

    return page;
  });
};
