import { Router } from "express";
import {
  createNewNote,
  renderNotes,
  updateNote,
  deleteNote,
  editNote,
  renderNotesForm,
} from "../controllers/notesController.js";
import { isAuthenticated } from "../helpers/isAuthJWT.js";
export const notesRouter = Router();

//list all notes
notesRouter.get("/notes/all-notes", isAuthenticated, renderNotes);

//create note
notesRouter.get("/notes/add", isAuthenticated, renderNotesForm);

//en donde isAuth va a ir el mw de token de sesion
notesRouter.post("/notes/add", isAuthenticated, createNewNote);

//edit note
notesRouter.get("/notes/edit/:id", isAuthenticated, editNote);
notesRouter.put("/notes/update/:id", isAuthenticated, updateNote);

//delete note
notesRouter.delete("/notes/delete/:id", isAuthenticated, deleteNote);

// notesRouter.get("/notes/add", isAuthenticated, renderNotesForm);
// notesRouter.post("/notes/add", isAuthenticated, createNewNote);
