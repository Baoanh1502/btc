import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import { MarketData } from '../types/trading';

interface MarketStatsProps {
  marketData: MarketData | null;
  isLoading: boolean;
}

const MarketStats: React.FC<MarketStatsProps> = ({ marketData, isLoading }) => {
  if (isLoading || !marketData) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-6 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: 'Current Price',
      value: `$${marketData.price.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      label: '24h Change',
      value: `${marketData.change24h > 0 ? '+' : ''}${marketData.change24h.toFixed(2)}%`,
      icon: marketData.change24h > 0 ? TrendingUp : TrendingDown,
      color: marketData.change24h > 0 ? 'text-green-400' : 'text-red-400',
      bgColor: marketData.change24h > 0 ? 'bg-green-500/20' : 'bg-red-500/20'
    },
    {
      label: '24h Volume',
      value: `${(marketData.volume24h / 1000).toFixed(1)}K BTC`,
      icon: BarChart3,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      label: 'Symbol',
      value: marketData.symbol,
      icon: DollarSign,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MarketStats;