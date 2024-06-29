const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  user: { type: String, required: true },
  message: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  location: { type: String }
});

module.exports = mongoose.model('Leave', leaveSchema);
