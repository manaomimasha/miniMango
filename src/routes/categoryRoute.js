import { Router } from "express";
import { isAuthenticated } from "../helpers/isAuthJWT.js";
import {
  create,
  list,
  update,
  remove,
} from "../controllers/categoryController.js";

export const categoryRouter = Router();

categoryRouter.get("/notes/new-category", isAuthenticated, list);
categoryRouter.post("/notes/new-category", isAuthenticated, create);
categoryRouter.put("/notes/new-category/:id", isAuthenticated, update);
categoryRouter.delete("/notes/delete-category/:id", isAuthenticated, remove);

// export default categoryRouter;
