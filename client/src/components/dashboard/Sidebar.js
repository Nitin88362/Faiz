import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  const menuItems = [
    { id: 'text', label: 'Text Translate', icon: '📝' },
    { id: 'voice', label: 'Voice Translate', icon: '🎤' },
    { id: 'video', label: 'Video Translate', icon: '🎥' },
    { id: 'document', label: 'Document Translate', icon: '📄' },
    { id: 'camera', label: 'Camera Translate', icon: '📷' },
    { id: 'chat', label: 'Chat Translator', icon: '💬' },
    { id: 'history', label: 'History', icon: '📜' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-64 bg-gray-900 h-screen p-4 flex flex-col"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-purple-500">Translator</h2>
      </div>
      <nav className="flex-1">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className="mb-2">
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto space-y-2">
        <Link
          to="/"
          className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
        >
          ← Back to Home
        </Link>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
        >
          🚪 Logout
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
