import { NextResponse } from 'next/server';
import { INITIAL_QUOTES, INITIAL_SENTIMENT, SECTORS, BOND_YIELDS, CRYPTO_ASSETS, ECONOMIC_CALENDAR, MARKET_NEWS } from '@/lib/mockData';

// Fetch real-time crypto price from Binance Public API
async function fetchBinanceLiveCrypto() {
  try {
    const res = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT', {
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      const price = parseFloat(data.lastPrice);
      const change = parseFloat(data.priceChange);
      const changePercent = parseFloat(data.priceChangePercent);
      const high = parseFloat(data.highPrice);
      const low = parseFloat(data.lowPrice);
      const volume = `${(parseFloat(data.quoteVolume) / 1e9).toFixed(1)}B`;

      return {
        price,
        change,
        changePercent,
        high,
        low,
        volume
      };
    }
  } catch (e) {
    console.error('Binance API fetch warning:', e);
  }
  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const assetClass = searchParams.get('assetClass');

  // Try live Binance crypto API for real-time BTC price ($77k+)
  const liveBtc = await fetchBinanceLiveCrypto();

  const quotes = INITIAL_QUOTES.map(quote => {
    if (quote.symbol === 'BTC-USD' && liveBtc) {
      return {
        ...quote,
        price: liveBtc.price,
        change: liveBtc.change,
        changePercent: liveBtc.changePercent,
        high: liveBtc.high,
        low: liveBtc.low,
        volume: liveBtc.volume,
        updatedAt: 'Binance Live'
      };
    }

    // Micro jitter for real-time market feel
    const jitter = (Math.random() - 0.49) * 0.002 * quote.price;
    const newPrice = Number((quote.price + jitter).toFixed(quote.price < 10 ? 4 : 2));
    const newChange = Number((quote.change + jitter).toFixed(2));
    const newChangePercent = Number(((newChange / (quote.price - quote.change)) * 100).toFixed(2));

    return {
      ...quote,
      price: newPrice,
      change: newChange,
      changePercent: newChangePercent,
      updatedAt: new Date().toLocaleTimeString()
    };
  });

  // Also update cryptoAssets array for BTC
  const cryptoAssets = CRYPTO_ASSETS.map(c => {
    if (c.symbol === 'BTC' && liveBtc) {
      return {
        ...c,
        price: liveBtc.price,
        change24h: liveBtc.changePercent,
        volume24h: `$${liveBtc.volume}`
      };
    }
    return c;
  });

  let filteredQuotes = quotes;
  if (assetClass && assetClass !== 'all') {
    filteredQuotes = quotes.filter(q => q.assetClass === assetClass);
  }

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    quotes: filteredQuotes,
    sentiment: INITIAL_SENTIMENT,
    sectors: SECTORS,
    bondYields: BOND_YIELDS,
    crypto: cryptoAssets,
    calendar: ECONOMIC_CALENDAR,
    news: MARKET_NEWS
  });
}
