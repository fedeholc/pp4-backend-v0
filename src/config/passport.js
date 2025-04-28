import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import pool from "./db.js";
import dotenv from "dotenv";
import process from "node:process";

dotenv.config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || "secret",
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const [rows] = await pool.query("SELECT * FROM Usuario WHERE id = ?", [
        jwt_payload.id,
      ]);
      if (rows[0]) {
        return done(null, rows[0]);
      }
      return done(null, false);
    } catch (err) {
      console.error("Error during JWT authentication:", err);
      return done(err, false);
    }
  })
);

export default passport;
