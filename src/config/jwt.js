import "dotenv/config";

export const JWT_CONFIG = {
  name: "token", // nombre de la cookie
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES || "7d",
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    path: "/",
  },
};

console.log("🔍 DEBUG JWT Config:");
console.log("- process.env.JWT_SECRET:", process.env.JWT_SECRET);
console.log(
  "- process.env.JWT_SECRET length:",
  process.env.JWT_SECRET ? process.env.JWT_SECRET.length : "undefined"
);

console.log(
  "🔍 JWT_CONFIG.secret:",
  JWT_CONFIG.secret ? "✅ Configurado" : "❌ No configurado"
);
