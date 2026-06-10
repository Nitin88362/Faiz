import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-bold text-center mb-12"
        >
          About Us
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="text-xl text-gray-300 mb-8">
            We are a team of AI enthusiasts dedicated to breaking down language barriers worldwide.
            Our advanced translation technology uses cutting-edge machine learning to provide
            accurate and fast translations across multiple modalities.
          </p>
          <p className="text-lg text-gray-400">
            Founded in 2023, we've helped millions of users communicate seamlessly across languages.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;