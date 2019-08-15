const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    content: {
        type: String
    }
});

module.exports = mongoose.model('Task', taskSchema);