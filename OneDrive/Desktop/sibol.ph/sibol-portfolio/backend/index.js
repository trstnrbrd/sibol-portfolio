require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const app = express();
const pool = new Pool();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const result = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [email],
        );
        const user = result.rows[0];
        if (!user)
          return done(null, false, { message: "Incorrect email or password" });

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match)
          return done(null, false, { message: "Incorrect email or password" });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
      },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const byGoogleId = await pool.query(
          "SELECT * FROM users WHERE google_id = $1",
          [profile.id],
        );
        if (byGoogleId.rows.length > 0) {
          return done(null, byGoogleId.rows[0]);
        }

        const email = profile.emails[0].value;
        const byEmail = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [email],
        );
        if (byEmail.rows.length > 0) {
          const linked = await pool.query(
            "UPDATE users SET google_id = $1 WHERE id = $2 RETURNING *",
            [profile.id, byEmail.rows[0].id],
          );
          return done(null, linked.rows[0]);
        }

        const created = await pool.query(
          "INSERT INTO users (name, email, google_id) VALUES ($1, $2, $3) RETURNING *",
          [profile.displayName, email, profile.id],
        );
        return done(null, created.rows[0]);
      } catch (err) {
        return done(err);
      }
    },
  ),
);
}

app.use(
  session({
    store: new pgSession({ pool, tableName: "session" }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());
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

function requireAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not logged in" });
  }
  next();
}

app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "name, email, and password are required" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res
      .status(400)
      .json({ error: "Please provide a valid email address" });
  }
  if (!/^(?=.*[A-Z])(?=.*[0-9]).{8,16}$/.test(password)) {
    return res
      .status(400)
      .json({
        error:
          "Password must be 8-16 characters with at least one uppercase letter and one number",
      });
  }

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, passwordHash],
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.status(401).json({ error: info?.message || "Login failed" });

    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json({ user: { id: user.id, name: user.name, email: user.email } });
    });
  })(req, res, next);
});

app.get("/api/me", requireAuth, (req, res) => {
  res.json({
    user: { id: req.user.id, name: req.user.name, email: req.user.email },
  });
});

app.post("/api/connect", requireAuth, (req, res) => {
  res.json({ message: "Thanks for reaching out! We'll be in touch soon." });
});

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "name, email, and message are required" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Please provide a valid email address" });
  }

  try {
    await pool.query(
      "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)",
      [name, email, message]
    );
    res.status(201).json({ message: "Message received! We'll get back to you soon." });
  } catch (err) {
    if (err.code === "42P01") {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS contacts (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
      await pool.query(
        "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)",
        [name, email, message]
      );
      res.status(201).json({ message: "Message received! We'll get back to you soon." });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

app.post("/api/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: "Logged out successfully" });
  });
});

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";

const CHAT_SYSTEM_PROMPT = `You are "Sibol" (Sibol.ph), a friendly AI assistant for a Philippine web development agency.

About the agency:
- Sibol.ph is a full-stack web development agency helping businesses grow online.
- Services offered:
  1. Web Design - modern designs that capture brand identity
  2. Full-Stack Development - React, Node.js, PostgreSQL
  3. E-Commerce - custom online stores with payments and inventory
  4. SEO & Performance - search engine optimization, fast load times
  5. Mobile Apps - cross-platform React Native apps
  6. Maintenance & Support - ongoing updates and monitoring
- Consultations are booked for free on Calendly.
- Clients can send a message through the contact section for any questions.
- They have delivered 50+ projects, 30+ happy clients, 5+ years of experience.
- Trusted by major Philippine brands.

YOUR PRIMARY GOAL - COLLECT THE VISITOR'S EMAIL (LEAD GENERATION):
- As soon as it feels natural, politely ask for the visitor's email/Gmail. Keep the ask to ONE short sentence, one time.
- Example asks: "Before we continue, could you drop your email so our team can follow up?" or "Mind sharing your Gmail so I can send you details?"
- Do NOT repeat the ask in every reply. If they don't share it, answer their questions normally and only gently re-ask occasionally.
- If the visitor already shared their email, DO NOT ask again. Say a brief "Got it, thanks!" and move on.

How to respond:
- Be warm, friendly, and concise. Use short sentences.
- Always match your reply length to the question - never inflate it.
- Simple/yes-no questions: answer in 1-2 short sentences.
- General questions (services, pricing, process): 2-4 short sentences (about 40-70 words), no fluff, no filler.
- Detail-heavy questions: only give more if the visitor explicitly asks for details.
- If the visitor wants to book, suggest scheduling a free consultation on Calendly.
- Do NOT invent prices or clients that are not listed above.
- Never end with generic filler like "Let me know if you have other questions!"`;

