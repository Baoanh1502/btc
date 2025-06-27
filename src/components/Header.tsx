import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, TrendingUp } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8"
    >
      <div className="flex items-center justify-center space-x-3 mb-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-50"></div>
          <div className="relative p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
            <Brain className="w-8 h-8 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Crypto Prediction
          </h1>
          <p className="text-gray-400 text-lg mt-2">Advanced Technical Analysis & Market Intelligence</p>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span>Real-time Data</span>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span>Technical Indicators</span>
        </div>
        <div className="flex items-center space-x-2">
          <Brain className="w-4 h-4 text-blue-400" />
          <span>AI Analysis</span>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;