const Saree = require("../models/Saree");

// ==================== CREATE ====================
exports.addSaree = async (req, res) => {
  try {
    const saree = new Saree(req.body);
    const saved = await saree.save();
    res.status(201).json({
      success: true,
      message: "Saree added successfully!",
      data: saved,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== READ - ALL (with pagination) ====================
exports.getAllSarees = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "-createdAt" } = req.query;

    const sarees = await Saree.find()
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Saree.countDocuments();

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      count: sarees.length,
      data: sarees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== READ - ONE ====================
exports.getSareeById = async (req, res) => {
  try {
    const saree = await Saree.findById(req.params.id);
    if (!saree) {
      return res.status(404).json({
        success: false,
        message: "Saree not found",
      });
    }
    res.status(200).json({
      success: true,
      data: saree,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== UPDATE ====================
exports.updateSaree = async (req, res) => {
  try {
    const saree = await Saree.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!saree) {
      return res.status(404).json({
        success: false,
        message: "Saree not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Saree updated successfully!",
      data: saree,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== DELETE ====================
exports.deleteSaree = async (req, res) => {
  try {
    const saree = await Saree.findByIdAndDelete(req.params.id);
    if (!saree) {
      return res.status(404).json({
        success: false,
        message: "Saree not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Saree deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== SEARCH ====================
exports.searchSarees = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "Please provide a search keyword",
      });
    }

    const sarees = await Saree.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { material: { $regex: keyword, $options: "i" } },
        { color: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });

    res.status(200).json({
      success: true,
      count: sarees.length,
      data: sarees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== FILTER BY PRICE ====================
exports.filterByPrice = async (req, res) => {
  try {
    const { min, max } = req.query;

    let query = {};
    if (min) query.price = { $gte: parseInt(min) };
    if (max) query.price = { ...query.price, $lte: parseInt(max) };

    const sarees = await Saree.find(query).sort({ price: 1 });

    res.status(200).json({
      success: true,
      count: sarees.length,
      data: sarees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== FILTER BY MATERIAL ====================
exports.getByMaterial = async (req, res) => {
  try {
    const { material } = req.params;
    const sarees = await Saree.find({ material });

    res.status(200).json({
      success: true,
      count: sarees.length,
      data: sarees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== FILTER BY CATEGORY ====================
exports.getByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const sarees = await Saree.find({ category });

    res.status(200).json({
      success: true,
      count: sarees.length,
      data: sarees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== UPDATE STOCK ====================
exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const saree = await Saree.findByIdAndUpdate(
      id,
      { $inc: { stock: quantity } },
      { new: true },
    );

    if (!saree) {
      return res.status(404).json({
        success: false,
        message: "Saree not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Stock updated successfully!",
      data: saree,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== GET STATISTICS ====================
exports.getStats = async (req, res) => {
  try {
    const totalSarees = await Saree.countDocuments();
    const totalStock = await Saree.aggregate([
      { $group: { _id: null, total: { $sum: "$stock" } } },
    ]);
    const avgPrice = await Saree.aggregate([
      { $group: { _id: null, avg: { $avg: "$price" } } },
    ]);
    const byMaterial = await Saree.aggregate([
      { $group: { _id: "$material", count: { $sum: 1 } } },
    ]);
    const byCategory = await Saree.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const totalValue = await Saree.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$price", "$stock"] } },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalSarees,
        totalStock: totalStock[0]?.total || 0,
        averagePrice: Math.round(avgPrice[0]?.avg) || 0,
        totalInventoryValue: totalValue[0]?.total || 0,
        sareesByMaterial: byMaterial,
        sareesByCategory: byCategory,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== BULK CREATE ====================
exports.bulkAddSarees = async (req, res) => {
  try {
    const sarees = await Saree.insertMany(req.body);
    res.status(201).json({
      success: true,
      message: `${sarees.length} sarees added successfully!`,
      data: sarees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== ADD REVIEW ==========
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const saree = await Saree.findById(req.params.id);

    if (!saree) {
      return res
        .status(404)
        .json({ success: false, message: "Saree not found" });
    }

    // Check if user already reviewed
    const alreadyReviewed = saree.reviews.find(
      (r) => r.user.toString() === req.user.id,
    );

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ success: false, message: "You already reviewed this product" });
    }

    // Add review
    saree.reviews.push({
      user: req.user.id,
      userName: req.user.name,
      rating: Number(rating),
      comment,
    });

    // Calculate average rating
    saree.averageRating =
      saree.reviews.reduce((acc, item) => acc + item.rating, 0) /
      saree.reviews.length;

    await saree.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: saree,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========== GET RELATED PRODUCTS ==========
exports.getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;

    // Get current product
    const currentProduct = await Saree.findById(id);
    if (!currentProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find related products by same material or category
    const relatedProducts = await Saree.find({
      _id: { $ne: id }, // Exclude current product
      $or: [
        { material: currentProduct.material },
        { category: currentProduct.category },
      ],
    }).limit(4); // Get 4 related products

    res.status(200).json({
      success: true,
      count: relatedProducts.length,
      data: relatedProducts,
    });
  } catch (error) {
    console.error("Get related products error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
