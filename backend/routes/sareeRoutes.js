const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth"); // ← ADD THIS LINE
const {
  addSaree,
  getAllSarees,
  getSareeById,
  updateSaree,
  deleteSaree,
  searchSarees,
  filterByPrice,
  getByMaterial,
  getByCategory,
  updateStock,
  getStats,
  addReview, // ← Make sure this is included
  getRelatedProducts
} = require("../controllers/sareeController");

// ============ SPECIFIC ROUTES (NO :id) ============
router.post("/add", addSaree);
router.post("/bulk", addSaree); // If you have bulk endpoint
router.get("/all", getAllSarees);
router.get("/search", searchSarees);
router.get("/filter/price", filterByPrice);
router.get("/stats", getStats);

// ============ PARAMETER ROUTES (WITH :param) ============
router.get("/material/:material", getByMaterial);
router.get("/category/:category", getByCategory);

// ============ DYNAMIC ROUTES (WITH :id) ============
// Add this line - must come BEFORE /:id
router.get("/:id/related", getRelatedProducts);
router.get("/:id", getSareeById);
router.put("/:id", updateSaree);
router.delete("/:id", deleteSaree);
router.patch("/:id/stock", updateStock);
router.post("/:id/reviews", protect, addReview); // ← This now works with protect

module.exports = router;
