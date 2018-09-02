const mongoose = require('mongoose');
const { Schema } = mongoose;

const noteSchema = new Schema({
    todo_item: {
        type: String,
        required: true,
    },
    deadline: {
        type: Date,
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    created_date: {
        type: Date,
        default: Date.now,
    }
});

const Note = mongoose.model('Note', noteSchema, 'notes');
module.exports = Note;