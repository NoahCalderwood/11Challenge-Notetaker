const express = require('express')
const app = express()
const path = require('path');
const fs = require('fs');
const { randomUUID } = require('crypto');
const PORT = process.env.port || 3001;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) =>
    res.json(JSON.parse(data))
  )
});

app.post('/api/notes', (req, res) => {
  console.log(req.body);
  const { title, text } = req.body;

  if (title && text) {

    const newNote = {
      title,
      text,
      note_id: randomUUID(),
    }

    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.err(err);
        return;
      } else {
        const parsedNotes = JSON.parse(data);

        parsedNotes.push(newNote);

        const noteString = JSON.stringify(parsedNotes);

        fs.writeFile(`./db/db.json`, noteString, (err) =>
          err
            ? console.error(err)
            : console.log(
              `Review for ${newNote.title} has been written to JSON file`
            )
        );
      }
    });

    const response = {
      status: "success",
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json("Error in posting review");
  }
})

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

app.listen(PORT, () =>
  console.log(`listening at http://localhost:${PORT}`)
);