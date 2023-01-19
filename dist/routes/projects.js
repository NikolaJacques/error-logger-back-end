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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminAuth_1 = require("../middleware/adminAuth");
const permissions_1 = require("../middleware/permissions");
const projectController = __importStar(require("../controllers/projects"));
const router = (0, express_1.Router)();
router.get('/:id', adminAuth_1.adminAuth, permissions_1.permissions, projectController.getProject);
router.post('/:id', adminAuth_1.adminAuth, permissions_1.permissions, projectController.createOrUpdateProject);
router.delete('/:id', adminAuth_1.adminAuth, permissions_1.permissions, projectController.deleteProject);
router.get('/', adminAuth_1.adminAuth, projectController.getProjects);
exports.default = router;
