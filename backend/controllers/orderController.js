const Order = require("../models/order"); // ← FIXED: Capital O
const Saree = require("../models/Saree");

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount } = req.body;

    // Verify stock and update
    for (let item of items) {
      const product = await Saree.findById(item._id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.name} not found`,
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }
    }

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: items.map((item) => ({
        product: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        discount: item.discount,
      })),
      totalAmount,
      shippingAddress,
    });

    // Update stock
    for (let item of items) {
      await Saree.findByIdAndUpdate(item._id, {
        $inc: { stock: -item.quantity },
      });
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get User Orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order by id error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== UPDATE ORDER STATUS ==========
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = status;
    order.statusHistory.push({
      status: status,
      note: note || `Order status updated to ${status}`,
      updatedBy: req.user.id,
      updatedAt: new Date(),
    });

    if (status === "shipped") {
      order.trackingNumber = `TRK${Date.now()}${Math.floor(Math.random() * 1000)}`;
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 7);
      order.estimatedDelivery = deliveryDate;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== GET ORDER TRACKING INFO ==========
exports.getOrderTracking = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      order.user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        orderId: order._id,
        status: order.orderStatus,
        statusHistory: order.statusHistory,
        trackingNumber: order.trackingNumber,
        estimatedDelivery: order.estimatedDelivery,
        items: order.items,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("Get order tracking error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== ADMIN: GET ALL ORDERS ==========
exports.adminGetAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Admin get all orders error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== ADMIN: UPDATE ORDER STATUS ==========
exports.adminUpdateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    console.log("Admin updating order status:", { id, status });

    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = status;
    order.statusHistory.push({
      status: status,
      note: note || `Order status updated to ${status} by admin`,
      updatedBy: req.user.id,
      updatedAt: new Date(),
    });

    if (status === "shipped") {
      order.trackingNumber = `TRK${Date.now()}${Math.floor(Math.random() * 1000)}`;
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 7);
      order.estimatedDelivery = deliveryDate;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order,
    });
  } catch (error) {
    console.error("Admin update order status error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== ADMIN: GET DASHBOARD STATS ==========
exports.adminGetStats = async (req, res) => {
  try {
    // FIXED: Use the already imported Order model, not re-require
    const User = require("../models/User");
    const Saree = require("../models/Saree");

    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Saree.countDocuments();

    const revenue = await Order.aggregate([
      { $match: { orderStatus: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]);

    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalUsers,
        totalProducts,
        totalRevenue: revenue[0]?.total || 0,
        ordersByStatus,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
