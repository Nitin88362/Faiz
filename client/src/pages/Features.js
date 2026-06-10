import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Features = () => {
  const features = [
    {
      title: 'Text Translation',
      description: 'Translate text between 100+ languages instantly.',
      icon: '📝',
    },
    {
      title: 'Voice Translation',
      description: 'Speak in any language and get real-time translation.',
      icon: '🎤',
    },
    {
      title: 'Document Translation',
      description: 'Upload PDFs and get them translated with formatting preserved.',
      icon: '📄',
    },
    {
      title: 'Video Translation',
      description: 'Translate videos with subtitles and audio dubbing.',
      icon: '🎥',
    },
    {
      title: 'Real-time Chat',
      description: 'Chat with people in different languages seamlessly.',
      icon: '💬',
    },
    {
      title: 'Camera Translation',
      description: 'Point your camera at text and translate it instantly.',
      icon: '📷',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-bold text-center mb-12"
        >
          Features
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-center mt-12"
        >
          <Link to="/dashboard" className="neon-button px-8 py-3 rounded-lg text-white font-semibold">
            Try It Now
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Features;