const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

const {
    createJournal,
    getAllJournals,
    getSingleJournal,
    updateJournal,
    deleteJournal
} = require('../controllers/journalController');

router.post('/', protect, createJournal);
router.get('/', protect, getAllJournals);
router.get('/:id', protect, getSingleJournal);
router.put('/:id', protect, updateJournal);
router.delete('/:id', protect, deleteJournal);

module.exports = router;