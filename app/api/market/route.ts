import { NextResponse } from 'next/server';
import { INITIAL_QUOTES, INITIAL_SENTIMENT, SECTORS, BOND_YIELDS, CRYPTO_ASSETS, ECONOMIC_CALENDAR, MARKET_NEWS } from '@/lib/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const assetClass = searchParams.get('assetClass');

  // Slight micro-jitter simulation to reflect live API server response
  const quotes = INITIAL_QUOTES.map(quote => {
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
    crypto: CRYPTO_ASSETS,
    calendar: ECONOMIC_CALENDAR,
    news: MARKET_NEWS
  });
}
