const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
    question: String,
    options: [{
        name: String,
        votes: Number
    }]
});

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
