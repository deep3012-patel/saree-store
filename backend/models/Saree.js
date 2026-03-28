const mongoose = require("mongoose");

const sareeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    material: {
      type: String,
    },
    color: {
      type: String,
    },
    stock: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    // ========== ADD THIS ==========
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        userName: { type: String },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    averageRating: { type: Number, default: 0 },
    // ==============================
  },
  { timestamps: true },
);

module.exports = mongoose.model("Saree", sareeSchema);
