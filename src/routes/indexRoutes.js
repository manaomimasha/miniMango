import { Router } from "express";
import { renderIndex } from "../controllers/indexController.js";

export const indexRouter = Router();

indexRouter.get("/", renderIndex);
