const mongoose = require('mongoose');

const translationHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'voice', 'video', 'document', 'camera_ocr', 'chat'],
    required: true
  },
  sourceLanguage: {
    type: String,
    required: true
  },
  targetLanguage: {
    type: String,
    required: true
  },
  originalText: {
    type: String
  },
  translatedText: {
    type: String
  },
  fileUrl: {
    type: String // For uploaded files
  },
  audioUrl: {
    type: String // For generated audio
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TranslationHistory', translationHistorySchema);