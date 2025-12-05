import express from 'express';
import {
  getContractManagementState,
  updateContractManagementState,
  syncDocumentsList
} from '../controllers/contractManagementController';

const router = express.Router();

router.get('/', getContractManagementState);
router.put('/', updateContractManagementState);
router.post('/sync', syncDocumentsList);

export default router;
