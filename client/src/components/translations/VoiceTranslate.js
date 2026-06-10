import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import LanguageDropdown from '../common/LanguageDropdown';
import ProgressBar from '../common/ProgressBar';

const VoiceTranslate = () => {
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState(0);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript && !listening) {
      handleTranslate(transcript);
    }
  }, [transcript, listening]);

  const handleTranslate = useCallback(async (text) => {
    if (!text.trim()) return;

    setIsTranslating(true);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await axios.post('/api/translate/text', {
        text,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      });

      clearInterval(progressInterval);
      setProgress(100);
      setTranslatedText(response.data.translatedText);

      setTimeout(() => {
        setIsTranslating(false);
        setProgress(0);
      }, 1000);
    } catch (error) {
      console.error('Translation error:', error);
      setIsTranslating(false);
      setProgress(0);
    }
  }, [sourceLang, targetLang]);

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: false });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  if (!browserSupportsSpeechRecognition) {
    return <div className="text-center text-red-500">Browser doesn't support speech recognition.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <h1 className="text-4xl font-bold mb-8">Voice Translation</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <LanguageDropdown
            label="Source Language"
            value={sourceLang}
            onChange={setSourceLang}
          />
          <div className="bg-gray-800 p-4 rounded-lg mt-4">
            <p className="text-gray-300 mb-4">Spoken text:</p>
            <p className="text-white">{transcript || 'Start speaking...'}</p>
          </div>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={startListening}
              disabled={listening}
              className="neon-button px-4 py-2 rounded-lg text-white font-semibold disabled:opacity-50"
            >
              {listening ? 'Listening...' : 'Start Recording'}
            </button>
            <button
              onClick={stopListening}
              disabled={!listening}
              className="border border-purple-500 px-4 py-2 rounded-lg text-purple-500 hover:bg-purple-500 hover:text-white disabled:opacity-50"
            >
              Stop
            </button>
          </div>
        </div>
        <div>
          <LanguageDropdown
            label="Target Language"
            value={targetLang}
            onChange={setTargetLang}
          />
          <div className="bg-gray-800 p-4 rounded-lg mt-4">
            <p className="text-gray-300 mb-4">Translation:</p>
            <p className="text-white">{translatedText || 'Translation will appear here...'}</p>
          </div>
        </div>
      </div>
      {isTranslating && <ProgressBar progress={progress} />}
    </motion.div>
  );
};

export default VoiceTranslate;