import { Request, Response } from 'express';
import Settings from '../models/Settings';

export const getSettings = async (req: Request, res: Response) => {
  try {
    const business_id = req.query.business_id as string;
    
    if (!business_id) {
      return res.status(400).json({ message: 'business_id is required' });
    }
    
    let settings = await Settings.findOne({ business_id });
    if (!settings) {
      // Create default settings if none exist for this business
      settings = await Settings.create({ business_id });
    }
    res.status(200).json(settings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
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
    res.status(400).json({ message: error.message });
  }
};
