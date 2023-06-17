const mongoose = require('mongoose');

const modLog = new mongoose.Schema({
  Guild: String,
  Channel: String
})

module.exports = mongoose.model('ModLogs', modLog);