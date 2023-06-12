const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    Guild: String,
    User: String,
    Invites: Number,
    Total: Number,
    Left: Number,
    Rejoin: Number,
    Fake: Number,
    JoinedUsers: {
        type: Array,
        default: []
    },
});

module.exports = mongoose.model("invites", Schema);