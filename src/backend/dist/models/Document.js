"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const SignerSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    type: { type: String, enum: ['signer', 'approver', 'cc'], required: true },
    order: { type: Number }
});
const DocumentVariableSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    value: { type: String, required: true },
    isSystem: { type: Boolean }
});
const DocumentSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    status: { type: String, enum: ['draft', 'waiting', 'completed', 'archived'], default: 'draft' },
    date: { type: Date, default: Date.now },
    signers: [SignerSchema],
    progress: { type: Number, default: 0 },
    dueDate: { type: String },
    createdBy: { type: String },
    signingOrder: { type: Boolean, default: false },
    uploadPath: { type: String },
    totalPages: { type: Number, default: 0 },
    canvasElements: { type: mongoose_1.Schema.Types.Mixed, default: [] },
    pageDimensions: { type: Map, of: new mongoose_1.Schema({ pageWidth: Number, pageHeight: Number }) },
    variables: [DocumentVariableSchema],
    documentType: { type: String, enum: ['upload-existing', 'new_document'], default: 'new_document' }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Document', DocumentSchema);
