import { Category } from "../models/categoryModel.js";

const DEFAULTS = [
  { name: "all-notes", description: "Todas las notas" },
  { name: "work",      description: "Trabajo" },
  { name: "hobbies",   description: "Hobbies" },
];

// crea las 3 categorías por defecto si el usuario recién empieza
// export async function ensureDefaultCategories(userId) {
//   const count = await Category.countDocuments({ user: userId });
//   if (count > 0) return;
//   await Category.insertMany(DEFAULTS.map(d => ({ ...d, user: userId })));
// }
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// crea las 3 categorías por defecto si el usuario recién empieza

export async function ensureDefaultCategories(userId) {
  for (const def of DEFAULTS) {
    try {
      await Category.updateOne(
        { user: userId, name: def.name },
        { $setOnInsert: { description: def.description } },
        { upsert: true }
      );
    } catch (e) {
      if (e.code === 11000) continue; // ya existe, ignorar
      throw e;
    }
  }
}

// listar todas las categorías de un usuario
export async function listCategoriesService(userId) {
  return Category.find({ user: userId }).sort({ name: 1 }).lean();
}

// crear categoría personalizada
export async function createCategoryService(userId, data) {
  const { name, description = "" } = data;
  return Category.create({ user: userId, name: name.trim(), description });
}

// actualizar categoría (por id)
export async function updateCategoryService(userId, categoryId, data) {
  const cat = await Category.findOneAndUpdate(
    { _id: categoryId, user: userId },
    { $set: data },
    { new: true, runValidators: true }
  ).lean();

  if (!cat) {
    const err = new Error("Categoría no encontrada o sin permisos");
    err.status = 404;
    throw err;
  }

  return cat;
}

// eliminar categoría (por id)
export async function deleteCategoryService(userId, categoryId) {
  const cat = await Category.findOneAndDelete({ _id: categoryId, user: userId }).lean();
  if (!cat) {
    const err = new Error("Categoría no encontrada o sin permisos");
    err.status = 404;
    throw err;
  }
  return { ok: true };
}
