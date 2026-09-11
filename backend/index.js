require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("./generated/prisma");

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({ message: "API is running" });
});

app.get("/api/health", async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`;
    res.json({ status: "ok", dbTime: result[0].now });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: "name, email, and message are required" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res
      .status(400)
      .json({ error: "Please provide a valid email address" });
  }

  try {
    const lead = await prisma.leads.create({ data: { name, email, message } });
    res.status(201).json({ lead });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
