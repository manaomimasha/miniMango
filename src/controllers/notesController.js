import { Note } from "../models/Note.js";
import {
  addNoteService,
  listNotesService,
  getNoteService,
  updateNoteService,
  deleteNoteService,
} from "../services/notesServices.js";

import {
  ensureDefaultCategories,
  listCategoriesService,
} from "../services/categoryService.js";

export const renderNotes = async (req, res) => {
  try {
    const { category } = req.query;

    // Aseguramos categorías base y traemos TODAS las categorías del usuario
    await ensureDefaultCategories(req.user.id);
    const categories = await listCategoriesService(req.user.id);

    const notesDocs = await listNotesService(req.user.id, { category });

    const normalize = (s) =>
      String(s || "all-notes")
        .toLowerCase()
        .trim();

    const catColor = {
      "all-notes": "#6c757d",
      "to do list": "#0dcaf0",
      work: "#ffc107",
      hobbies: "#2ecc71",
      personal: "#0d6efd",
      ideas: "#0dcaf0",
    };

    const catText = {
      "all-notes": "#ffffff",
      "to do list": "#111111",
      work: "#111111",
      hobbies: "#ffffff",
      personal: "#ffffff",
      ideas: "#111111",
    };

    const notes = notesDocs.map((note) => {
      const categoryName = note.category?.name || "all-notes";
      const key = normalize(categoryName);

      note.displayCategory = categoryName;
      note.categoryKey = key;
      note.categoryColor = catColor[key] || "#6c757d";
      note.categoryText = catText[key] || "#ffffff";
      return note;
    });

    res.render("notes/all-notes", {
      notes,
      notesCount: notes.length,
      categories, // 👈 ahora la vista tiene las categorías
      selectedCategory: category || "all-notes",
    });
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Error loading notes");
    res.redirect("/");
  }
};

export const renderNotesForm = async (req, res) => {
  try {
    await ensureDefaultCategories(req.user.id);
    const categories = await listCategoriesService(req.user.id);
    res.render("notes/new-notes", { categories }); // ✅
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Error loading form");
    res.redirect("/notes/all-notes");
  }
};

export const createNewNote = async (req, res) => {
  try {
    console.log("📥 Recibiendo request para crear nota:", req.body);
    console.log("👤 Usuario ID:", req.user?.id);

    // Si hay una categoría nueva, usarla; si no, usar la seleccionada
    const categoryToUse =
      req.body.newCategory?.trim() || req.body.category?.trim() || "all-notes";
    const noteData = {
      ...req.body,
      category: categoryToUse,
    };

    await addNoteService(noteData, req.user.id);
    req.flash("success_msg", "Note created successfully");
    res.redirect("/notes/all-notes");
  } catch (err) {
    console.error("❌ Error completo:", err);
    console.error("❌ Stack trace:", err.stack);
    req.flash("error_msg", err.message || "Something went wrong");
    res.redirect("/notes/add");
  }
};

// ✏️ FORMULARIO DE EDICIÓN
export const editNote = async (req, res) => {
  try {
    const note = await getNoteService(req.params.id, req.user.id);
    // ✅ getNoteService ya usa populate, así que note.category será un objeto

    await ensureDefaultCategories(req.user.id);
    const categories = await listCategoriesService(req.user.id);

    res.render("notes/form-edit-notes", { note, categories });
  } catch (err) {
    console.error(err);
    req.flash("error_msg", err.message || "Note not found");
    res.redirect("/notes/all-notes");
  }
};

// 💾 ACTUALIZAR NOTA
export const updateNote = async (req, res) => {
  try {
    await updateNoteService(req.params.id, req.user.id, req.body);
    req.flash("success_msg", "Note edited successfully");
    res.redirect("/notes/all-notes");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", err.message || "Error updating note");
    res.redirect("/notes/all-notes");
  }
};

// 🗑️ ELIMINAR NOTA
export const deleteNote = async (req, res) => {
  try {
    await deleteNoteService(req.params.id, req.user.id);
    req.flash("success_msg", "Note deleted successfully");
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ success: false, error: err.message });
  }
};
