require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcryptjs");

const app = express();
const pool = new Pool();

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

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const byGoogleId = await pool.query("SELECT * FROM users WHERE google_id = $1", [profile.id]);
      if (byGoogleId.rows.length > 0) {
        return done(null, byGoogleId.rows[0]);
      }

      const email = profile.emails[0].value;
      const byEmail = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      if (byEmail.rows.length > 0) {
        const linked = await pool.query(
          "UPDATE users SET google_id = $1 WHERE id = $2 RETURNING *",
          [profile.id, byEmail.rows[0].id]
        );
        return done(null, linked.rows[0]);
      }

      const created = await pool.query(
        "INSERT INTO users (name, email, google_id) VALUES ($1, $2, $3) RETURNING *",
        [profile.displayName, email, profile.id]
      );
      return done(null, created.rows[0]);
    } catch (err) {
      return done(err);
    }
  }
));

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

app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email, and password are required" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Please provide a valid email address" });
  }
  if (!/^(?=.*[A-Z])(?=.*[0-9]).{8,16}$/.test(password)) {
    return res.status(400).json({ error: "Password must be 8-16 characters with at least one uppercase letter and one number" });
  }

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, passwordHash]
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info?.message || "Login failed" });

    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json({ user: { id: user.id, name: user.name, email: user.email } });
    });
  })(req, res, next);
});

app.get("/api/me", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not logged in" });
  }
  res.json({ user: { id: req.user.id, name: req.user.name, email: req.user.email } });
});

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/me" }),
  (req, res) => {
    res.redirect("/api/me");
  }
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
