import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Document, Page, pdfjs } from 'react-pdf';
import axios from 'axios';
import LanguageDropdown from '../common/LanguageDropdown';
import ProgressBar from '../common/ProgressBar';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const DocumentTranslate = () => {
  const [documentFile, setDocumentFile] = useState(null);
  const [result, setResult] = useState(null);
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [numPages, setNumPages] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setDocumentFile(file);
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: false,
  });

  const onDocumentLoadSuccess = ({ numPages: pages }) => {
    setNumPages(pages);
  };

  const handleTranslate = async () => {
    if (!documentFile) return;

    setIsTranslating(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('document', documentFile);
      formData.append('sourceLanguage', sourceLang);
      formData.append('targetLanguage', targetLang);

      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 5, 95));
      }, 500);

      const response = await axios.post('/api/translate/document', formData, {
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
      <h1 className="text-4xl font-bold mb-8">Document Translation</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <LanguageDropdown
            label="Source Language"
            value={sourceLang}
            onChange={setSourceLang}
          />
          <div
            {...getRootProps()}
            className={`mt-4 p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              isDragActive
                ? 'border-purple-500 bg-purple-500 bg-opacity-10'
                : 'border-gray-600 hover:border-purple-500'
            }`}
          >
            <input {...getInputProps()} />
            <div className="text-center">
              <p className="text-gray-400 mb-2">
                {isDragActive ? 'Drop the document here...' : 'Drag & drop a document here, or click to select'}
              </p>
              <p className="text-sm text-gray-500">Supported formats: PDF, DOC, DOCX</p>
            </div>
          </div>
          {documentFile && (
            <div className="mt-4">
              <p className="text-gray-300">Selected: {documentFile.name}</p>
              {documentFile.type === 'application/pdf' && (
                <Document
                  file={documentFile}
                  onLoadSuccess={onDocumentLoadSuccess}
                  className="mt-2"
                >
                  <Page pageNumber={1} width={300} />
                </Document>
              )}
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
                <p className="text-gray-300 mb-2">Extracted Text:</p>
                <p className="text-white whitespace-pre-wrap">{result.extractedText}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-300 mb-2">Translation:</p>
                <p className="text-white whitespace-pre-wrap">{result.translation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={handleTranslate}
          disabled={isTranslating || !documentFile}
          className="neon-button px-8 py-3 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTranslating ? 'Translating...' : 'Translate Document'}
        </button>
        {isTranslating && <ProgressBar progress={progress} />}
      </div>
    </motion.div>
  );
};

export default DocumentTranslate;
