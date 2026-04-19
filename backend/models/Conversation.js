const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  responseTime: {
    type: Number
  }
});

module.exports = mongoose.model('Conversation', conversationSchema);
