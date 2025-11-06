// src/controllers/categoryController.js
import {
  createCategoryService,
  listCategoriesService,
  updateCategoryService,
  deleteCategoryService,
  getCategoryService,
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

// GET: obtener una categoría por ID
// export async function getById(req, res) {
//   try {
//     const category = await getCategoryService(req.user.id, req.params.id);

//     const isForm = req.headers["accept"]?.includes("text/html");

//     if (isForm) {
//       return res.render("notes/new-category", { category, editMode: true });
//     }

//     return res.status(200).json({ ok: true, data: category });
//   } catch (e) {
//     return res.status(e.status || 500).json({ error: e.message });
//   }
// }

// GET: obtener una categoría por ID
export async function getById(req, res) {
  try {
    const category = await getCategoryService(req.user.id, req.params.id);
    const categories = await listCategoriesService(req.user.id);
    
    const isForm = req.headers["accept"]?.includes("text/html");
    
    if (isForm) {
      return res.render("notes/new-category", { 
        category, 
        categories,
        editMode: true 
      });
    }
    
    return res.status(200).json({ ok: true, data: category });
  } catch (e) {
    return res.status(e.status || 500).json({ error: e.message });
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
      return res.redirect(302, "/notes/all-notes"); // 🔁 redirige al listado
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
// ... existing code ...

// PUT: actualizar categoría
export async function update(req, res) {
  try {
    const category = await updateCategoryService(
      req.user.id,
      req.params.id,
      req.body
    );

    // Detectar si el request vino de un formulario HTML
    const isForm = req.headers["content-type"]?.includes(
      "application/x-www-form-urlencoded"
    );

    if (isForm) {
      req.flash("success_msg", "Categoría actualizada");
      return res.redirect("/notes/all-notes");
    }

    // Si vino desde Postman o fetch → devuelve JSON
    return res.status(200).json({
      ok: true,
      message: "Categoría actualizada correctamente",
      data: category,
    });
  } catch (e) {
    const isForm = req.headers["content-type"]?.includes(
      "application/x-www-form-urlencoded"
    );

    if (isForm) {
      req.flash("error_msg", e.message);
      return res.redirect(302, "/notes/new-category");
    }

    return res.status(e.status || 500).json({ error: e.message });
  }
}

// DELETE: eliminar categoría
export async function remove(req, res) {
  try {
    await deleteCategoryService(req.user.id, req.params.id);

    // Detectar si el request vino de un formulario HTML
    const isForm = req.headers["content-type"]?.includes(
      "application/x-www-form-urlencoded"
    );

    if (isForm) {
      req.flash("success_msg", "Categoría eliminada");
      return res.redirect("/notes/new-category");
    }

    // Si vino desde Postman o fetch → devuelve JSON
    return res.status(200).json({
      ok: true,
      message: "Categoría eliminada correctamente",
    });
  } catch (e) {
    const isForm = req.headers["content-type"]?.includes(
      "application/x-www-form-urlencoded"
    );

    if (isForm) {
      req.flash("error_msg", e.message);
      return res.redirect(302, "/notes/new-category");
      // res.redirect(302, "/notes/all-notes");
    }

    return res.status(e.status || 500).json({ error: e.message });
  }
}
