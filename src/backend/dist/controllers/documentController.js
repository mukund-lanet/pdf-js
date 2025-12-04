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
exports.uploadDocumentPdf = exports.deleteDocument = exports.updateDocument = exports.createDocument = exports.getDocumentById = exports.getDocuments = void 0;
const Document_1 = __importDefault(require("../models/Document"));
const getDocuments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const documents = yield Document_1.default.find();
        res.status(200).json(documents);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getDocuments = getDocuments;
const getDocumentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const document = yield Document_1.default.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.status(200).json(document);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getDocumentById = getDocumentById;
const createDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newDocument = new Document_1.default(req.body);
        const savedDocument = yield newDocument.save();
        res.status(201).json(savedDocument);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createDocument = createDocument;
const updateDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedDocument = yield Document_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDocument) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.status(200).json(updatedDocument);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.updateDocument = updateDocument;
const deleteDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedDocument = yield Document_1.default.findByIdAndDelete(req.params.id);
        if (!deletedDocument) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.status(200).json({ message: 'Document deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteDocument = deleteDocument;
const uploadDocumentPdf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // We expect the client to upload to Firebase first and send us the URL/Path
        const { documentName, signers, uploadPath } = req.body;
        if (!uploadPath) {
            return res.status(400).json({ message: 'No upload path provided' });
        }
        const newDocument = new Document_1.default({
            name: documentName || 'Untitled Document',
            uploadPath: uploadPath,
            documentType: 'upload-existing',
            signers: signers ? (typeof signers === 'string' ? JSON.parse(signers) : signers) : [],
            status: 'draft'
        });
        const savedDocument = yield newDocument.save();
        res.status(201).json(savedDocument);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.uploadDocumentPdf = uploadDocumentPdf;
