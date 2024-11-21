const express = require('express');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const upload = require('../middleware/multerConfig');

const router = express.Router();

// MongoDB connection
let gfs;
mongoose.connection.once('open', () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('videos');
});

// Upload video
router.post('/upload', upload.single('video'), (req, res) => {
  if (!req.file || !req.body.rollNumber) {
    return res.status(400).json({ error: 'File and roll number are required' });
  }
  res.json({ id: req.file.id, rollNumber: req.body.rollNumber });
});

// Fetch video by ID
router.get('/video/:id', async (req, res) => {
  try {
    const file = await gfs.files.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
    if (!file) return res.status(404).json({ error: 'File not found' });

    res.set('Content-Type', file.contentType);
    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
  } catch (err) {
    res.status(500).json({ error: 'Invalid file ID or server error' });
  }
});

// Fetch video by roll number
router.get('/video/roll/:rollNumber', async (req, res) => {
  try {
    const file = await gfs.files.findOne({ 'metadata.rollNumber': req.params.rollNumber });
    if (!file) return res.status(404).json({ error: 'File not found for this roll number' });

    res.set('Content-Type', file.contentType);
    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;
