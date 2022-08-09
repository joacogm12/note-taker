const notes = require('express').Router()
const { parse } = require('path');
const { readFromFile, writeToFile, readAndAppend } = require('../helpers/fsUtils')
const uuid = require('../helpers/uuid');

//read de json file and get the data notes
notes.get('/', (req, res) => {
    console.info(`${req.method} request received for notes`)

    readFromFile('./db/db.json').then((data) => res.send(data))
})

//post method to push new notes into the json file
notes.post('/', (req, res) => {
    console.info(`${req.method} request received for notes`)

    //desctructure the note sent by the user
    const { title, text } = req.body;

    //if the title and text was received create a new object that appends to db.json
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

//delete a note 
notes.delete('/:id', (req, res) => {
    if (req.params.id) {

        let note_id = req.params.id

        readFromFile('./db/db.json').then((response) => {

            let data = JSON.parse(response)

            //check if the id is the same as one in the data to delete it 
            for (let i = 0; i < data.length; i++) {
                if (data[i].note_id === note_id) {
                    data.splice(i, 1);
                    break;
                }
            }

            writeToFile('./db/db.json', data);
        })
        res.send(`note deleted`);
    } else {
        res.json('Error in deleting note');
    }
})

module.exports = notes;