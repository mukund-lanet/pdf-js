"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const documentController_1 = require("../controllers/documentController");
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
router.get('/', documentController_1.getDocuments);
router.get('/:id', documentController_1.getDocumentById);
router.post('/', documentController_1.createDocument);
router.put('/:id', documentController_1.updateDocument);
router.delete('/:id', documentController_1.deleteDocument);
router.post('/upload', upload.single('file'), documentController_1.uploadDocumentPdf);
exports.default = router;
