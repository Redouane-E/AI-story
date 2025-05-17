import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import { pool } from "./db";
import cryptoRandomString from "crypto-random-string";

// Session management
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    pool: pool,
    createTableIfMissing: true,
    tableName: "sessions",
  });
  
  return session({
    secret: process.env.SESSION_SECRET || cryptoRandomString({length: 32, type: 'base64'}),
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: sessionTtl,
    },
  });
}

// Mock authentication implementation (to be replaced with actual Replit Auth)
export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Serialize and deserialize user
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  // Simple login endpoint for development
  app.get('/api/login', (req, res) => {
    // Create a mock user for demonstration
    const mockUser = {
      id: "12345",
      email: "user@example.com",
      firstName: "Demo",
      lastName: "User",
      profileImageUrl: null
    };
    
    req.login(mockUser, async (err) => {
      if (err) {
        return res.status(500).json({ error: "Login failed" });
      }
      
      // Create or update the user in our database
      await storage.upsertUser({
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        profileImageUrl: mockUser.profileImageUrl
      });
      
      return res.redirect('/');
    });
  });

  // Auth user endpoint to get current user
  app.get('/api/auth/user', isAuthenticated, async (req, res) => {
    res.json(req.user);
  });

  // Logout endpoint
  app.get('/api/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
      }
      res.redirect('/');
    });
  });
}

// Middleware to check if user is authenticated
export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};