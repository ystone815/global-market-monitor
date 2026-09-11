export type AssetClass = 'indices' | 'forex' | 'commodities' | 'bonds' | 'crypto';
export type Region = 'US' | 'EU' | 'ASIA' | 'GLOBAL';

export interface SparklinePoint {
  time: string;
  value: number;
}

export interface MarketQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: string;
  assetClass: AssetClass;
  region: Region;
  category?: string;
  sparkline: SparklinePoint[];
  updatedAt: string;
}

export interface ChartDataPoint {
  time: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma20?: number;
  ema50?: number;
  rsi?: number;
}

export interface MarketSentiment {
  vixScore: number;
  vixChange: number;
  fearGreedScore: number; // 0 - 100
  fearGreedLabel: 'Extreme Fear' | 'Fear' | 'Neutral' | 'Greed' | 'Extreme Greed';
  advancingStocks: number;
  decliningStocks: number;
  unchangedStocks: number;
}

export interface SectorPerformance {
  symbol: string;
  name: string;
  changePercent: number;
  weight: number;
}

export interface ForexPair {
  symbol: string;
  name: string;
  rate: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
}

export interface BondYield {
  symbol: string;
  name: string;
  maturity: string;
  yieldVal: number;
  changeBp: number;
  isSpread?: boolean;
}

export interface CryptoAsset {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: string;
  marketCap: string;
  dominance: number;
}

export interface EconomicEvent {
  id: string;
  time: string;
  country: string;
  flag: string;
  event: string;
  actual?: string;
  forecast?: string;
  previous?: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface MarketNews {
  id: string;
  title: string;
  source: string;
  time: string;
  url: string;
  category: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
}
