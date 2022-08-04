const notes = require('express').Router()
const { parse } = require('path');
const { readFromFile, writeToFile, readAndAppend } = require('../helpers/fsUtils')
const uuid = require('../helpers/uuid');

notes.get('/', (req, res) => {
    console.info(`${req.method} request received for notes`)

    readFromFile('./db/db.json').then((data) => res.send(data))
})

notes.post('/', (req, res) => {
    console.info(`${req.method} request received for notes`)

    const { title, text } = req.body;

    if (title && text) {

        const newNote = {
            title,
            text,
            note_id: uuid(),
        }

        readAndAppend(newNote, './db/db.json');

        const response = {
            status: 'success',
            body: newNote,
        };

        res.json(response);
    } else {
        res.json('Error in posting notes');
    }
})

notes.delete('/:id', (req, res) => {
    if (req.params.id) {

        let note_id = req.params.id

        readFromFile('./db/db.json').then((response) => {

            let data = JSON.parse(response)
            let delNote = []
            for (let i = 0; i < data.length; i++) {
                if (data[i].note_id === note_id) {
                    delNote = data[i];
                    data.splice(i, 1);
                    console.log('se elimino');
                    break;
                }
            }

            writeToFile('./db/db.json', data);
        })
    } else {
        res.json('Error in deleting note');
    }
})

module.exports = notes;