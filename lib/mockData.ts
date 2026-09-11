import { 
  MarketQuote, 
  ChartDataPoint, 
  MarketSentiment, 
  SectorPerformance, 
  ForexPair, 
  BondYield, 
  CryptoAsset, 
  EconomicEvent, 
  MarketNews 
} from './types';

// Helper to generate sparklines
function generateSparkline(basePrice: number, volatility: number = 0.008, points: number = 20) {
  let current = basePrice * (1 - volatility * 3);
  const result = [];
  const now = new Date();
  for (let i = points; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 15 * 60 * 1000);
    const change = (Math.random() - 0.48) * volatility * current;
    current += change;
    result.push({
      time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: Number(current.toFixed(2))
    });
  }
  return result;
}

export const INITIAL_QUOTES: MarketQuote[] = [
  {
    symbol: '^GSPC',
    name: 'S&P 500',
    price: 5648.40,
    change: 32.15,
    changePercent: 0.57,
    high: 5660.10,
    low: 5622.30,
    volume: '3.45B',
    assetClass: 'indices',
    region: 'US',
    sparkline: generateSparkline(5648.40),
    updatedAt: 'Just now'
  },
  {
    symbol: '^IXIC',
    name: 'Nasdaq Composite',
    price: 17683.25,
    change: 154.80,
    changePercent: 0.88,
    high: 17720.00,
    low: 17540.50,
    volume: '4.82B',
    assetClass: 'indices',
    region: 'US',
    sparkline: generateSparkline(17683.25, 0.012),
    updatedAt: 'Just now'
  },
  {
    symbol: '^DJI',
    name: 'Dow Jones',
    price: 40345.10,
    change: -45.20,
    changePercent: -0.11,
    high: 40480.00,
    low: 40290.00,
    volume: '310M',
    assetClass: 'indices',
    region: 'US',
    sparkline: generateSparkline(40345.10, 0.004),
    updatedAt: 'Just now'
  },
  {
    symbol: '^RUT',
    name: 'Russell 2000',
    price: 2185.60,
    change: 18.40,
    changePercent: 0.85,
    high: 2192.10,
    low: 2165.00,
    volume: '1.2B',
    assetClass: 'indices',
    region: 'US',
    sparkline: generateSparkline(2185.60, 0.01),
    updatedAt: 'Just now'
  },
  {
    symbol: '^GDAXI',
    name: 'DAX Performance-Index',
    price: 18450.80,
    change: 112.30,
    changePercent: 0.61,
    high: 18490.00,
    low: 18380.00,
    volume: '85M',
    assetClass: 'indices',
    region: 'EU',
    sparkline: generateSparkline(18450.80, 0.006),
    updatedAt: 'Just now'
  },
  {
    symbol: '^FTSE',
    name: 'FTSE 100',
    price: 8245.50,
    change: 22.10,
    changePercent: 0.27,
    high: 8260.00,
    low: 8220.00,
    volume: '620M',
    assetClass: 'indices',
    region: 'EU',
    sparkline: generateSparkline(8245.50, 0.005),
    updatedAt: 'Just now'
  },
  {
    symbol: '^N225',
    name: 'Nikkei 225',
    price: 36580.40,
    change: -210.50,
    changePercent: -0.57,
    high: 36890.00,
    low: 36450.00,
    volume: '1.4B',
    assetClass: 'indices',
    region: 'ASIA',
    sparkline: generateSparkline(36580.40, 0.009),
    updatedAt: 'Just now'
  },
  {
    symbol: '^KS11',
    name: 'KOSPI Composite',
    price: 2575.20,
    change: 14.80,
    changePercent: 0.58,
    high: 2582.00,
    low: 2560.00,
    volume: '480M',
    assetClass: 'indices',
    region: 'ASIA',
    sparkline: generateSparkline(2575.20, 0.008),
    updatedAt: 'Just now'
  },
  {
    symbol: '000001.SS',
    name: 'Shanghai Composite',
    price: 2721.80,
    change: -8.40,
    changePercent: -0.31,
    high: 2735.00,
    low: 2715.00,
    volume: '2.1B',
    assetClass: 'indices',
    region: 'ASIA',
    sparkline: generateSparkline(2721.80, 0.006),
    updatedAt: 'Just now'
  },
  // Forex
  {
    symbol: 'USD/KRW',
    name: 'US Dollar / Korean Won',
    price: 1335.50,
    change: -4.20,
    changePercent: -0.31,
    high: 1342.00,
    low: 1333.80,
    volume: '12.4B',
    assetClass: 'forex',
    region: 'GLOBAL',
    sparkline: generateSparkline(1335.50, 0.003),
    updatedAt: 'Just now'
  },
  {
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    price: 1.1085,
    change: 0.0024,
    changePercent: 0.22,
    high: 1.1102,
    low: 1.1055,
    volume: '85B',
    assetClass: 'forex',
    region: 'GLOBAL',
    sparkline: generateSparkline(1.1085, 0.002),
    updatedAt: 'Just now'
  },
  {
    symbol: 'USD/JPY',
    name: 'US Dollar / Japanese Yen',
    price: 141.25,
    change: -0.85,
    changePercent: -0.60,
    high: 142.40,
    low: 140.90,
    volume: '64B',
    assetClass: 'forex',
    region: 'GLOBAL',
    sparkline: generateSparkline(141.25, 0.005),
    updatedAt: 'Just now'
  },
  // Commodities
  {
    symbol: 'CL=F',
    name: 'Crude Oil WTI',
    price: 69.45,
    change: 1.25,
    changePercent: 1.83,
    high: 70.10,
    low: 68.15,
    volume: '340K',
    assetClass: 'commodities',
    region: 'GLOBAL',
    sparkline: generateSparkline(69.45, 0.015),
    updatedAt: 'Just now'
  },
  {
    symbol: 'GC=F',
    name: 'Gold Futures',
    price: 2585.50,
    change: 18.20,
    changePercent: 0.71,
    high: 2592.00,
    low: 2568.00,
    volume: '185K',
    assetClass: 'commodities',
    region: 'GLOBAL',
    sparkline: generateSparkline(2585.50, 0.007),
    updatedAt: 'Just now'
  },
  {
    symbol: 'HG=F',
    name: 'Copper Futures',
    price: 4.22,
    change: 0.06,
    changePercent: 1.44,
    high: 4.25,
    low: 4.15,
    volume: '82K',
    assetClass: 'commodities',
    region: 'GLOBAL',
    sparkline: generateSparkline(4.22, 0.01),
    updatedAt: 'Just now'
  },
  // Crypto
  {
    symbol: 'BTC-USD',
    name: 'Bitcoin',
    price: 58450.00,
    change: 1420.00,
    changePercent: 2.49,
    high: 59100.00,
    low: 56800.00,
    volume: '28.4B',
    assetClass: 'crypto',
    region: 'GLOBAL',
    sparkline: generateSparkline(58450.00, 0.02),
    updatedAt: 'Just now'
  },
  {
    symbol: 'ETH-USD',
    name: 'Ethereum',
    price: 2360.80,
    change: 68.50,
    changePercent: 2.99,
    high: 2395.00,
    low: 2280.00,
    volume: '14.2B',
    assetClass: 'crypto',
    region: 'GLOBAL',
    sparkline: generateSparkline(2360.80, 0.025),
    updatedAt: 'Just now'
  },
  {
    symbol: '^TNX',
    name: 'US 10Y Treasury Yield',
    price: 3.66,
    change: -0.04,
    changePercent: -1.08,
    high: 3.71,
    low: 3.65,
    volume: 'N/A',
    assetClass: 'bonds',
    region: 'US',
    sparkline: generateSparkline(3.66, 0.008),
    updatedAt: 'Just now'
  }
];

