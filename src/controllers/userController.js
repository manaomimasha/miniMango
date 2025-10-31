import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../services/userService.js";
import { JWT_CONFIG } from "../config/jwt.js";

export const renderProfile = async (req, res) => {
  try {
    const user = await getUserProfile(req.user.id);
    res.render("user/profileUser", { user });
  } catch (error) {
    console.error(error);
    req.flash("error_msg", error.message || "Error loading profile");
    res.redirect("/");
  }
};

export const logIn = async (req, res) => {
  try {
    const { token, user } = await loginUser(req.body);
    res.cookie(JWT_CONFIG.name, token, JWT_CONFIG.cookie);
    req.flash("success_msg", `Welcome ${user.name}!`);
    return res.redirect("/notes/all-notes");
  } catch (err) {
    console.error("❌ Login error:", err);
    req.flash("error_msg", err.message || "Login error");
    return res.redirect("/user/login");
  }
};

export const register = async (req, res) => {
  try {
    await registerUser(req.body);
    req.flash("success_msg", "Registration successful! You can now login.");
    return res.redirect("/user/login");
  } catch (error) {
    console.error("❌ Register error:", error);
    const { name, email } = req.body;
    return res.render("user/register", {
      errors: [{ text: error.message }],
      name,
      email,
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie(JWT_CONFIG.name, { path: "/" });
  req.flash("success_msg", "You are logged out");
  res.redirect("/");
};

export function renderLogIn(req, res) {
  res.render("user/login", {
    // ← CAMBIAR AQUÍ
    success_msg: req.flash?.("success_msg"),
    error_msg: req.flash?.("error_msg"),
  });
}

// Línea 63: Cambiar "users/register" a "user/register"
export function renderRegister(req, res) {
  res.render("user/register", {
    // ← CAMBIAR AQUÍ
    success_msg: req.flash?.("success_msg"),
    error_msg: req.flash?.("error_msg"),
  });
}
