const Journal = require('../models/Journal');


const createJournal = async (req, res) => {
    try {
        const { topicName, description, studyDuration, difficultyLevel } = req.body;

        if (!topicName || !description || !studyDuration || !difficultyLevel) {
            return res.status(400).json({ message: 'All fields required' });
        }

        const journal = await Journal.create({
            user: req.user._id,
            topicName,
            description,
            studyDuration,
            difficultyLevel
        });

        res.status(201).json(journal);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getAllJournals = async (req, res) => {
    try {
        const { search, difficulty, date } = req.query;

        let query = { user: req.user._id };

        
        if (search) {
            query.topicName = { $regex: search, $options: 'i' };
        }

       
        if (difficulty) {
            query.difficultyLevel = difficulty;
        }

        
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            query.createdAt = { $gte: startDate, $lt: endDate };
        }

        const journals = await Journal.find(query).sort({ createdAt: -1 });

        res.json(journals);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getSingleJournal = async (req, res) => {
    try {
        const journal = await Journal.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!journal) {
            return res.status(404).json({ message: 'Journal not found' });
        }

        res.json(journal);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateJournal = async (req, res) => {
    try {
        const journal = await Journal.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!journal) {
            return res.status(404).json({ message: 'Journal not found' });
        }

        journal.topicName = req.body.topicName || journal.topicName;
        journal.description = req.body.description || journal.description;
        journal.studyDuration = req.body.studyDuration || journal.studyDuration;
        journal.difficultyLevel = req.body.difficultyLevel || journal.difficultyLevel;

        const updatedJournal = await journal.save();

        res.json(updatedJournal);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const deleteJournal = async (req, res) => {
    try {
        const journal = await Journal.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!journal) {
            return res.status(404).json({ message: 'Journal not found' });
        }

        await journal.deleteOne();

        res.json({ message: 'Journal deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createJournal,
    getAllJournals,
    getSingleJournal,
    updateJournal,
    deleteJournal
};