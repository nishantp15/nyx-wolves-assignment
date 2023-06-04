// routes/records.js
const express = require('express');
const router = express.Router();
const Record = require('../models/Record');
const multer = require('multer');
const path = require('path');
// const upload = multer({ dest: './uploads/' });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// GET all records
router.get('/', async (req, res) => {
  try {
    const records = await Record.find();
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/:id', getRecord, (req, res) => {
  res.json(res.record);
});

// CREATE a new record
router.post('/', upload.array('image',2), async (req, res) => {
  const { title, description } = req.body;
  let imageData=[];
  const images = req.files.map((file) =>({data:file.filename, contentType:"image/jpg"}));
  // const images = req.file.filename;
  const record = new Record({
    title,
    description,
    images
  });


  try {
    const newRecord = await record.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// UPDATE a record
router.patch('/:id', getRecord, async (req, res) => {
  if (req.body.title != null) {
    res.record.title = req.body.title;
  }
  if (req.body.description != null) {
    res.record.description = req.body.description;
  }
  try {
    const updatedRecord = await res.record.save();
    res.json(updatedRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a record
router.delete('/:id', getRecord, async (req, res) => {
  try {
    await res.record.remove();
    res.json({ message: 'Record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware to get a single record by ID
async function getRecord(req, res, next) {
  let record;
  try {
    record = await Record.findById(req.params.id);
    if (record == null) {
      return res.status(404).json({ message: 'Record not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.record = record;
  next();
}

module.exports = router;
