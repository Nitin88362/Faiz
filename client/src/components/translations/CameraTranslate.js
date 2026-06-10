import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Webcam from 'react-webcam';
import axios from 'axios';
import LanguageDropdown from '../common/LanguageDropdown';

const CameraTranslate = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [translatedText, setTranslatedText] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setTranslatedText('');
    setExtractedText('');
  }, [webcamRef]);

  const handleTranslate = async () => {
    if (!capturedImage) return;

    setIsTranslating(true);

    try {
      const response = await fetch(capturedImage);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('image', blob, 'capture.jpg');
      formData.append('sourceLanguage', sourceLang);
      formData.append('targetLanguage', targetLang);

      const translateResponse = await axios.post('/api/translate/camera-ocr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setExtractedText(translateResponse.data.extractedText);
      setTranslatedText(translateResponse.data.translation);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <h1 className="text-4xl font-bold mb-8">Camera Translation</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <LanguageDropdown
            label="Source Language"
            value={sourceLang}
            onChange={setSourceLang}
          />
          <div className="mt-4 bg-gray-800 rounded-lg overflow-hidden">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full"
            />
          </div>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={capture}
              className="neon-button px-4 py-2 rounded-lg text-white font-semibold"
            >
              Capture
            </button>
            <button
              onClick={handleTranslate}
              disabled={!capturedImage || isTranslating}
              className="border border-purple-500 px-4 py-2 rounded-lg text-purple-500 hover:bg-purple-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTranslating ? 'Translating...' : 'Translate'}
            </button>
          </div>
        </div>
        <div>
          <LanguageDropdown
            label="Target Language"
            value={targetLang}
            onChange={setTargetLang}
          />
          {capturedImage && (
            <div className="mt-4">
              <img src={capturedImage} alt="Captured" className="w-full rounded-lg" />
            </div>
          )}
          {extractedText && (
            <div className="mt-4 bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-300 mb-2">Extracted Text:</p>
              <p className="text-white">{extractedText}</p>
            </div>
          )}
          {translatedText && (
            <div className="mt-4 bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-300 mb-2">Translated Text:</p>
              <p className="text-white">{translatedText}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CameraTranslate;
