// REFERENCE SOLUTION - Do not distribute to students
// src/components/NoteEditor.tsx

import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// TODO: Import the saveNote function from your noteService call this to save the note to firebase
import { saveNote } from '../services/noteService';
//import { saveNote } from '../services/noteService';
import { Note } from '../types/Note';

interface NoteEditorProps {
  initialNote?: Note;
  onSave?: (note: Note) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ initialNote, onSave }) => {
  // State for the current note being edited

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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    if (!note.title || !note.content) {
      setError('Need both title and content to save note.');
      setSaving(false);
      return;
    }
    try {
      await saveNote(note);

      if (onSave) {
        onSave(note);
      }

      if (!initialNote) {
        setNote({
          id: uuidv4(),
          title: '',
          content: '',
          lastUpdated: Date.now(),
        });
      }
    } catch (error) {
      console.error('Error saving note:', error);
      setError(`error: ${error}`);
    } finally {
      setSaving(false);
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
          disabled={saving}
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
          disabled={saving}
        />
      </div>
      {error && (
        <div className="error-message" style={{ color: 'red', marginBottom: '1em' }}>
          {error}
        </div>
      )}
      <div className="form-actions">
        <button type="submit" disabled={saving}>
          {initialNote ? 'Update Note' : 'Save Note'}
        </button>
      </div>
    </form>
  );
};

export default NoteEditor;
