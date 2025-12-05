import { Request, Response } from 'express';
import Contract from '../models/Contract';

export const getContracts = async (req: Request, res: Response) => {
  try {
    const business_id = req.query.business_id as string;
    
    if (!business_id) {
      return res.status(400).json({ message: 'business_id is required' });
    }
    
    const contracts = await Contract.find({ business_id });
    res.status(200).json(contracts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getContractById = async (req: Request, res: Response) => {
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
    res.status(500).json({ message: error.message });
  }
};

export const createContract = async (req: Request, res: Response) => {
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
    res.status(400).json({ message: error.message });
  }
};

export const updateContract = async (req: Request, res: Response) => {
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
    res.status(400).json({ message: error.message });
  }
};

export const deleteContract = async (req: Request, res: Response) => {
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
    res.status(500).json({ message: error.message });
  }
};
