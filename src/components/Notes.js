import React, { useContext, useEffect, useRef, useState } from 'react';
import noteContext from "../context/NoteContext";
import Noteitem from './Noteitem';
import { useNavigate } from 'react-router-dom';
import AddNote from './AddNote';

const Notes = (props) => {
    const context = useContext(noteContext);
    const navigate = useNavigate(); 
    const { notes, getNotes, editNote } = context;
    useEffect(() => {
        // Check if token is present in localStorage
        if (localStorage.getItem("token")) {
            getNotes();
        } else {
            // If token is not present, redirect to login page
            navigate("/login");
        }
    }, [navigate]); // Add navigate as a dependency to useEffect


    const ref = useRef(null)
    const refClose = useRef(null)

    // Initialize state with default values or empty strings
    const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "" })

    const updateNote = (currentNote) => {
        ref.current.click();
        setNote({
            id: currentNote._id,
            etitle: currentNote.title || "", // Ensure etitle is not undefined
            edescription: currentNote.description || "", // Ensure edescription is not undefined
            etag: currentNote.tag || "" // Ensure etag is not undefined
        })
        props.showAlert("succesfully updated", "success");
    }

    const handleClick = (e) => {
        editNote(note.id, note.etitle, note.edescription, note.etag)
        refClose.current.click();
    }

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }

    return (
        <>
            <AddNote showAlert={props.showAlert}/>
            <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body" style={{ backgroundColor: '#d8dfe1', minHeight: 'fit-content' }}>
                            <form className="my-3">
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" name="etitle" value={note.etitle} aria-describedby="emailHelp" onChange={onChange} minLength={5} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={onChange} minLength={5} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={onChange} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button disabled={!note.etitle || !note.edescription || note.etitle.length < 5 || note.edescription.length < 5} onClick={handleClick} type="button" className="btn btn-primary">Update Note</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row my-3">
                <h2>Your Notes</h2>
                <div className="container mx-2">
                    {notes && notes.length === 0 && 'No notes to display'}
                </div>
                {notes && notes.map((note) => {
                    return <Noteitem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note} />
                })}
            </div>
        </>
    )
}

export default Notes;
