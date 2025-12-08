import { Request, Response } from 'express';
import Document from '../models/Document';

export const getDocuments = async (req: Request, res: Response) => {
  try {
    const business_id = req.query.business_id as string;
    
    if (!business_id) {
      return res.status(400).json({ message: 'business_id is required' });
    }
    
    const documents = await Document.find({ business_id });
    res.status(200).json(documents);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getDocumentById = async (req: Request, res: Response) => {
  try {
    const business_id = req.query.business_id as string;
    
    if (!business_id) {
      return res.status(400).json({ message: 'business_id is required' });
    }
    
    const document = await Document.findOne({ _id: req.params.id, business_id });
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(200).json(document);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createDocument = async (req: Request, res: Response) => {
  try {
    const business_id = req.query.business_id as string;
    console.log({req, res});
    
    if (!business_id) {
      return res.status(400).json({ message: 'business_id is required' });
    }
    
    const newDocument = new Document({
      ...req.body,
      business_id
    });
    console.log({newDocument});
    
    const savedDocument = await newDocument.save();
    console.log({savedDocument});
    
    res.status(201).json(savedDocument);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateDocument = async (req: Request, res: Response) => {
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
    
    const updatedDocument = await Document.findOneAndUpdate(
      { _id: req.params.id, business_id },
      updateData,
      { new: true }
    );
    if (!updatedDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(200).json(updatedDocument);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const business_id = req.query.business_id as string;
    
    if (!business_id) {
      return res.status(400).json({ message: 'business_id is required' });
    }
    
    const deletedDocument = await Document.findOneAndDelete({ 
      _id: req.params.id, 
      business_id 
    });
    if (!deletedDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadDocumentPdf = async (req: Request, res: Response) => {
  try {
    const business_id = req.query.business_id as string;
    
    if (!business_id) {
      return res.status(400).json({ message: 'business_id is required' });
    }
    
    // We expect the client to upload to Firebase first and send us the URL/Path
    const { documentName, signers, uploadPath } = req.body;
    
    if (!uploadPath) {
        return res.status(400).json({ message: 'No upload path provided' });
    }

    const newDocument = new Document({
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
    res.status(500).json({ message: error.message });
  }
};
