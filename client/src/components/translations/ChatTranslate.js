import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import io from 'socket.io-client';
import LanguageDropdown from '../common/LanguageDropdown';

const ChatTranslate = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const socketRef = useRef();
  const chatRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // ✅ Backend URL from .env
    const socket = io(process.env.REACT_APP_API_URL, {
      auth: { token }
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join-room', roomId);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('translated-message', (data) => {
      setMessages(prev => [...prev, {
        id: Date.now() + Math.random(),
        text: data.translatedMessage,
        originalText: data.originalMessage,
        user: data.user,
        isTranslation: true,
        timestamp: new Date(data.timestamp)
      }]);
    });

    socket.on('error', (data) => {
      console.error('Socket error:', data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !socketRef.current) return;

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      user: 'You',
      isTranslation: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);

    socketRef.current.emit('chat-message', {
      message: inputMessage,
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
      roomId
    });

    setInputMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <h1 className="text-4xl font-bold mb-8">Real-time Chat Translator</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="md:col-span-2">
          <LanguageDropdown
            label="Your Language"
            value={sourceLang}
            onChange={setSourceLang}
          />
        </div>

        <div className="md:col-span-2">
          <LanguageDropdown
            label="Partner's Language"
            value={targetLang}
            onChange={setTargetLang}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Room ID</label>

        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter room ID..."
        />
      </div>

      <div className="bg-gray-900 rounded-lg h-96 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto" ref={chatRef}>
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">
              Start a conversation...
            </p>
          ) : (
            messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-4 p-3 rounded-lg ${
                  message.isTranslation
                    ? 'bg-purple-600 ml-auto max-w-md'
                    : 'bg-gray-700 mr-auto max-w-md'
                }`}
              >
                <p className="text-xs text-gray-300 mb-1">
                  {message.user}
                </p>

                <p className="text-white">
                  {message.text}
                </p>

                {message.originalText && message.isTranslation && (
                  <p className="text-xs text-gray-300 mt-1">
                    Original: {message.originalText}
                  </p>
                )}

                <p className="text-xs text-gray-400 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </motion.div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-700">
          <div className="flex">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || !isConnected}
              className="neon-button px-6 py-2 rounded-r-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <span
          className={`inline-block w-3 h-3 rounded-full mr-2 ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}
        ></span>

        {isConnected ? 'Connected' : 'Disconnected'}
      </div>
    </motion.div>
  );
};

export default ChatTranslate;
