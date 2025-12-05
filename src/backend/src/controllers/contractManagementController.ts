import { Request, Response } from 'express';
import ContractManagement from '../models/ContractManagement';
import Document from '../models/Document';
import Contract from '../models/Contract';

export const getContractManagementState = async (req: Request, res: Response) => {
  try {
    // Assuming single user/tenant for now, so we get the first one or create it
    let state = await ContractManagement.findOne()
      .populate('documents')
      .populate('contracts');

    if (!state) {
      state = await ContractManagement.create({});
    }

    res.status(200).json(state);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateContractManagementState = async (req: Request, res: Response) => {
  try {
    const state = await ContractManagement.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }).populate('documents').populate('contracts');
    
    res.status(200).json(state);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Helper to sync documents list if needed (optional, depends on how frontend handles it)
export const syncDocumentsList = async (req: Request, res: Response) => {
  try {
    const allDocs = await Document.find().select('_id');
    const allContracts = await Contract.find().select('_id');
    
    const state = await ContractManagement.findOneAndUpdate({}, {
      documents: allDocs.map(d => d._id),
      contracts: allContracts.map(c => c._id)
    }, { new: true });
    
    res.status(200).json(state);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
