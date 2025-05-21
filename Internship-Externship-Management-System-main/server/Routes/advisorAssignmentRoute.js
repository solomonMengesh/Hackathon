const express = require('express');
const router = express.Router();
const { getAllAdvisorAssignments } = require('../Controllers/advisorAssignmentController');

// GET all assignments
router.get('/all', getAllAdvisorAssignments);

module.exports = router;
