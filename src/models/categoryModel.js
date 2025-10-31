import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  user:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

// Una categoría con el mismo nombre puede repetirse en distintos usuarios,
// pero no duplicarse dentro del mismo usuario.
CategorySchema.index({ user: 1, name: 1 }, { unique: true });

export const Category = mongoose.model("Category", CategorySchema);
