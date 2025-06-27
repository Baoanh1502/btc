import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Target, Shield } from 'lucide-react';
import { PredictionResult } from '../types/trading';

interface PredictionCardProps {
  prediction: PredictionResult;
  isLoading: boolean;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, isLoading }) => {
  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BUY': return 'text-green-400';
      case 'SELL': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getSignalBg = (signal: string) => {
    switch (signal) {
      case 'BUY': return 'bg-green-500/20 border-green-500/30';
      case 'SELL': return 'bg-red-500/20 border-red-500/30';
      default: return 'bg-yellow-500/20 border-yellow-500/30';
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'BUY': return TrendingUp;
      case 'SELL': return TrendingDown;
      default: return Minus;
    }
  };

  const SignalIcon = getSignalIcon(prediction.signal);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
      >
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded-lg w-1/2"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border ${getSignalBg(prediction.signal)}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-full ${getSignalBg(prediction.signal)}`}>
            <SignalIcon className={`w-6 h-6 ${getSignalColor(prediction.signal)}`} />
          </div>
          <div>
            <h3 className={`text-2xl font-bold ${getSignalColor(prediction.signal)}`}>
              {prediction.signal}
            </h3>
            <p className="text-gray-400 text-sm">AI Recommendation</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{prediction.confidence}%</div>
          <div className="text-sm text-gray-400">Confidence</div>
        </div>
      </div>

      {prediction.targetPrice && prediction.stopLoss && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-900/50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">Target Price</span>
            </div>
            <div className="text-lg font-semibold text-blue-400">
              ${prediction.targetPrice.toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Shield className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-gray-400">Stop Loss</span>
            </div>
            <div className="text-lg font-semibold text-orange-400">
              ${prediction.stopLoss.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Analysis Reasoning:</h4>
        {prediction.reasoning.map((reason, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-2"
          >
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-300">{reason}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PredictionCard;