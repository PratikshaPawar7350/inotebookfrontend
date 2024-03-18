import NoteContext from "./NoteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000"
 
  const [notes, setNotes] = useState([])

  // Get all Notes
  const getNotes = async () => {
    // API Call 
    try{
    const response = await fetch(`${host}/api/notes/fetchnotes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem("token"),    }
    });
    const json = await response.json();
    console.log('Fetched notes:', json);
    setNotes(json);
  } catch (error) {
    console.error('Error fetching notes:', error);
  }
}
  

  // Add a Note
  const addNote = async (title, description, tag) => {
    // TODO: API Call
    // API Call 
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem("token")  },
      body: JSON.stringify({title, description, tag})
    });
    const note = await response.json();
    setNotes(prevNotes => {
      if (!Array.isArray(prevNotes)) {
        return [note];
      }
      return [...prevNotes, note];
    });
  };
  // Delete a Note
  const deleteNote = async (id) => {
    // API Call
    try {
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem("token")   }
    });
    if (response.ok) {
      console.log('Note deleted successfully');
      const newNotes = notes.filter((note) => note._id !== id);
      setNotes(newNotes);
  } else {
      console.error('Failed to delete note');
  }
} catch (error) {
  console.error('Error deleting note:', error);
}
};
  

  // Edit a Note
  const editNote = async (id, title, description, tag) => {
    // API Call 
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem("token")    },
      body: JSON.stringify({ title, description, tag }),
  });
  //const json = await response.json();

  // Logic to edit in client
  setNotes(prevNotes =>
    prevNotes.map(note => {
      if (note._id === id) {
        return { ...note, title, description, tag };
      }
      return note;
    })
  );
};

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  )

}
export default NoteState;