const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.set("trust proxy", true);

app.use((req, res, next) => {
  if (req.headers["x-forwarded-proto"] === "https") {
    req.secure = true;
  }
  next();
});

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "upgrade-insecure-requests");
  next();
});
app.use(cors());
app.use(express.json());

// 🔥 CONNECT TO MONGODB (service name = mongodb)
mongoose.connect("mongodb://mongodb:27017/ecommerce")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// 🔥 SCHEMA
const CartSchema = new mongoose.Schema({
  productId: String,
  name: String,
  price: Number,
  quantity: Number
});

const Cart = mongoose.model("Cart", CartSchema);

// 🔥 GET CART
app.get("/api/cart", async (req, res) => {
  const items = await Cart.find();
  res.json(items);
});

// 🔥 ADD TO CART
app.post("/api/cart", async (req, res) => {
  const { productId, name, price } = req.body;

  let item = await Cart.findOne({ productId });

  if (item) {
    item.quantity += 1;
    await item.save();
  } else {
    await Cart.create({ productId, name, price, quantity: 1 });
  }

  res.json({ message: "Added to cart" });
});

// 🔥 DELETE ITEM
app.delete("/api/cart/:id", async (req, res) => {
  await Cart.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// ✅ HEALTH ENDPOINT (keep this)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// 🔥 ADD THESE TWO (CRITICAL FIX)
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

app.get("/api", (req, res) => {
  res.status(200).send("API OK");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
