import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import { JWT_CONFIG } from "../config/jwt.js";



function signUserToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), email: user.email },
    JWT_CONFIG.secret,
    { expiresIn: JWT_CONFIG.expiresIn }
  );
}

export async function registerUser({
  name,
  email,
  password,
  password_confirm,
}) {
  const errors = [];
  if (!name || !email || !password) {
    errors.push("Missing required fields");
  }
  if (password !== password_confirm) errors.push("Passwords do not match");
  if (password?.length < 4)
    errors.push("Password must be at least 4 characters");
  if (errors.length) {
    const err = new Error(errors.join(" | "));
    err.status = 400;
    throw err;
  }

  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error("Email already in use");
    err.status = 409;
    throw err;
  }

  const newUser = new User({ name, email, password });
  await newUser.save();

  return { id: newUser._id, name: newUser.name, email: newUser.email };
}

export async function loginUser({ email, password }) {
  if (!email || !password) {
    const err = new Error("Email and password are required");
    err.status = 400;
    throw err;
  }

  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const err = new Error("Incorrect password");
    err.status = 401;
    throw err;
  }

  const token = signUserToken(user);
  return {
    token,
    user: { id: user._id, name: user.name, email: user.email },
  };
}

export async function getUserProfile(userId) {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }
  return { id: user._id, name: user.name, email: user.email };
}
