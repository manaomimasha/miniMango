import jwt from "jsonwebtoken";
import { JWT_CONFIG } from "../config/jwt.js";

export const isAuthenticated = (req, res, next) => {
  // 1) buscar token en cookie (y opcionalmente en Authorization)
  const bearer = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;
  const token = req.cookies?.[JWT_CONFIG.name] || bearer;

  if (!token) {
    req.flash("error_msg", "Not Authorized.");
    return res.redirect("/user/login");
  }

  try {
    // 2) verificar
    const payload = jwt.verify(token, JWT_CONFIG.secret);
    // 3) dejar usuario en req (mismo contrato que esperabas con Passport)
    req.user = { id: payload.userId, email: payload.email };
    return next();
  } catch (e) {
    req.flash("error_msg", "Session expired or invalid token.");
    return res.redirect("/user/login");

    // return res.redirect("/user/login?error=not_authorized"); //aca ?
  }
};
