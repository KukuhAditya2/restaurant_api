import express from "express";
import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";
import {
  getProduct,
  getProductById,
  createProduct,
  updateProduct,
  deletedProduct
} from "../controllers/product-controllers.js";
import {
  orderProducts,
  paid,
  getAllOrder,
  getOrderById,
  updatedOrder,
  deletedOrderProduct,
  addNewProductsOrders,
  deletedOrder
} from "../controllers/order-Product-controllers.js";
import {
  createPayment,
  getPayment,
  getPaymentById,
  updatedPayment,
  deletedPayment
} from "../controllers/payment-controllers.js";

const productRouter = express.Router();

// Products
productRouter.get("/products", authMiddleware, getProduct);
productRouter.get("/products/:productId", authMiddleware, getProductById);
productRouter.post("/products", authMiddleware, createProduct);
productRouter.put("/products/:productId", authMiddleware, updateProduct);
productRouter.delete("/products/:productId", authMiddleware, deletedProduct);

// Payment
productRouter.post("/payment", authMiddleware, adminOnly, createPayment);
productRouter.get("/payment", authMiddleware, getPayment);
productRouter.get("/payment/:paymentId", authMiddleware, getPaymentById);
productRouter.patch(
  "/payment/:paymentId",
  authMiddleware,
  adminOnly,
  updatedPayment
);
productRouter.delete(
  "/payment/:paymentId",
  authMiddleware,
  adminOnly,
  deletedPayment
);

// Detail Orders
productRouter.post("/order", authMiddleware, orderProducts);
productRouter.patch("/order/:orderId", authMiddleware, paid);
productRouter.get("/order", authMiddleware, getAllOrder);
productRouter.get("/order/:orderId", authMiddleware, getOrderById);
productRouter.put("/order/:orderId", authMiddleware, updatedOrder);
productRouter.delete("/order/:orderId", authMiddleware, deletedOrderProduct);
productRouter.post("/order/:orderId", authMiddleware, addNewProductsOrders);
productRouter.delete("/orders/:orderId", authMiddleware, deletedOrder);

export default productRouter;
