// REFERENCE SOLUTION - Do not distribute to students
// src/services/noteService.ts
// TODO: Import functions like setDoc, deleteDoc, onSnapshot from Firebase Firestore to interact with the database

import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  QuerySnapshot,
  setDoc,
  Unsubscribe,
} from 'firebase/firestore';

import { db } from '../firebase-config';
// TODO: Import the Firestore instance from your Firebase configuration file
// import { db } from '../firebase-config';
import { Note, Notes } from '../types/Note';
// remove when you use the collection in the code
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NOTES_COLLECTION = 'notes';

/**
 * Creates or updates a note in Firestore
 * @param note Note object to save
 * @returns Promise that resolves when the note is saved
 */
// remove when you implement the function
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function saveNote(note: Note): Promise<void> {
  // TODO: save the note to Firestore in the NOTES_COLLECTION collection
  // Use setDoc to create or update the note document; throw an error if it fails
  try {
    const noteRef = doc(db, NOTES_COLLECTION, note.id);
    await setDoc(noteRef, note);
  } catch (error) {
    console.error('Failed to save note:', error);
    throw error;
  }
}

/**
 * Deletes a note from Firestore
 * @param noteId ID of the note to delete
 * @returns Promise that resolves when the note is deleted
 */
// remove when you implement the function
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function deleteNote(noteId: string): Promise<void> {
  // TODO: delete the note from Firestore in the NOTES_COLLECTION collection
  // Use deleteDoc to remove the note document; throw an error if it fails
  try {
    const noteRef = doc(db, NOTES_COLLECTION, noteId);
    await deleteDoc(noteRef);
  } catch (error) {
    console.error('Failed to delete note:', error);
    throw error;
  }
}

/**
 * Transforms a Firestore snapshot into a Notes object
 * @param snapshot Firestore query snapshot
 * @returns Notes object with note ID as keys
 */
export function transformSnapshot(snapshot: QuerySnapshot<DocumentData>): Notes {
  const notes: Notes = {};

  snapshot.docs.forEach((doc) => {
    const noteData = doc.data() as Note;
    notes[doc.id] = noteData;
  });

  return notes;
}

/**
 * Subscribes to changes in the notes collection
 * @param onNotesChange Callback function to be called when notes change
 * @param onError Optional error handler for testing
 * @returns Unsubscribe function to stop listening for changes
 */

export function subscribeToNotes(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onNotesChange: (notes: Notes) => void,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onError?: (error: Error) => void,
): Unsubscribe {
  // TODO: subscribe to the notes collection in Firestore
  // Use onSnapshot to listen for changes; call onNotesChange with the transformed notes
  // Handle errors by calling onError if provided
  // Return s proper (not empty) unsubscribe function to stop listening for changes
  const collectionRef = collection(db, NOTES_COLLECTION);
  const unsubscribe = onSnapshot(
    collectionRef,
    (snapshot) => {
      const notes = transformSnapshot(snapshot);
      onNotesChange(notes);
    },
    (error) => {
      console.error('Error:', error);
      if (onError) onError(error);
    },
  );

  return unsubscribe;
}
