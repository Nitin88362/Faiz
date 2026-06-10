import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import LanguageDropdown from '../common/LanguageDropdown';
import ProgressBar from '../common/ProgressBar';

const TextTranslate = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;

    setIsTranslating(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await axios.post('/api/translate/text', {
        text: sourceText,
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
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <h1 className="text-4xl font-bold mb-8">Text Translation</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <LanguageDropdown
            label="Source Language"
            value={sourceLang}
            onChange={setSourceLang}
          />
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Enter text to translate..."
            className="w-full h-64 p-4 bg-gray-800 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 mt-4"
          />
        </div>
        <div>
          <LanguageDropdown
            label="Target Language"
            value={targetLang}
            onChange={setTargetLang}
          />
          <textarea
            value={translatedText}
            readOnly
            placeholder="Translation will appear here..."
            className="w-full h-64 p-4 bg-gray-800 text-white rounded-lg resize-none mt-4"
          />
        </div>
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={handleTranslate}
          disabled={isTranslating || !sourceText.trim()}
          className="neon-button px-8 py-3 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTranslating ? 'Translating...' : 'Translate'}
        </button>
        {isTranslating && <ProgressBar progress={progress} />}
      </div>
    </motion.div>
  );
};

export default TextTranslate;