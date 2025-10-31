import { Note } from "../models/Note.js";
import { Category } from "../models/categoryModel.js";


function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


export async function addNoteService(noteContent, userId) {
  const { title, description, category } = noteContent;
  if (!userId) throw new Error("Usuario no autenticado");

  const categoryName = (category || "all-notes").trim();

  console.log("🔍 Buscando categoría:", categoryName, "para usuario:", userId);

  // Buscar la categoría por nombre (case-insensitive)
  let categoryDoc = await Category.findOne({
    user: userId,
    name: { $regex: new RegExp(`^${escapeRegex(categoryName)}$`, "i") },
  });

  // Si no existe, crearla
  if (!categoryDoc) {
    console.log("➕ Creando nueva categoría:", categoryName);
    categoryDoc = await Category.create({
      user: userId,
      name: categoryName,
      description: "",
    });
  }

  // Crear la nota
  const savedNote = await Note.create({
    title,
    description,
    user: userId,
    category: categoryDoc._id,
  });

  console.log("✅ Nota creada exitosamente:", savedNote._id);
  return savedNote;
}



export async function listNotesService(userId, { category } = {}) {
  const q = { user: userId };

  if (category) {
    if (typeof category === "string") {
      // match exacto, pero case-insensitive
      const cat = await Category.findOne({
        user: userId,
        name: { $regex: new RegExp(`^${escapeRegex(category.trim())}$`, "i") },
      });
      if (cat) q.category = cat._id;
      // si no existe, q se queda sin categoría -> lista 0 notas (esperable si filtrás una inexistente)
    } else {
      q.category = category;
    }
  }

  return Note.find(q).populate("category", "name description").lean();
}

export async function getNoteService(idDeLaNota, userId) {
  // ✅ Usar populate también aquí
  const note = await Note.findOne({ _id: idDeLaNota, user: userId })
    .populate("category", "name description")
    .lean();

  if (!note) {
    const err = new Error("Nota no encontrada o no tienes permisos");
    err.status = 404;
    throw err;
  }
  return note;
}


export async function updateNoteService(idDeLaNota, userId, contenidoDeLaNota) {
    const { title, description, category, newCategory } = contenidoDeLaNota;
  
    // Priorizar nueva categoría si existe
    const categoryToUse = newCategory?.trim() || category?.trim();
    
    if (!categoryToUse) {
      throw new Error("Debe proporcionar una categoría");
    }
  
    // Buscar o crear la categoría
    let categoryDoc = await Category.findOne({
      user: userId,
      name: { $regex: new RegExp(`^${escapeRegex(categoryToUse)}$`, "i") },
    });
  
    // Si no existe, crearla
    if (!categoryDoc) {
      try {
        categoryDoc = await Category.create({
          user: userId,
          name: categoryToUse,
          description: "",
        });
      } catch (error) {
        throw new Error(`Error al crear la categoría: ${error.message}`);
      }
    }
  
    // ✅ Actualizar la nota
    const note = await Note.findOneAndUpdate(
      { _id: idDeLaNota, user: userId },
      { title, description, category: categoryDoc._id },
      { new: true, runValidators: true }
    )
      .populate("category", "name description")
      .lean();
  
    if (!note) {
      const err = new Error("Nota no encontrada o no tienes permisos");
      err.status = 404;
      throw err;
    }
    return note;
  }

export async function deleteNoteService(idDeLaNota, userId) {
  const deleted = await Note.findOneAndDelete({
    _id: idDeLaNota,
    user: userId,
  });
  if (!deleted) {
    const err = new Error("Nota no encontrada o no tienes permisos");
    err.status = 404;
    throw err;
  }
  return { ok: true };
}
