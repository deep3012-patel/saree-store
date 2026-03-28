const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrderTracking,
  adminGetAllOrders,
  adminUpdateOrderStatus,
  adminGetStats,
} = require("../controllers/orderController");
const { protect } = require("../middleware/auth");
const { admin } = require("../middleware/admin");

// User routes
router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.get("/:id/tracking", protect, getOrderTracking);

// Admin routes
router.get("/admin/orders", protect, admin, adminGetAllOrders);
router.put("/admin/orders/:id/status", protect, admin, adminUpdateOrderStatus);
router.get("/admin/stats", protect, admin, adminGetStats);

module.exports = router;
