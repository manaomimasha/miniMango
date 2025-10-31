// api/index.js
import 'dotenv/config';
import app from "../src/server.js";
import { db } from "../src/database.js";
import mongoose from "mongoose";

// Vercel necesita exportar un handler
export default async function handler(req, res) {
  // Conectar DB si no está conectada
  try {
    if (mongoose.connection.readyState === 0) {
      await db;
    }
  } catch (error) {
    console.error('DB connection error:', error);
  }
  
  // Pasar el request a Express
  return app(req, res);
}