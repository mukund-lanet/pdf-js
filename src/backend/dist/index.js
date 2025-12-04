"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_1 = __importDefault(require("./config/db"));
const documentRoutes_1 = __importDefault(require("./routes/documentRoutes"));
const contractRoutes_1 = __importDefault(require("./routes/contractRoutes"));
const settingsRoutes_1 = __importDefault(require("./routes/settingsRoutes"));
const contractManagementRoutes_1 = __importDefault(require("./routes/contractManagementRoutes"));
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true }));
app.use('/api/documents', documentRoutes_1.default);
app.use('/api/contracts', contractRoutes_1.default);
app.use('/api/settings', settingsRoutes_1.default);
app.use('/api/contract-management', contractManagementRoutes_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
