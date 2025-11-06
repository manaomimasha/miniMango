import { Router } from "express";
import { isAuthenticated } from "../helpers/isAuthJWT.js";
import {
  create,
  list,
  update,
  remove,
  getById,
} from "../controllers/categoryController.js";

export const categoryRouter = Router();

categoryRouter.get("/notes/new-category", isAuthenticated, list);
categoryRouter.get("/api/categories/:id", isAuthenticated, getById);
categoryRouter.get("/notes/edit-category/:id", isAuthenticated, getById);

categoryRouter.post("/notes/new-category", isAuthenticated, create);

categoryRouter.put("/notes/new-category/:id", isAuthenticated, update);
categoryRouter.put("/api/categories/:id", isAuthenticated, update);

categoryRouter.delete("/notes/delete-category/:id", isAuthenticated, remove);
categoryRouter.delete("/api/categories/:id", isAuthenticated, remove);
