import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactPlayer from 'react-player';
import axios from 'axios';
import LanguageDropdown from '../common/LanguageDropdown';
import ProgressBar from '../common/ProgressBar';

const VideoTranslate = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [result, setResult] = useState(null);
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setResult(null);
    }
  };

  const handleTranslate = async () => {
    if (!videoFile) return;

    setIsTranslating(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('sourceLanguage', sourceLang);
      formData.append('targetLanguage', targetLang);

      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 5, 95));
      }, 500);

      const response = await axios.post('/api/translate/video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      clearInterval(progressInterval);
      setProgress(100);
      setResult(response.data);

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
      <h1 className="text-4xl font-bold mb-8">Video Translation</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <LanguageDropdown
            label="Source Language"
            value={sourceLang}
            onChange={setSourceLang}
          />
          <div className="mt-4">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              ref={fileInputRef}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="w-full p-4 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-purple-500 hover:text-purple-500 transition-colors"
            >
              {videoFile ? videoFile.name : 'Select Video File'}
            </button>
          </div>
          {videoFile && (
            <div className="mt-4">
              <ReactPlayer url={URL.createObjectURL(videoFile)} controls width="100%" />
            </div>
          )}
        </div>
        <div>
          <LanguageDropdown
            label="Target Language"
            value={targetLang}
            onChange={setTargetLang}
          />
          {result && (
            <div className="mt-4 space-y-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-300 mb-2">Transcription:</p>
                <p className="text-white">{result.transcription}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-300 mb-2">Translation:</p>
                <p className="text-white">{result.translation}</p>
              </div>
              {result.audioUrl && (
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-gray-300 mb-2">Translated Audio:</p>
                  <audio controls src={result.audioUrl} className="w-full" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={handleTranslate}
          disabled={isTranslating || !videoFile}
          className="neon-button px-8 py-3 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTranslating ? 'Translating...' : 'Translate Video'}
        </button>
        {isTranslating && <ProgressBar progress={progress} />}
      </div>
    </motion.div>
  );
};

export default VideoTranslate;
