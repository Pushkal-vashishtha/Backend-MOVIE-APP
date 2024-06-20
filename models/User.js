const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false, // Default value is false for regular users
    },
    mylist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    }],
});

// Add passport-local-mongoose plugin to handle user authentication
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;