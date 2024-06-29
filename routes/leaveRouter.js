const express = require('express');
const leaveController = require('../controllers/leaveController');

const router = express.Router();
router
  .route('/')
  .get(leaveController.getLeaves)
  .post(leaveController.addLeave);

module.exports = router;
