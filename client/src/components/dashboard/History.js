import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('/api/translate/history');
        setHistory(response.data);
      } catch (err) {
        setError('Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'text': return '📝';
      case 'voice': return '🎤';
      case 'video': return '🎥';
      case 'document': return '📄';
      case 'camera_ocr': return '📷';
      case 'chat': return '💬';
      default: return '🔄';
    }
  };

  if (loading) return <div className="text-center text-gray-400">Loading history...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <h1 className="text-4xl font-bold mb-8">Translation History</h1>
      {history.length === 0 ? (
        <div className="text-center text-gray-400 bg-gray-900 p-8 rounded-lg">
          No translations yet. Start translating to see your history here!
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 p-4 rounded-lg border border-gray-800"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getTypeIcon(item.type)}</span>
                  <span className="text-purple-400 font-semibold capitalize">{item.type.replace('_', ' ')}</span>
                </div>
                <span className="text-gray-500 text-sm">
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{item.sourceLanguage} → {item.targetLanguage}</p>
                  <p className="text-gray-300">{item.originalText || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Translated</p>
                  <p className="text-white">{item.translatedText || 'N/A'}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default History;
