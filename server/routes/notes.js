const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const NotesModel = require('../models/Notes');
const { body, validationResult } = require('express-validator');

router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await NotesModel.find({ user: req.user.id })
        res.json(notes)

    } catch (error) {
        console.error(error.message)
        res.status(500).send('INTERNAL SERVER ERROR');
    }
})

router.post('/addnote', fetchuser, [
    body('title', 'ENTER A VALID TITLE').isLength({ min: 3 }),
    body('description', 'DECSRIPTION MUST BE ATLEAST 5 CHARACTERS').isLength({ min: 5 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const notes = new NotesModel({
            title, description, tag, user: req.user.id
        })
        const savedNotes = await notes.save()
        res.json(savedNotes)

    } catch (error) {
        console.error(error.message)
        res.status(500).send('INTERNAL SERVER ERROR');
    }
})

router.put('/updatenote/:id', fetchuser, async (req, res) => {

    const { title, description, tag } = req.body;

    try {
        const newNote = {};
        if (title) {
            newNote.title = title;
        }
        if (description) {
            newNote.description = description;
        }
        if (tag) {
            newNote.tag = tag;
        }

        let notes = await NotesModel.findById(req.params.id);
        if (!notes) {
            res.status(404).send('NOT FOUND');
        }
        if (notes.user.toString() !== req.user.id) {
            return res.status(401).send('NOT ALLOWED');
        }

        notes = await NotesModel.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ notes })

    } catch (error) {
        console.error(error.message)
        res.status(500).send('INTERNAL SERVER ERROR');
    }
});

router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {
        let notes = await NotesModel.findById(req.params.id);
        if (!notes) {
            res.status(404).send('NOT FOUND');
        }
        if (notes.user.toString() !== req.user.id) {
            return res.status(401).send('NOT ALLOWED');
        }

        notes = await NotesModel.findByIdAndDelete(req.params.id)
        res.json({ 'SUCCESS': 'NOTE HAS BEEN DELETED', notes: notes })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('INTERNAL SERVER ERROR');
    }
});

module.exports = router;