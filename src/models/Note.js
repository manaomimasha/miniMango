import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    // category:{ type: String, trim: true },
    description: { type: String, required: true },
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// module.exports = mongoose.model("Note", noteSchema);
export const Note = mongoose.model("Note", noteSchema);
