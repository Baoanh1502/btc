import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, RefreshCw } from 'lucide-react';

interface CountdownTimerProps {
  duration: number;
  onComplete: () => void;
  isActive: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ duration, onComplete, isActive }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isActive) return;

    setTimeLeft(duration);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onComplete();
          return duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [duration, onComplete, isActive]);

  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-500/20 rounded-full">
            <Clock className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Next Analysis In</h3>
            <p className="text-gray-400 text-sm">Real-time market scanning</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-400">{timeLeft}s</div>
          <div className="text-sm text-gray-400">seconds</div>
        </div>
      </div>

      <div className="relative">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>Analyzing...</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
      </div>

      {timeLeft <= 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center mt-4 text-yellow-400"
        >
          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          <span className="text-sm">Preparing new prediction...</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CountdownTimer;