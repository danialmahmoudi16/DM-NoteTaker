// Brings in express from node.js
const express = require('express');

// brings in node.js fs module
const fs = require('fs');

// allows to extract contents from module.exports
const path = require('path');

// brings in uuid method to make unique id for each note input
const { v4: uuidv4 } = require('uuid');

// tells server to listen to the specific port 3001
const PORT = process.env.PORT || 3001;

// creates express application
const app = express();

// middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// returns index.html file
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html')),
);

// returns notes.html file
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// reads the db.json file and returns note as JSON string
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (error, input) => {
        if (error) {
            console.log(error)
        } else {
            const newNotes = JSON.parse(input);
            return res.status(200).json(newNotes)
        }
    })
});




app.post('/api/notes', (req, res) => {

    const { title, text } = req.body
    const note = {
        title,
        text,
        id: uuidv4(),
    };
    fs.readFile('./db/db.json', 'utf8', (error, input) => {
        if (error) {
            console.log(error);
        } else {
            const parseNote = JSON.parse(input);

            parseNote.push(note);

            fs.writeFile('./db/db.json', JSON.stringify(parseNote, null, 1), (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.info("Notes have been updated!")
                    res.json(note)
                }

            });
        }
    })
});







app.delete('/api/notes:id', (req, res) => {
    const erasenote = req.params.id;

    fs.readFile(__dirname + './db/db.json', "utf8").then((error, input) => {
        if (error) {
            console.log(error);
        } else {
            let noteinv = JSON.parse(input);

            for (let i = 0; i < noteinv.length; i++) {
                if (noteinv[i].id === erasenote) {
                    noteinv.splice(i, 1)
                }
            }
            fs.writeFile('./db/db.json', JSON.stringify(noteinv), (error, input) => {
                if (error) {
                    return error
                }
                console.log(noteinv)
                res.json(noteinv);
            })

        }
    })
})


app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html')),
);

app.listen(PORT, () =>
    console.log(`Listening at http://localhost:${PORT}`),
)

