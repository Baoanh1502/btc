import { CandleData, MarketData } from '../types/trading';

export class BinanceAPI {
  private static readonly BASE_URL = '/api';
  private static readonly PROXY_URL = 'https://api.allorigins.win/raw?url=';

  static async fetchKlineData(symbol: string = 'BTCUSDT', interval: string = '5m', limit: number = 100): Promise<CandleData[]> {
    try {
      const url = `${this.PROXY_URL}${encodeURIComponent(`${this.BASE_URL}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`)}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.map((kline: any[]) => ({
        time: Math.floor(kline[0] / 1000),
        open: parseFloat(kline[1]),
        high: parseFloat(kline[2]),
        low: parseFloat(kline[3]),
        close: parseFloat(kline[4]),
        volume: parseFloat(kline[5])
      }));
    } catch (error) {
      console.error('Error fetching kline data:', error);
      throw new Error('Failed to fetch market data from Binance');
    }
  }

  static async fetchMarketData(symbol: string = 'BTCUSDT'): Promise<MarketData> {
    try {
      const tickerUrl = `${this.PROXY_URL}${encodeURIComponent(`${this.BASE_URL}/ticker/24hr?symbol=${symbol}`)}`;
      const response = await fetch(tickerUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        symbol: data.symbol,
        price: parseFloat(data.lastPrice),
        change24h: parseFloat(data.priceChangePercent),
        volume24h: parseFloat(data.volume),
        marketCap: 0 // Would need additional API call
      };
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw new Error('Failed to fetch market data');
    }
  }
}