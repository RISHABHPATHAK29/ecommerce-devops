const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Dummy data
let products = [
  { id: 1, name: "Laptop", price: 50000 },
  { id: 2, name: "Phone", price: 20000 },
  { id: 3, name: "Shoes", price: 3000 },
  { id: 4, name: "Watch", price: 5000 }
];

let orders = [];

// APIs
app.get("/api/products", (req, res) => {
  res.json(products);
});

app.post("/api/order", (req, res) => {
  orders.push(req.body);
  res.json({ message: "Order placed successfully" });
});

app.get("/api/orders", (req, res) => {
  res.json(orders);
});

// Health check (important for AKS)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.listen(3000, () => {
  console.log("Backend running on port 3000");
});