const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { translate } = require('google-translate-api-x');
const { Configuration, OpenAIApi } = require('openai');
// const { ElevenLabsAPI } = require('elevenlabs');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(require('ffmpeg-static'));
const { createWorker } = require('tesseract.js');
const TranslationHistory = require('../models/TranslationHistory');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp3|wav|mp4|avi|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Initialize APIs
const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);
// const elevenlabs = new ElevenLabsAPI({ apiKey: process.env.ELEVENLABS_API_KEY });

// Text translation
router.post('/text', auth, async (req, res) => {
  try {
    const sourceLanguage = req.body.sourceLanguage || req.body.sourceLang;
    const targetLanguage = req.body.targetLanguage || req.body.targetLang;
    const { text } = req.body;

    const result = await translate(text, { from: sourceLanguage, to: targetLanguage });

    const history = new TranslationHistory({
      user: req.user._id,
      type: 'text',
      sourceLanguage,
      targetLanguage,
      originalText: text,
      translatedText: result.text
    });
    await history.save();

    res.json({ translatedText: result.text, historyId: history._id });
  } catch (error) {
    res.status(500).json({ message: 'Translation failed', error: error.message });
  }
});

// Voice translation
router.post('/voice', auth, upload.single('audio'), async (req, res) => {
  try {
    const sourceLanguage = req.body.sourceLanguage || req.body.sourceLang;
    const targetLanguage = req.body.targetLanguage || req.body.targetLang;
    const audioFile = req.file;

    // Transcribe audio using OpenAI Whisper
    const transcriptionResp = await openai.createTranscription(
      fs.createReadStream(audioFile.path),
      'whisper-1',
      undefined,
      undefined,
      undefined,
      sourceLanguage
    );
    const transcriptionText = transcriptionResp.data.text;

    // Translate text
    const translation = await translate(transcriptionText, { from: sourceLanguage, to: targetLanguage });

    // Generate speech using ElevenLabs (placeholder)
    // const audioStream = await elevenlabs.generate({
    //   voice: 'Rachel', // Default voice
    //   text: translation.text,
    //   model_id: 'eleven_monolingual_v1'
    // });

    const outputPath = path.join(__dirname, '../../uploads', `tts_${Date.now()}.mp3`);
    // Placeholder: create empty file
    fs.writeFileSync(outputPath, 'placeholder audio data');
    // const writeStream = fs.createWriteStream(outputPath);
    // audioStream.pipe(writeStream);

    // writeStream.on('finish', async () => {
      const history = new TranslationHistory({
        user: req.user._id,
        type: 'voice',
        sourceLanguage,
        targetLanguage,
        originalText: transcriptionText,
        translatedText: translation.text,
        fileUrl: audioFile.path,
        audioUrl: outputPath
      });
      await history.save();

      res.json({
        transcription: transcriptionText,
        translation: translation.text,
        audioUrl: `/uploads/${path.basename(outputPath)}`,
        historyId: history._id
      });
  } catch (error) {
    res.status(500).json({ message: 'Voice translation failed', error: error.message });
  }
});

// Video translation
router.post('/video', auth, upload.single('video'), async (req, res) => {
  try {
    const sourceLanguage = req.body.sourceLanguage || req.body.sourceLang;
    const targetLanguage = req.body.targetLanguage || req.body.targetLang;
    const videoFile = req.file;

    // Extract audio from video using FFmpeg
    const audioPath = path.join(__dirname, '../../uploads', `audio_${Date.now()}.wav`);
    ffmpeg(videoFile.path)
      .output(audioPath)
      .audioCodec('pcm_s16le')
      .audioChannels(1)
      .audioFrequency(16000)
      .on('error', (err) => {
        res.status(500).json({ message: 'Video processing failed', error: err.message });
      })
      .on('end', async () => {
        try {
          // Transcribe audio
          const transcriptionResp = await openai.createTranscription(
            fs.createReadStream(audioPath),
            'whisper-1',
            undefined,
            undefined,
            undefined,
            sourceLanguage
          );
          const transcriptionText = transcriptionResp.data.text;

          // Translate
          const translation = await translate(transcriptionText, { from: sourceLanguage, to: targetLanguage });

          // Generate TTS (placeholder)
          // const ttsAudio = await elevenlabs.generate({
          //   voice: 'Rachel',
          //   text: translation.text,
          //   model_id: 'eleven_monolingual_v1'
          // });

          const ttsPath = path.join(__dirname, '../../uploads', `tts_${Date.now()}.mp3`);
          // Placeholder
          fs.writeFileSync(ttsPath, 'placeholder audio data');
          // const writeStream = fs.createWriteStream(ttsPath);
          // ttsAudio.pipe(writeStream);

          // writeStream.on('finish', async () => {
            const history = new TranslationHistory({
              user: req.user._id,
              type: 'video',
              sourceLanguage,
              targetLanguage,
              originalText: transcriptionText,
              translatedText: translation.text,
              fileUrl: videoFile.path,
              audioUrl: ttsPath
            });
            await history.save();

            res.json({
              transcription: transcriptionText,
              translation: translation.text,
              audioUrl: `/uploads/${path.basename(ttsPath)}`,
              historyId: history._id
            });
          // });
        } catch (error) {
          res.status(500).json({ message: 'Video processing failed', error: error.message });
        }
      })
      .run();
  } catch (error) {
    res.status(500).json({ message: 'Video translation failed', error: error.message });
  }
});

// Document translation
router.post('/document', auth, upload.single('document'), async (req, res) => {
  try {
    const sourceLanguage = req.body.sourceLanguage || req.body.sourceLang;
    const targetLanguage = req.body.targetLanguage || req.body.targetLang;
    const documentFile = req.file;

    // For simplicity, assume text extraction from PDF/DOC is handled
    // In real implementation, use libraries like pdf-parse or mammoth
    const extractedText = "Extracted text from document"; // Placeholder

    const translation = await translate(extractedText, { from: sourceLanguage, to: targetLanguage });

    const history = new TranslationHistory({
      user: req.user._id,
      type: 'document',
      sourceLanguage,
      targetLanguage,
      originalText: extractedText,
      translatedText: translation.text,
      fileUrl: documentFile.path
    });
    await history.save();

    res.json({
      extractedText,
      translation: translation.text,
      historyId: history._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Document translation failed', error: error.message });
  }
});

// Camera OCR translation
router.post('/camera-ocr', auth, upload.single('image'), async (req, res) => {
  try {
    const sourceLanguage = req.body.sourceLanguage || req.body.sourceLang;
    const targetLanguage = req.body.targetLanguage || req.body.targetLang;
    const imageFile = req.file;

    const worker = await createWorker();
    await worker.loadLanguage(sourceLanguage);
    await worker.initialize(sourceLanguage);
    const { data: { text } } = await worker.recognize(imageFile.path);
    await worker.terminate();

    const translation = await translate(text, { from: sourceLanguage, to: targetLanguage });

    const history = new TranslationHistory({
      user: req.user._id,
      type: 'camera_ocr',
      sourceLanguage,
      targetLanguage,
      originalText: text,
      translatedText: translation.text,
      fileUrl: imageFile.path
    });
    await history.save();

    res.json({
      extractedText: text,
      translation: translation.text,
      historyId: history._id
    });
  } catch (error) {
    res.status(500).json({ message: 'OCR translation failed', error: error.message });
  }
});

// Get translation history
router.get('/history', auth, async (req, res) => {
  try {
    const history = await TranslationHistory.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch history', error: error.message });
  }
});

module.exports = router;