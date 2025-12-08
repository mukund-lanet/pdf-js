import * as contractManagementRoutes from "./routes/contractManagementRoutes";
import { McrServiceMeta } from "mcr-common/src/expresshelper_common/helper/McrServiceMeta";
import eventBus from "mcr-common/src/expresshelper_common/helper/EventBus";
import { Router } from "express";

const SERVICE_NAME = "mcr-contract-management-service";

export const initializeRoutes = (app: any, mcrServiceMeta?: McrServiceMeta) => {
  mcrServiceMeta && eventBus.emit(SERVICE_NAME + "_emit", mcrServiceMeta);
  const router = Router();

  // Contract Management - Documents
  router.get("/documents", contractManagementRoutes.getDocuments);
  router.get("/documents/:id", contractManagementRoutes.getDocumentById);
  router.post("/documents", contractManagementRoutes.createDocument);
  router.put("/documents/:id", contractManagementRoutes.updateDocument);
  router.delete("/documents/:id", contractManagementRoutes.deleteDocument);
  router.post("/documents/upload", contractManagementRoutes.uploadDocumentPdf);

  // Contract Management - Contracts
  router.get("/contracts", contractManagementRoutes.getContracts);
  router.get("/contracts/:id", contractManagementRoutes.getContractById);
  router.post("/contracts", contractManagementRoutes.createContract);
  router.put("/contracts/:id", contractManagementRoutes.updateContract);
  router.delete("/contracts/:id", contractManagementRoutes.deleteContract);

  // Contract Management - Settings
  router.get("/settings", contractManagementRoutes.getSettings);
  router.put("/settings", contractManagementRoutes.updateSettings);

  // Contract Management - State
  router.get("/contract-management", contractManagementRoutes.getContractManagementState);
  router.put("/contract-management", contractManagementRoutes.updateContractManagementState);
  router.post("/contract-management/sync", contractManagementRoutes.syncDocumentsList);

  const basePath = mcrServiceMeta ? "/" + SERVICE_NAME : "/";
  app.use(basePath, router);
};
