// routes/records.js
const express = require('express');
const router = express.Router();
const Record = require('../models/Record');
const multer = require('multer');
const path = require('path');
const upload = multer({ dest: 'uploads/' });



// GET all records
router.get('/', async (req, res) => {
  try {
    const records = await Record.find();
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create record
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const { title, description } = req.body;

    const record = new Record({
      title,
      description,
      images: req.files.map((file) => file.filename),
    });

    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
