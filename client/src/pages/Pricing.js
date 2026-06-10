import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      features: ['1000 words/month', '5 languages', 'Text translation only'],
    },
    {
      name: 'Pro',
      price: '$9.99',
      features: ['10,000 words/month', '50 languages', 'All features', 'Priority support'],
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: ['Unlimited usage', 'All languages', 'API access', 'Dedicated support'],
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
          Pricing
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-900 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center"
            >
              <h3 className="text-3xl font-semibold mb-4">{plan.name}</h3>
              <p className="text-4xl font-bold mb-6">{plan.price}</p>
              <ul className="text-gray-300 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="mb-2">{feature}</li>
                ))}
              </ul>
              <Link to="/signup" className="neon-button px-6 py-2 rounded-lg text-white font-semibold">
                Get Started
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;