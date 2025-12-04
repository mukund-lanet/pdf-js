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
exports.updateSettings = exports.getSettings = void 0;
const Settings_1 = __importDefault(require("../models/Settings"));
const getSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let settings = yield Settings_1.default.findOne();
        if (!settings) {
            // Create default settings if none exist
            settings = yield Settings_1.default.create({});
        }
        res.status(200).json(settings);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getSettings = getSettings;
const updateSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = yield Settings_1.default.findOneAndUpdate({}, req.body, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
        });
        res.status(200).json(settings);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.updateSettings = updateSettings;
