// Brings in express from node.js
const express = require('express');

// brings in node.js fs module
const fs = require('fs');

// allows to extract contents from module.exports
const path = require('path');

// brings in uuid method to make unique id for each note input
const uuid = require('uuid');

// tells server to listen to the specific port 3001
const PORT = process.nextTick.PORT || 3001;

// creates express application
const app = express;

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