export const INITIAL_SENTIMENT: MarketSentiment = {
  vixScore: 16.45,
  vixChange: -0.85,
  fearGreedScore: 62,
  fearGreedLabel: 'Greed',
  advancingStocks: 2140,
  decliningStocks: 1120,
  unchangedStocks: 180
};

export const SECTORS: SectorPerformance[] = [
  { symbol: 'XLK', name: 'Information Technology', changePercent: 1.42, weight: 31.5 },
  { symbol: 'XLC', name: 'Communication Services', changePercent: 0.98, weight: 8.9 },
  { symbol: 'XLY', name: 'Consumer Discretionary', changePercent: 0.75, weight: 10.2 },
  { symbol: 'XLF', name: 'Financials', changePercent: 0.35, weight: 12.8 },
  { symbol: 'XLE', name: 'Energy', changePercent: 1.85, weight: 3.6 },
  { symbol: 'XLV', name: 'Health Care', changePercent: -0.22, weight: 11.9 },
  { symbol: 'XLI', name: 'Industrials', changePercent: 0.18, weight: 8.4 },
  { symbol: 'XLP', name: 'Consumer Staples', changePercent: -0.45, weight: 5.8 },
  { symbol: 'XLB', name: 'Materials', changePercent: 0.62, weight: 2.3 },
  { symbol: 'XLU', name: 'Utilities', changePercent: -0.88, weight: 2.4 },
  { symbol: 'XLRE', name: 'Real Estate', changePercent: -0.54, weight: 2.2 }
];

