const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    facebook_id: {
        type: String,
    },
    google_id: {
        type: String,
    },
    created_date: {
        type: Date,
        default: Date.now,
      }
});

const User = mongoose.model('User', userSchema, 'users');
module.exports = User;
