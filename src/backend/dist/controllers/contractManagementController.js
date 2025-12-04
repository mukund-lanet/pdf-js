"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncDocumentsList = exports.updateContractManagementState = exports.getContractManagementState = void 0;
const ContractManagement_1 = __importDefault(require("../models/ContractManagement"));
const Document_1 = __importDefault(require("../models/Document"));
const Contract_1 = __importDefault(require("../models/Contract"));
const getContractManagementState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Assuming single user/tenant for now, so we get the first one or create it
        let state = yield ContractManagement_1.default.findOne()
            .populate('documents')
            .populate('contracts');
        if (!state) {
            state = yield ContractManagement_1.default.create({});
        }
        res.status(200).json(state);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getContractManagementState = getContractManagementState;
const updateContractManagementState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const state = yield ContractManagement_1.default.findOneAndUpdate({}, req.body, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
        }).populate('documents').populate('contracts');
        res.status(200).json(state);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.updateContractManagementState = updateContractManagementState;
// Helper to sync documents list if needed (optional, depends on how frontend handles it)
const syncDocumentsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allDocs = yield Document_1.default.find().select('_id');
        const allContracts = yield Contract_1.default.find().select('_id');
        const state = yield ContractManagement_1.default.findOneAndUpdate({}, {
            documents: allDocs.map(d => d._id),
            contracts: allContracts.map(c => c._id)
        }, { new: true });
        res.status(200).json(state);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.syncDocumentsList = syncDocumentsList;
