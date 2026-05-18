const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    topicName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    studyDuration: {
        type: Number,
        required: true
    },
    difficultyLevel: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Journal', journalSchema);