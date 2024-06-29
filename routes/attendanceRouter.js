const express = require('express');
const attendanceController = require('../controllers/attendanceController');

const router = express.Router();
router
  .route('/')
  .get(attendanceController.getAttendance)
  .post(attendanceController.addAttendance);

module.exports = router;
