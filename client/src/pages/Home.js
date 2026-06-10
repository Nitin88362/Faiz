import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-purple-900 to-black">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-6xl font-bold text-white mb-4"
      >
        Break Language Barriers Instantly
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-xl text-gray-300 mb-8"
      >
        Translate text, speech, documents, and videos into any language using AI.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="flex space-x-4"
      >
        <Link to="/dashboard" className="neon-button px-8 py-3 rounded-lg text-white font-semibold">
          Start Translating
        </Link>
        <button className="border border-purple-500 px-8 py-3 rounded-lg text-purple-500 hover:bg-purple-500 hover:text-white transition">
          Watch Demo
        </button>
      </motion.div>
    </div>
  );
};

export default Home;