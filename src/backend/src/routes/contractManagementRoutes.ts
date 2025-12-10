import { log } from "mcr-common/src/expresshelper/helper/logger";
import { ContractDocument } from "../model/documentModel";
import { Contract } from "../model/contractModel";
import { Settings } from "../model/settingsModel";
import { ContractManagement } from "../model/contractManagementModel";

// ==================== DOCUMENT ROUTES ====================

export const getDocuments = async (req: any, res: any) => {
  try {
    const business_id = req.query.business_id as string;
    
    if (!business_id) {
      return res.status(400).json({ message: 'business_id is required' });
    }
    
    const documents = await ContractDocument.find({ business_id });
    res.status(200).json(documents);
  } catch (error: any) {
    log.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getDocumentById = async (req: any, res: any) => {
  try {
    const business_id = req.query.business_id as string;
    
    if (!business_id) {
      return res.status(400).json({ message: 'business_id is required' });
    }
    
    const document = await ContractDocument.findOne({ _id: req.params.id, business_id });
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(200).json(document);
  } catch (error: any) {
    log.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const createDocument = async (req: any, res: any) => {
  try {
    const business_id = req.query.business_id as string;
    
    if (!business_id) {
      return res.status(400).json({ message: 'business_id is required' });
    }
    
    // Create default page for new documents
    const createDefaultPage = () => ({
      type: "Page",
      version: 1,
      id: `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      children: [],
      component: {
        name: "Page",
        options: {
          src: "",
          pageDimensions: {
            dimensions: { width: 816, height: 1056 },
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
    
    // If this is a new document (not upload), create default page
    const documentData: any = {
      ...req.body,
      business_id
    };
    
    // Only create default page for new documents
    if (req.body.documentType === 'new_document' || !req.body.documentType) {
      documentData.pages = [createDefaultPage()];
      documentData.totalPages = 1;
    }
    
    const newDocument = new ContractDocument(documentData);
    
    const savedDocument = await newDocument.save();
    res.status(201).json(savedDocument);
  } catch (error: any) {
    log.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const updateDocument = async (req: any, res: any) => {
  try {
    const business_id = req.query.business_id as string;
    
    if (!business_id) {
      return res.status(400).json({ message: 'business_id is required' });
    }
    
    const updateData: any = {};
    
    // Basic document fields
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.signers !== undefined) updateData.signers = req.body.signers;
    if (req.body.signingOrder !== undefined) updateData.signingOrder = req.body.signingOrder;
    if (req.body.status !== undefined) updateData.status = req.body.status;
    if (req.body.dueDate !== undefined) updateData.dueDate = req.body.dueDate;
    
    // PDF Editor state fields
    if (req.body.uploadPath !== undefined) updateData.uploadPath = req.body.uploadPath;
    if (req.body.canvasElements !== undefined) updateData.canvasElements = req.body.canvasElements;
    if (req.body.pageDimensions !== undefined) updateData.pageDimensions = req.body.pageDimensions;
    if (req.body.totalPages !== undefined) updateData.totalPages = req.body.totalPages;
    if (req.body.variables !== undefined) updateData.variables = req.body.variables;
    if (req.body.pages !== undefined) updateData.pages = req.body.pages;
    
    const updatedDocument = await ContractDocument.findOneAndUpdate(
      { _id: req.params.id, business_id },
      updateData,
      { new: true }
    );
    
    if (!updatedDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(200).json(updatedDocument);
  } catch (error: any) {
    log.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteDocument = async (req: any, res: any) => {
  try {
    const business_id = req.query.business_id as string;
    
    if (!business_id) {
      return res.status(400).json({ message: 'business_id is required' });
    }
    
    const deletedDocument = await ContractDocument.findOneAndDelete({ 
      _id: req.params.id, 
      business_id
    });
    
    if (!deletedDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error: any) {
    log.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const uploadDocumentPdf = async (req: any, res: any) => {
  try {
    const business_id = req.query.business_id as string;
    
    if (!business_id) {
      return res.status(400).json({ message: 'business_id is required' });
    }
    
    const { documentName, signers, uploadPath } = req.body;
    
    if (!uploadPath) {
      return res.status(400).json({ message: 'No upload path provided' });
    }

    const newDocument = new ContractDocument({
      name: documentName || 'Untitled Document',
      uploadPath: uploadPath,
      documentType: 'upload-existing',
      signers: signers ? (typeof signers === 'string' ? JSON.parse(signers) : signers) : [],
      status: 'draft',
      business_id
    });

    const savedDocument = await newDocument.save();
    res.status(201).json(savedDocument);
  } catch (error: any) {
    log.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ==================== CONTRACT ROUTES ====================

export const getContracts = async (req: any, res: any) => {
  try {
    const business_id = req.query.business_id as string;
    
    if (!business_id) {
      return res.status(400).json({ message: 'business_id is required' });
    }
    
    const contracts = await Contract.find({ business_id });
    res.status(200).json(contracts);
  } catch (error: any) {
    log.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getContractById = async (req: any, res: any) => {
  try {
    const business_id = req.query.business_id as string;
    
    if (!business_id) {
      return res.status(400).json({ message: 'business_id is required' });
    }
    
    const contract = await Contract.findOne({ _id: req.params.id, business_id });
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.status(200).json(contract);
  } catch (error: any) {
    log.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const createContract = async (req: any, res: any) => {
  try {
    const business_id = req.query.business_id as string;
    
    if (!business_id) {
      return res.status(400).json({ message: 'business_id is required' });
    }
    
    const newContract = new Contract({
      ...req.body,
      business_id
    });
    const savedContract = await newContract.save();
    res.status(201).json(savedContract);
  } catch (error: any) {
    log.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const updateContract = async (req: any, res: any) => {
  try {
    const business_id = req.query.business_id as string;
    
    if (!business_id) {
      return res.status(400).json({ message: 'business_id is required' });
    }
    
    const updatedContract = await Contract.findOneAndUpdate(
      { _id: req.params.id, business_id },
      req.body,
      { new: true }
    );
    
    if (!updatedContract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.status(200).json(updatedContract);
  } catch (error: any) {
    log.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteContract = async (req: any, res: any) => {
  try {
    const business_id = req.query.business_id as string;
    
    if (!business_id) {
      return res.status(400).json({ message: 'business_id is required' });
    }
    
    const deletedContract = await Contract.findOneAndDelete({ 
      _id: req.params.id, 
      business_id
    });
    
    if (!deletedContract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.status(200).json({ message: 'Contract deleted successfully' });
  } catch (error: any) {
    log.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ==================== SETTINGS ROUTES ====================

export const getSettings = async (req: any, res: any) => {
  try {
    const business_id = req.query.business_id as string;
    
    if (!business_id) {
      return res.status(400).json({ message: 'business_id is required' });
    }
    
    let settings = await Settings.findOne({ business_id });
    if (!settings) {
      settings = await Settings.create({ business_id });
    }
    res.status(200).json(settings);
  } catch (error: any) {
    log.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateSettings = async (req: any, res: any) => {
  try {
    const business_id = req.query.business_id as string;
    
    if (!business_id) {
      return res.status(400).json({ message: 'business_id is required' });
    }
    
    const settings = await Settings.findOneAndUpdate(
      { business_id }, 
      { ...req.body, business_id }, 
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );
    res.status(200).json(settings);
  } catch (error: any) {
    log.error(error);
    res.status(400).json({ message: error.message });
  }
};

// ==================== CONTRACT MANAGEMENT STATE ROUTES ====================

export const getContractManagementState = async (req: any, res: any) => {
  try {
    const business_id = req.query.business_id as string;
    
    if (!business_id) {
      return res.status(400).json({ message: 'business_id is required' });
    }
    
    let state = await ContractManagement.findOne({ business_id })
      .populate('documents')
      .populate('contracts');

    if (!state) {
      state = await ContractManagement.create({ business_id });
    }

    res.status(200).json(state);
  } catch (error: any) {
    log.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateContractManagementState = async (req: any, res: any) => {
  try {
    const business_id = req.query.business_id as string;
    
    if (!business_id) {
      return res.status(400).json({ message: 'business_id is required' });
    }
    
    const state = await ContractManagement.findOneAndUpdate(
      { business_id }, 
      { ...req.body, business_id },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    ).populate('documents').populate('contracts');
    
    res.status(200).json(state);
  } catch (error: any) {
    log.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const syncDocumentsList = async (req: any, res: any) => {
  try {
    const business_id = req.query.business_id as string;
    
    if (!business_id) {
      return res.status(400).json({ message: 'business_id is required' });
    }
    
    const allDocs = await ContractDocument.find({ business_id }).select('_id');
    const allContracts = await Contract.find({ business_id }).select('_id');
    
    const state = await ContractManagement.findOneAndUpdate(
      { business_id },
      {
        documents: allDocs.map(d => d._id),
        contracts: allContracts.map(c => c._id)
      }, 
      { new: true, upsert: true }
    );
    
    res.status(200).json(state);
  } catch (error: any) {
    log.error(error);
    res.status(500).json({ message: error.message });
  }
};
