import express from "express";
import userControllers from "../controllers/user-controllers.js";
import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Router Auth
router.get("/users", authMiddleware, adminOnly, userControllers.getAllUser);
router.get(
  "/users/:userId",
  authMiddleware,
  adminOnly,
  userControllers.getUserById
);
router.post("/users", authMiddleware, adminOnly, userControllers.createUser);
router.patch(
  "/users/:id",
  authMiddleware,
  adminOnly,
  userControllers.updateUser
);
router.delete(
  "/users/:id",
  authMiddleware,
  adminOnly,
  userControllers.deleteUser
);

export default router;
