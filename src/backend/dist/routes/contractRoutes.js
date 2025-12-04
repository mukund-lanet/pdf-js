"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contractController_1 = require("../controllers/contractController");
const router = express_1.default.Router();
router.get('/', contractController_1.getContracts);
router.get('/:id', contractController_1.getContractById);
router.post('/', contractController_1.createContract);
router.put('/:id', contractController_1.updateContract);
router.delete('/:id', contractController_1.deleteContract);
exports.default = router;
