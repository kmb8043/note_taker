const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../helpers/utilis');



notes.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
  });


notes.get('/:note_id', (req, res) => {
    const noteId = req.params.note_id;
    readFromFile('./db/notes.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        const result = json.filter((tip) => note.note_id === noteId);
        return result.length > 0
          ? res.json(result)
          : res.json('No note with that ID');
      });
  });


notes.delete('/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const updatedNotes = json.filter((note) => note.id !== noteId);
      if (json.length === updatedNotes.length) {
        res.status(404).json({ error: `Note with ID ${noteId} not found` });
        return;
      }
      writeToFile('./db/db.json', updatedNotes);
      res.json({ message: `Item ${noteId} has been deleted 🗑️` });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

notes.post('/', (req, res) => {
  const { title, text } = req.body;

  if (!title || !text) {
    res.status(400).json({ error: 'Title and text are required' });
    return;
  }

  const newNote = {
    id: uuidv4(),
    title,
    text,
  };

  readAndAppend(newNote, './db/db.json')
    .then(() => {
      res.status(201).json({ message: 'Successfully added a new note 📝', note: newNote });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

module.exports = notes;
