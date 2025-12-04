"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contractManagementController_1 = require("../controllers/contractManagementController");
const router = express_1.default.Router();
router.get('/', contractManagementController_1.getContractManagementState);
router.put('/', contractManagementController_1.updateContractManagementState);
router.post('/sync', contractManagementController_1.syncDocumentsList);
exports.default = router;
