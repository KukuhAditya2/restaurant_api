import express from "express";
import {
  createCategory,
  getCategory,
  getCategoryById,
  updatedCategory,
  deletedCategory
} from "../controllers/category-controllers.js";
import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";

const routCategory = express.Router();

routCategory.post("/categories", authMiddleware, adminOnly, createCategory);
routCategory.patch(
  "/categories/:categoryId",
  authMiddleware,
  adminOnly,
  updatedCategory
);
routCategory.delete(
  "/categories/:categoryId",
  authMiddleware,
  adminOnly,
  deletedCategory
);
routCategory.get("/categories", authMiddleware, getCategory);
routCategory.get("/categories/:categoryId", authMiddleware, getCategoryById);

export default routCategory;
