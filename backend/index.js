require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

const app = express();
const pool = new Pool();

app.use(session({
  store: new pgSession({ pool, tableName: "session" }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
}));

app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({ message: "API is running" });
});

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ status: "ok", dbTime: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
