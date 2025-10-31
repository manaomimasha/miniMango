// src/controllers/categoryController.js
import {
  createCategoryService,
  listCategoriesService,
  updateCategoryService,
  deleteCategoryService,
} from "../services/categoryService.js";

// GET: formulario + listado (opcional)
export async function list(req, res) {
  try {
    const categories = await listCategoriesService(req.user.id);
    res.render("notes/new-category", { categories }); // ← pasar categories a la vista
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
}

// POST: crear y redirigir a all-notes
// export async function create(req, res) {
//   try {
//     await createCategoryService(req.user.id, req.body);
//     req.flash("success_msg", "Categoría creada correctamente");
//     res.redirect("/notes/all-notes"); // ← redirección pedida
//   } catch (e) {
//     req.flash("error_msg", e.message);
//     res.redirect("/notes/new-category"); // volver al form si falla
//   }
// }

// POST: crear y redirigir a all-notes
export async function create(req, res) {
  try {
    await createCategoryService(req.user.id, req.body);

    // Detectar si el request vino de un formulario HTML
    const isForm = req.headers["content-type"]?.includes(
      "application/x-www-form-urlencoded"
    );

    if (isForm) {
      req.flash("success_msg", "Categoría creada correctamente");
      return res.redirect("/notes/all-notes"); // 🔁 redirige al listado
    }

    // Si vino desde Postman o fetch → devuelve JSON
    return res
      .status(201)
      .json({ ok: true, message: "Categoría creada correctamente" });
  } catch (e) {
    const isForm = req.headers["content-type"]?.includes(
      "application/x-www-form-urlencoded"
    );

    if (isForm) {
      req.flash("error_msg", e.message);
      return res.redirect("/notes/all-notes");
    }

    return res.status(e.status || 500).json({ error: e.message });
  }
}

// PUT: actualizar y redirigir (si querés mismo comportamiento)
export async function update(req, res) {
  try {
    await updateCategoryService(req.user.id, req.params.id, req.body);
    req.flash("success_msg", "Categoría actualizada");
    res.redirect("/notes/all-notes");
  } catch (e) {
    req.flash("error_msg", e.message);
    res.redirect("/notes/new-category");
  }
}

// DELETE: eliminar y redirigir
export async function remove(req, res) {
  try {
    await deleteCategoryService(req.user.id, req.params.id);
    req.flash("success_msg", "Categoría eliminada");
    res.redirect("/notes/new-category");
  } catch (e) {
    req.flash("error_msg", e.message);
    res.redirect("/notes/new-category");
  }
}
