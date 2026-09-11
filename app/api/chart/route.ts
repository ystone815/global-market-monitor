import { NextResponse } from 'next/server';

interface ChartPoint {
  time: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma20?: number;
}

// Fetch historical K-line candles from Binance for Crypto
async function fetchBinanceKlines(symbol: string, timeframe: string): Promise<ChartPoint[] | null> {
  let interval = '1d';
  let limit = 30;
  if (timeframe === '1D') { interval = '15m'; limit = 24; }
  if (timeframe === '1W') { interval = '1h'; limit = 35; }
  if (timeframe === '1M') { interval = '1d'; limit = 30; }
  if (timeframe === '1Y') { interval = '1w'; limit = 52; }

  let binanceSymbol = 'BTCUSDT';
  if (symbol.includes('ETH')) binanceSymbol = 'ETHUSDT';
  if (symbol.includes('SOL')) binanceSymbol = 'SOLUSDT';

  try {
    const res = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=${interval}&limit=${limit}`,
      { cache: 'no-store' }
    );
    if (res.ok) {
      const raw = await res.json();
      const points: ChartPoint[] = raw.map((k: any) => {
        const openTime = new Date(k[0]);
        let timeStr = `${openTime.getMonth() + 1}/${openTime.getDate()}`;
        if (timeframe === '1D') {
          timeStr = openTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        const open = Number(parseFloat(k[1]).toFixed(2));
        const high = Number(parseFloat(k[2]).toFixed(2));
        const low = Number(parseFloat(k[3]).toFixed(2));
        const close = Number(parseFloat(k[4]).toFixed(2));
        const volume = Math.round(parseFloat(k[5]));

        return {
          time: timeStr,
          price: close,
          open,
          high,
          low,
          close,
          volume
        };
      });

      // Calculate SMA 20
      return points.map((pt, idx, arr) => {
        let sma20 = pt.close;
        if (idx >= 19) {
          const slice = arr.slice(idx - 19, idx + 1);
          const sum = slice.reduce((acc, curr) => acc + curr.close, 0);
          sma20 = Number((sum / 20).toFixed(2));
        }
        return { ...pt, sma20 };
      });
    }
  } catch (e) {
    console.error('Binance klines fetch error:', e);
  }
  return null;
}

// Fetch historical chart candles from Yahoo Finance
async function fetchYahooChart(symbol: string, timeframe: string): Promise<ChartPoint[] | null> {
  let range = '1mo';
  let interval = '1d';

  if (timeframe === '1D') { range = '1d'; interval = '15m'; }
  if (timeframe === '1W') { range = '5d'; interval = '30m'; }
  if (timeframe === '1M') { range = '1mo'; interval = '1d'; }
  if (timeframe === '1Y') { range = '1y'; interval = '1wk'; }

  let yahooSymbol = symbol;
  if (symbol === 'M2-SUPPLY') yahooSymbol = '^GSPC';

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      yahooSymbol
    )}?range=${range}&interval=${interval}`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      cache: 'no-store'
    });

    if (res.ok) {
      const json = await res.json();
      const result = json?.chart?.result?.[0];
      const timestamps = result?.timestamp || [];
      const quote = result?.indicators?.quote?.[0] || {};
      const opens = quote.open || [];
      const highs = quote.high || [];
      const lows = quote.low || [];
      const closes = quote.close || [];
      const volumes = quote.volume || [];

      const points: ChartPoint[] = [];

      for (let i = 0; i < timestamps.length; i++) {
        if (closes[i] !== null && closes[i] !== undefined && !isNaN(closes[i])) {
          const t = new Date(timestamps[i] * 1000);
          let timeStr = `${t.getMonth() + 1}/${t.getDate()}`;
          if (timeframe === '1D' || timeframe === '1W') {
            timeStr = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }

          const close = Number(closes[i].toFixed(2));
          const open = Number((opens[i] ?? close).toFixed(2));
          const high = Number((highs[i] ?? Math.max(open, close)).toFixed(2));
          const low = Number((lows[i] ?? Math.min(open, close)).toFixed(2));
          const volume = volumes[i] || 10000;

          points.push({
            time: timeStr,
            price: close,
            open,
            high: Math.max(high, open, close),
            low: Math.min(low, open, close),
            close,
            volume
          });
        }
      }

      if (points.length > 0) {
        return points.map((pt, idx, arr) => {
          let sma20 = pt.close;
          if (idx >= 19) {
            const slice = arr.slice(idx - 19, idx + 1);
            const sum = slice.reduce((acc, curr) => acc + curr.close, 0);
            sma20 = Number((sum / 20).toFixed(2));
          }
          return { ...pt, sma20 };
        });
      }
    }
  } catch (e) {
    console.warn(`Yahoo chart fetch fallback for ${symbol}`);
  }
  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || '^GSPC';
  const timeframe = searchParams.get('timeframe') || '1M';

  let data: ChartPoint[] | null = null;

  if (symbol.includes('BTC') || symbol.includes('ETH') || symbol.includes('SOL')) {
    data = await fetchBinanceKlines(symbol, timeframe);
  } else {
    data = await fetchYahooChart(symbol, timeframe);
  }

  return NextResponse.json({
    status: 'ok',
    symbol,
    timeframe,
    data: data || []
  });
}
