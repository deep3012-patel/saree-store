const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: "./.env" }); // ← Make sure path is correct
const sareeRoutes = require("./routes/sareeRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Debug: Check if .env loaded
console.log(
  "MONGO_URL:",
  process.env.MONGO_URL ? "✅ Loaded" : "❌ Not loaded",
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error");
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("🪔 Powerloom Saree Store Backend Running");
});

app.use("/api/sarees", sareeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
