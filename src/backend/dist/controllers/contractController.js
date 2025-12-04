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
exports.deleteContract = exports.updateContract = exports.createContract = exports.getContractById = exports.getContracts = void 0;
const Contract_1 = __importDefault(require("../models/Contract"));
const getContracts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contracts = yield Contract_1.default.find();
        res.status(200).json(contracts);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getContracts = getContracts;
const getContractById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contract = yield Contract_1.default.findById(req.params.id);
        if (!contract) {
            return res.status(404).json({ message: 'Contract not found' });
        }
        res.status(200).json(contract);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getContractById = getContractById;
const createContract = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newContract = new Contract_1.default(req.body);
        const savedContract = yield newContract.save();
        res.status(201).json(savedContract);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createContract = createContract;
const updateContract = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedContract = yield Contract_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedContract) {
            return res.status(404).json({ message: 'Contract not found' });
        }
        res.status(200).json(updatedContract);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.updateContract = updateContract;
const deleteContract = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedContract = yield Contract_1.default.findByIdAndDelete(req.params.id);
        if (!deletedContract) {
            return res.status(404).json({ message: 'Contract not found' });
        }
        res.status(200).json({ message: 'Contract deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteContract = deleteContract;
