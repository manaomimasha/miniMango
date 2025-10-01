import { Note } from "../models/Note.js";
import { addNoteService } from "../services/notesServices.js";

const renderNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user.id });
  res.render("notes/all-notes", { notes });
};

const renderNotesForm = (req, res) => {
  res.render("notes/new-notes");
};

const createNewNote = async (req, res) => {
   try{
    await addNoteService(req.body, req.user.id);
  req.flash("success_msg", "Note created successfully");
  res.redirect("/notes/all-notes");
  }
  catch{(err)=>{
    console.log(err)
    req.flash("error_msg", "Something went wrong");
    res.redirect("/notes/new-notes");
  
  }}
  //el req.body va al servicio:

  //los errores se manejan adentro del catch
};

const editNote = async (req, res) => {
  const { id } = req.params;
  const note = await Note.findById(id);
  res.render("notes/form-edit-notes", { note });
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    await Note.findByIdAndUpdate(id, { title, description });

    req.flash("success_msg", "Note edited successully");
    res.json({ success: true, message: "Nota editada" });
    // res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteNote = async (req, res) => {
  // console.log(req.params.id);
  // const idOfNote = req.params.id;
  // await Note.findByIdAndDelete(req.params.id);

  try {
    const { id } = req.params;
    await Note.findByIdAndDelete(id);

    req.flash("success_msg", "Note deleted successully");
    res.json({ success: true, message: "Nota eliminada" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export {
  createNewNote,
  renderNotes,
  updateNote,
  deleteNote,
  editNote,
  renderNotesForm,
};
