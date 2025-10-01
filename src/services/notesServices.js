import { Note } from "../models/Note.js";

const addNoteService = async (noteContent, uniqueId) => {
  const { title, description } = noteContent;
  const newNote = new Note({ title, description });
  newNote.user = uniqueId;
  await newNote.save();
};

export { addNoteService };