app.post("/api/chat", async (req, res) => {
  const { messages, leadCaptured } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({
      code: "NO_API_KEY",
      error:
        "Chat is not configured yet. Add your Gemini API key to backend/.env (GEMINI_API_KEY=...) to enable the assistant.",
    });
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  const recent = messages.slice(-12).map((m) => ({ ...m }));

  if (!leadCaptured) {
    const lastUserIndex = recent.map((m) => m.role).lastIndexOf("user");
    if (lastUserIndex !== -1) {
      const reminder =
        "\n\n[Lead reminder - do NOT include this in your reply] The visitor has NOT shared their email yet. Answer their question first, then politely ask them for their email/Gmail so the team can follow up.";
      recent[lastUserIndex] = {
        ...recent[lastUserIndex],
        content: recent[lastUserIndex].content + reminder,
      };
    }
  }

  try {
    const response = await fetch(
      `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: CHAT_SYSTEM_PROMPT }],
          },
          contents: recent.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          })),
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      const message = data?.error?.message || "Gemini API error";
      return res.status(502).json({ error: message });
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";

    res.json({
      message: text,
      model: data?.modelVersion || GEMINI_MODEL,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/chat/lead", async (req, res) => {
  const { name, email, transcript } = req.body;
  if (!name || !email) {
    return res
      .status(400)
      .json({ error: "name and email are required" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res
      .status(400)
      .json({ error: "Please provide a valid email address" });
  }

  const message =
    transcript && transcript.length > 0
      ? `[chatbot lead] Interested visitor. Last messages:\n${transcript
          .slice(-6)
          .map((m) => `${m.role === "assistant" ? "Bot" : "Visitor"}: ${m.content}`)
          .join("\n")}`
      : "[chatbot lead] Interested visitor.";

  const leadsFile = path.join(__dirname, "leads.json");

  const saveLeadToFile = () => {
    const leads = fs.existsSync(leadsFile)
      ? JSON.parse(fs.readFileSync(leadsFile, "utf8"))
      : [];
    leads.push({
      captured_at: new Date().toISOString(),
      name,
      email,
      message,
    });
    fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));
  };

  try {
    await pool.query(
      "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)",
      [name, email, message]
    );
    res.status(201).json({ message: "Lead saved! Our team will follow up soon." });
  } catch (err) {
    if (err.code === "42P01") {
      try {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS contacts (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `);
        await pool.query(
          "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)",
          [name, email, message]
        );
        return res
          .status(201)
          .json({ message: "Lead saved! Our team will follow up soon." });
      } catch (err2) {
        return saveFileFallback(res, err2);
      }
    } else {
      return saveFileFallback(res, err);
    }
  }

  function saveFileFallback(res, dbErr) {
    try {
      saveLeadToFile();
      return res
        .status(201)
        .json({
          message: "Lead saved! Our team will follow up soon.",
          stored: "file",
          dbError: dbErr.message,
        });
    } catch (fileErr) {
      return res.status(500).json({
        error: `Database error (${dbErr.message}) and file fallback failed (${fileErr.message})`,
      });
    }
  }
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/me" }),
  (req, res) => {
    res.redirect("/api/me");
  },
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
