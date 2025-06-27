import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import TradingChart from './components/TradingChart';
import PredictionCard from './components/PredictionCard';
import MarketStats from './components/MarketStats';
import CountdownTimer from './components/CountdownTimer';
import { BinanceAPI } from './utils/binanceApi';
import { TechnicalAnalysis } from './utils/technicalAnalysis';
import { CandleData, PredictionResult, MarketData } from './types/trading';

function App() {
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [prediction, setPrediction] = useState<PredictionResult>({
    signal: 'HOLD',
    confidence: 0,
    reasoning: ['Initializing analysis...']
  });
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysisCount, setAnalysisCount] = useState(0);

  const fetchMarketData = useCallback(async () => {
    try {
      setError(null);
      const [klineData, market] = await Promise.all([
        BinanceAPI.fetchKlineData('BTCUSDT', '5m', 100),
        BinanceAPI.fetchMarketData('BTCUSDT')
      ]);

      setCandleData(klineData);
      setMarketData(market);

      // Generate prediction
      const newPrediction = TechnicalAnalysis.generatePrediction(klineData);
      setPrediction(newPrediction);
      
      setIsLoading(false);
      setAnalysisCount(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  const handleTimerComplete = useCallback(() => {
    setIsLoading(true);
    fetchMarketData();
  }, [fetchMarketData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <Header />

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6 text-center"
          >
            <p className="text-red-400">{error}</p>
            <button
              onClick={fetchMarketData}
              className="mt-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors"
            >
              Retry
            </button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <MarketStats marketData={marketData} isLoading={isLoading} />
          </div>
          <div>
            <CountdownTimer
              duration={30}
              onComplete={handleTimerComplete}
              isActive={!isLoading && !error}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          <div className="xl:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <TradingChart data={candleData} height={500} />
            </motion.div>
          </div>
          <div>
            <PredictionCard prediction={prediction} isLoading={isLoading} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Analysis Statistics</h3>
              <p className="text-gray-400">Total predictions generated: {analysisCount}</p>
            </div>
            <div className="text-right text-sm text-gray-400">
              <p>Last updated: {new Date().toLocaleTimeString()}</p>
              <p>Data source: Binance API</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;