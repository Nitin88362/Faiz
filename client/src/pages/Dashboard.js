import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import TextTranslate from '../components/translations/TextTranslate';
import VoiceTranslate from '../components/translations/VoiceTranslate';
import VideoTranslate from '../components/translations/VideoTranslate';
import DocumentTranslate from '../components/translations/DocumentTranslate';
import CameraTranslate from '../components/translations/CameraTranslate';
import ChatTranslate from '../components/translations/ChatTranslate';
import History from '../components/dashboard/History';
import Settings from '../components/dashboard/Settings';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('text');

  const renderContent = () => {
    switch (activeTab) {
      case 'text':
        return <TextTranslate />;
      case 'voice':
        return <VoiceTranslate />;
      case 'video':
        return <VideoTranslate />;
      case 'document':
        return <DocumentTranslate />;
      case 'camera':
        return <CameraTranslate />;
      case 'chat':
        return <ChatTranslate />;
      case 'history':
        return <History />;
      case 'settings':
        return <Settings />;
      default:
        return <TextTranslate />;
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 p-8 overflow-y-auto"
      >
        {renderContent()}
      </motion.div>
    </div>
  );
};

export default Dashboard;