export const BOND_YIELDS: BondYield[] = [
  { symbol: 'US3M', name: 'US 3 Month Bill', maturity: '3M', yieldVal: 4.92, changeBp: -2.1 },
  { symbol: 'US2Y', name: 'US 2 Year Note', maturity: '2Y', yieldVal: 3.58, changeBp: -4.8 },
  { symbol: 'US5Y', name: 'US 5 Year Note', maturity: '5Y', yieldVal: 3.48, changeBp: -4.2 },
  { symbol: 'US10Y', name: 'US 10 Year Note', maturity: '10Y', yieldVal: 3.66, changeBp: -3.8 },
  { symbol: 'US30Y', name: 'US 30 Year Bond', maturity: '30Y', yieldVal: 3.97, changeBp: -2.9 },
  { symbol: 'SPREAD_10_2', name: '10Y - 2Y Yield Spread', maturity: 'Spread', yieldVal: 0.08, changeBp: 1.0, isSpread: true }
];

export const CRYPTO_ASSETS: CryptoAsset[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 58450.00, change24h: 2.49, volume24h: '$28.4B', marketCap: '$1.15T', dominance: 56.4 },
  { symbol: 'ETH', name: 'Ethereum', price: 2360.80, change24h: 2.99, volume24h: '$14.2B', marketCap: '$284B', dominance: 14.1 },
  { symbol: 'SOL', name: 'Solana', price: 136.40, change24h: 4.82, volume24h: '$2.8B', marketCap: '$63.8B', dominance: 3.2 },
  { symbol: 'BNB', name: 'BNB', price: 542.10, change24h: 1.12, volume24h: '$850M', marketCap: '$79.2B', dominance: 3.9 },
  { symbol: 'XRP', name: 'XRP', price: 0.562, change24h: -0.84, volume24h: '$1.1B', marketCap: '$31.6B', dominance: 1.6 }
];

export const ECONOMIC_CALENDAR: EconomicEvent[] = [
  { id: '1', time: '21:30 KST', country: 'US', flag: '🇺🇸', event: 'Core CPI (MoM)', actual: '0.3%', forecast: '0.3%', previous: '0.2%', impact: 'High' },
  { id: '2', time: '21:30 KST', country: 'US', flag: '🇺🇸', event: 'Initial Jobless Claims', actual: '230K', forecast: '227K', previous: '228K', impact: 'Medium' },
  { id: '3', time: '23:00 KST', country: 'US', flag: '🇺🇸', event: 'Existing Home Sales', forecast: '3.92M', previous: '3.95M', impact: 'Medium' },
  { id: '4', time: 'Tomorrow 03:00', country: 'US', flag: '🇺🇸', event: 'FOMC Rate Decision', forecast: '5.25%', previous: '5.50%', impact: 'High' },
  { id: '5', time: 'Tomorrow 10:00', country: 'KR', flag: '🇰🇷', event: 'Bank of Korea Base Rate', forecast: '3.50%', previous: '3.50%', impact: 'High' }
];

