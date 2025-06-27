import { CandleData, TechnicalIndicators, PredictionResult } from '../types/trading';

export class TechnicalAnalysis {
  static calculateSMA(data: number[], period: number): number {
    if (data.length < period) return 0;
    const sum = data.slice(-period).reduce((a, b) => a + b, 0);
    return sum / period;
  }

  static calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) return 50;
    
    const changes = prices.slice(1).map((price, i) => price - prices[i]);
    const gains = changes.map(change => change > 0 ? change : 0);
    const losses = changes.map(change => change < 0 ? -change : 0);
    
    const avgGain = this.calculateSMA(gains.slice(-period), period);
    const avgLoss = this.calculateSMA(losses.slice(-period), period);
    
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  static calculateMACD(prices: number[]): { macd: number; signal: number; histogram: number } {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    const macd = ema12 - ema26;
    
    // Simplified signal line calculation
    const signal = macd * 0.9; // Approximation
    const histogram = macd - signal;
    
    return { macd, signal, histogram };
  }

  static calculateEMA(prices: number[], period: number): number {
    if (prices.length === 0) return 0;
    const multiplier = 2 / (period + 1);
    let ema = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }
    
    return ema;
  }

  static calculateBollingerBands(prices: number[], period: number = 20, stdDev: number = 2) {
    const sma = this.calculateSMA(prices, period);
    const squaredDifferences = prices.slice(-period).map(price => Math.pow(price - sma, 2));
    const variance = squaredDifferences.reduce((a, b) => a + b, 0) / period;
    const standardDeviation = Math.sqrt(variance);
    
    return {
      upper: sma + (standardDeviation * stdDev),
      middle: sma,
      lower: sma - (standardDeviation * stdDev)
    };
  }

  static generatePrediction(data: CandleData[]): PredictionResult {
    if (data.length < 50) {
      return {
        signal: 'HOLD',
        confidence: 0,
        reasoning: ['Insufficient data for analysis']
      };
    }

    const prices = data.map(d => d.close);
    const volumes = data.map(d => d.volume);
    
    const rsi = this.calculateRSI(prices);
    const macd = this.calculateMACD(prices);
    const sma20 = this.calculateSMA(prices, 20);
    const sma50 = this.calculateSMA(prices, 50);
    const bollinger = this.calculateBollingerBands(prices);
    
    const currentPrice = prices[prices.length - 1];
    const reasoning: string[] = [];
    let bullishSignals = 0;
    let bearishSignals = 0;

    // RSI Analysis
    if (rsi < 30) {
      bullishSignals += 2;
      reasoning.push(`RSI oversold (${rsi.toFixed(1)}) - potential buy signal`);
    } else if (rsi > 70) {
      bearishSignals += 2;
      reasoning.push(`RSI overbought (${rsi.toFixed(1)}) - potential sell signal`);
    }

    // MACD Analysis
    if (macd.macd > macd.signal && macd.histogram > 0) {
      bullishSignals += 1;
      reasoning.push('MACD showing bullish momentum');
    } else if (macd.macd < macd.signal && macd.histogram < 0) {
      bearishSignals += 1;
      reasoning.push('MACD showing bearish momentum');
    }

    // Moving Average Analysis
    if (currentPrice > sma20 && sma20 > sma50) {
      bullishSignals += 1;
      reasoning.push('Price above moving averages - uptrend confirmed');
    } else if (currentPrice < sma20 && sma20 < sma50) {
      bearishSignals += 1;
      reasoning.push('Price below moving averages - downtrend confirmed');
    }

    // Bollinger Bands Analysis
    if (currentPrice < bollinger.lower) {
      bullishSignals += 1;
      reasoning.push('Price near Bollinger lower band - potential reversal');
    } else if (currentPrice > bollinger.upper) {
      bearishSignals += 1;
      reasoning.push('Price near Bollinger upper band - potential pullback');
    }

    // Volume Analysis
    const avgVolume = this.calculateSMA(volumes, 20);
    const currentVolume = volumes[volumes.length - 1];
    if (currentVolume > avgVolume * 1.5) {
      reasoning.push('High volume confirms price movement');
    }

    const totalSignals = bullishSignals + bearishSignals;
    const confidence = Math.min(95, (totalSignals / 6) * 100);

    let signal: 'BUY' | 'SELL' | 'HOLD';
    if (bullishSignals > bearishSignals && confidence > 60) {
      signal = 'BUY';
    } else if (bearishSignals > bullishSignals && confidence > 60) {
      signal = 'SELL';
    } else {
      signal = 'HOLD';
    }

    const targetPrice = signal === 'BUY' ? currentPrice * 1.03 : currentPrice * 0.97;
    const stopLoss = signal === 'BUY' ? currentPrice * 0.98 : currentPrice * 1.02;

    return {
      signal,
      confidence: Math.round(confidence),
      reasoning,
      targetPrice,
      stopLoss
    };
  }
}