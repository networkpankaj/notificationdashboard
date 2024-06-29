const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, required: true }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