export const MARKET_NEWS: MarketNews[] = [
  {
    id: 'n1',
    title: 'Fed Rate Cut Expectations Boost Tech Stocks as S&P 500 Approaches Record Highs',
    source: 'Bloomberg Financial',
    time: '8 mins ago',
    url: '#',
    category: 'Equities',
    sentiment: 'Bullish'
  },
  {
    id: 'n2',
    title: 'US 10-Year Treasury Yield Drops Below 3.70% Ahead of Key Inflation Data',
    source: 'Reuters',
    time: '24 mins ago',
    url: '#',
    category: 'Bonds',
    sentiment: 'Neutral'
  },
  {
    id: 'n3',
    title: 'WTI Crude Oil Rebounds 1.8% Following Middle East Supply Concerns and Inventory Drawdown',
    source: 'Financial Times',
    time: '45 mins ago',
    url: '#',
    category: 'Commodities',
    sentiment: 'Bullish'
  },
  {
    id: 'n4',
    title: 'USD/KRW Slips to 1,335 Won as Risk-On Sentiment Drives Asian Market Inflows',
    source: 'Korea Economic Daily',
    time: '1 hour ago',
    url: '#',
    category: 'Forex',
    sentiment: 'Bearish'
  },
  {
    id: 'n5',
    title: 'Bitcoin Reclaims $58,000 Level as Institutional ETF Inflows Resume',
    source: 'CoinDesk',
    time: '2 hours ago',
    url: '#',
    category: 'Crypto',
    sentiment: 'Bullish'
  }
];

export function generateHistoricalChart(symbol: string, timeframe: string): ChartDataPoint[] {
  let pointsCount = 40;
  let basePrice = 5648.40;
  let volatility = 0.01;

  if (symbol.includes('IXIC')) { basePrice = 17683.25; volatility = 0.015; }
  else if (symbol.includes('DJI')) { basePrice = 40345.10; volatility = 0.008; }
  else if (symbol.includes('BTC')) { basePrice = 58450.00; volatility = 0.025; }
  else if (symbol.includes('CL=')) { basePrice = 69.45; volatility = 0.02; }
  else if (symbol.includes('KRW')) { basePrice = 1335.50; volatility = 0.004; }
  else if (symbol.includes('GC=')) { basePrice = 2585.50; volatility = 0.009; }

  if (timeframe === '1D') pointsCount = 24;
  if (timeframe === '1W') pointsCount = 35;
  if (timeframe === '1M') pointsCount = 30;
  if (timeframe === '1Y') pointsCount = 52;

  const data: ChartDataPoint[] = [];
  let price = basePrice * (1 - volatility * (pointsCount / 4));
  const now = new Date();

  for (let i = pointsCount; i >= 0; i--) {
    let dateStr = '';
    if (timeframe === '1D') {
      const d = new Date(now.getTime() - i * 30 * 60 * 1000);
      dateStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (timeframe === '1W' || timeframe === '1M') {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
    } else {
      const d = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      dateStr = `${d.getFullYear().toString().substring(2)}/${d.getMonth() + 1}/${d.getDate()}`;
    }

    const delta = (Math.random() - 0.47) * volatility * price;
    const open = price;
    const close = price + delta;
    const high = Math.max(open, close) + Math.random() * volatility * price * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * price * 0.5;
    const volume = Math.floor(Math.random() * 500000 + 100000);
    price = close;

    data.push({
      time: dateStr,
      price: Number(close.toFixed(2)),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
      sma20: Number((close * (0.99 + Math.sin(i / 3) * 0.015)).toFixed(2)),
      rsi: Number((50 + Math.sin(i / 2) * 22).toFixed(1))
    });
  }

  return data;
}
