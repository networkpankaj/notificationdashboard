const Leave = require('../models/leave');

exports.getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find();
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addLeave = async (req, res) => {
  try {
    const { user, message, latitude, longitude, location } = req.body;
    const leave = new Leave({ user, message, latitude, longitude, location });
    await leave.save();
    const io = req.app.get('socketio');
    
    io.emit('notification', { type: 'leave', message: leave.message, location: leave.location });
    res.status(201).json({ message: 'Leave request submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
