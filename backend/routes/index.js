const express = require('express');
const router = express.Router();
const {
    getAllAssignments,
    getAssignmentById,
    executeSql,
    getHint
} = require('../controllers/assignmentController');

router.get('/assignments', getAllAssignments);
router.get('/assignments/:id', getAssignmentById);
router.post('/execute', executeSql);
router.post('/hint', getHint);

module.exports = router;
