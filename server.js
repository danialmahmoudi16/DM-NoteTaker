// Brings in express from node.js
const express = require('express');

// brings in node.js fs module
const fs = require('fs');

// allows to extract contents from module.exports
const path = require('path');

// brings in uuid method to make unique id for each note input
const uuid = require('uuid');

// tells server to listen to the specific port 3001
const PORT = process.env.PORT || 3001;

// creates express application
const app = express();

// middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(express.static('public'));

// reads the db.json file and returns note as JSON string
app.get('/api/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './db/db.json')) 
);

// returns notes.html file
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);


app.post('/aoi/notes', (req, res) => {
    let input = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'))
    const note = {
        title: req.body.title,
        text: req.body.text,
        id: uuid(),
    };
    input.push(note)
    fs.writeFile('./db/db.json', JSON.stringify(input))

    res.json(input)
});

app.delete('/api/notes:id', (req, res) => {
    const input = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'))

    const deletednotes = input.filter( note => note.id.toString() !== req.params.id.toString());

    fs.writeFile('./db/db.json', JSON.stringify(input))

    res.json(input)
    
})

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html')),
);

app.listen(PORT, () =>
    console.log(`Listening at http://localhost:${PORT}`),
)

