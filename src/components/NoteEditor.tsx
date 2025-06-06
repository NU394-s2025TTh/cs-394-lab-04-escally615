// REFERENCE SOLUTION - Do not distribute to students
// src/components/NoteEditor.tsx
import { doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import app from '../firebase-config';
// TODO: Import the saveNote function from your noteService call this to save the note to firebase
//import { saveNote } from '../services/noteService';
import { Note } from '../types/Note';

interface NoteEditorProps {
  initialNote?: Note;
  onSave?: (note: Note) => void;
}
// remove the eslint disable when you implement on save
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NoteEditor: React.FC<NoteEditorProps> = ({ initialNote, onSave }) => {
  // State for the current note being edited
  // remove the eslint disable when you implement the state
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [note, setNote] = useState<Note>(() => {
    return (
      initialNote || {
        id: uuidv4(),
        title: '',
        content: '',
        lastUpdated: Date.now(),
      }
    );
  });

  // TODO: create state for saving status
  // TODO: createState for error handling
  const [loading, setLoading] = useState(false);
  //const [editing, setEditing] = useState(false);
  //const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const db = getFirestore(app);

  // // TODO: Update local state when initialNote changes in a useEffect (if editing an existing note)
  // // This effect runs when the component mounts or when initialNote changes
  // // It sets the note state to the initialNote if provided, or resets to a new empty note, with a unique ID
  useEffect(() => {
    //setLoading(true);
    //setEditing(true);
    if (initialNote) {
      setNote(initialNote);
      //setEditing(false);
    } else {
      setNote({
        id: uuidv4(),
        title: '',
        content: '',
        lastUpdated: Date.now(),
      });
      //tEditing(false);
    }
  }, [initialNote]);

  //TODO: on form submit create a "handleSubmit" function that saves the note to Firebase and calls the onSave callback if provided
  // This function should also handle any errors that occur during saving and update the error state accordingly.

  const userRef = doc(db, 'notes', note.id);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const noteData = {
        title: note.title,
        content: note.content,
        lastUpdated: Date.now(),
      };
      const docSnapshot = await getDoc(userRef);
      if (docSnapshot.exists()) {
        await updateDoc(userRef, noteData);
      } else {
        await setDoc(userRef, { id: note.id, ...noteData });
      }

      if (onSave) {
        onSave({ ...note, ...noteData });
      }
    } catch (error) {
      console.error('Error saving note:', error);
      setError(`Error saving note: ${note.id}`);
    } finally {
      setLoading(false);
    }
  };

  // Change handler for form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  };

  return (
    <form className="note-editor" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={note.title}
          required
          placeholder="Enter note title"
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={note.content}
          rows={5}
          required
          placeholder="Enter note content"
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      {error && (
        <div className="error-message" style={{ color: 'red', marginBottom: '1em' }}>
          {error}
        </div>
      )}
      <div className="form-actions">
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Note'}
        </button>
      </div>
    </form>
  );
};

export default NoteEditor;
