const Attendance = require('../models/attendance');

exports.getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find();
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addAttendance = async (req, res) => {
  try {
    const { user, date, status } = req.body;
    const attendance = new Attendance({ user, date, status });
    await attendance.save();
    const io = req.app.get('socketio');
    
    io.emit('notification', { type: 'attendance', message: `Attendance marked: ${status}`, date });
    res.status(201).json({ message: 'Attendance recorded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
