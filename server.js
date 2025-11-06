import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import pkg from "pg";

dotenv.config();

const { Pool } = pkg;
const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL (Supabase)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Health
app.get("/health", async (req, res) => {
  try {
    const r = await pool.query("SELECT NOW()");
    res.json({ ok: true, time: r.rows[0].now });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Auth middleware
const auth = (roles = []) => (req, res, next) => {
  const hdr = req.headers.authorization || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
    if (roles.length && !roles.includes(payload.usertype)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Login
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "username and password required" });
  try {
    const result = await pool.query(
      "SELECT id, username, usertype, password FROM users WHERE username = $1",
      [username]
    );
    if (result.rowCount === 0) return res.status(401).json({ error: "Invalid credentials" });
    const user = result.rows[0];
    if (password !== user.password) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign(
      { id: user.id, username: user.username, usertype: user.usertype },
      process.env.JWT_SECRET || "devsecret",
      { expiresIn: "2h" }
    );
    res.json({ token, user: { id: user.id, username: user.username, usertype: user.usertype } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// Products
app.get("/api/products", auth(["ADMINISTRATOR", "EMPLOYEE"]), async (req, res) => {
  try {
    const r = await pool.query(
      "SELECT productcode, productname, sellprice, brand FROM products ORDER BY productname ASC"
    );
    res.json(r.rows);
  } catch (e) {
    console.error(e); res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/products", auth(["ADMINISTRATOR"]), async (req, res) => {
  const { productcode, productname, costprice, sellprice, brand } = req.body;
  try {
    await pool.query(
      "INSERT INTO products (productcode, productname, costprice, sellprice, brand) VALUES ($1,$2,$3,$4,$5)",
      [productcode, productname, costprice, sellprice, brand]
    );
    res.status(201).json({ ok: true });
  } catch (e) {
    console.error(e); res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/products/:productcode", auth(["ADMINISTRATOR"]), async (req, res) => {
  const { productcode } = req.params;
  const { productname, costprice, sellprice, brand } = req.body;
  try {
    await pool.query(
      "UPDATE products SET productname=$1, costprice=$2, sellprice=$3, brand=$4 WHERE productcode=$5",
      [productname, costprice, sellprice, brand, productcode]
    );
    res.json({ ok: true });
  } catch (e) {
    console.error(e); res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/products/:productcode", auth(["ADMINISTRATOR"]), async (req, res) => {
  const { productcode } = req.params;
  try {
    await pool.query("DELETE FROM products WHERE productcode=$1", [productcode]);
    res.json({ ok: true });
  } catch (e) {
    console.error(e); res.status(500).json({ error: "Server error" });
  }
});

// Dashboard
app.get("/api/dashboard/summary", auth(["ADMINISTRATOR", "EMPLOYEE"]), async (req, res) => {
  try {
    const a = await pool.query("SELECT COUNT(*) AS total_products FROM products");
    const b = await pool.query("SELECT COUNT(*) AS total_customers FROM customers");
    const c = await pool.query("SELECT COALESCE(SUM(revenue),0) AS total_revenue FROM salesinfo");
    const d = await pool.query("SELECT COALESCE(SUM(quantity),0) AS total_stock FROM currentstock");
    res.json({
      total_products: Number(a.rows[0].total_products),
      total_customers: Number(b.rows[0].total_customers),
      total_revenue: Number(c.rows[0].total_revenue),
      total_stock: Number(d.rows[0].total_stock),
    });
  } catch (e) {
    console.error(e); res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/dashboard/sales-by-product", auth(["ADMINISTRATOR", "EMPLOYEE"]), async (req, res) => {
  try {
    const r = await pool.query(
      "SELECT p.productname, SUM(s.quantity) AS qty, SUM(s.revenue) AS revenue FROM salesinfo s JOIN products p ON p.productcode = s.productcode GROUP BY p.productname ORDER BY revenue DESC"
    );
    res.json(r.rows);
  } catch (e) {
    console.error(e); res.status(500).json({ error: "Server error" });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`✅ API running on :${port}`));
