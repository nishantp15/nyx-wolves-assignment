// models/Record.js
const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
});

module.exports = mongoose.model('Record', recordSchema);
