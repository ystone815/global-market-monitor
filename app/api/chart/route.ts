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
  let targetLimit = 30;
  if (timeframe === '1D') { interval = '15m'; targetLimit = 24; }
  if (timeframe === '1W') { interval = '1h'; targetLimit = 35; }
  if (timeframe === '1M') { interval = '1d'; targetLimit = 30; }
  if (timeframe === '1Y') { interval = '1w'; targetLimit = 52; }

  // Fetch extra 20 points for proper 20-period SMA lookback
  const fetchLimit = targetLimit + 20;

  let binanceSymbol = 'BTCUSDT';
  if (symbol.includes('ETH')) binanceSymbol = 'ETHUSDT';
  if (symbol.includes('SOL')) binanceSymbol = 'SOLUSDT';

  try {
    const res = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=${interval}&limit=${fetchLimit}`,
      { cache: 'no-store' }
    );
    if (res.ok) {
      const raw = await res.json();
      const allPoints: ChartPoint[] = raw.map((k: any) => {
        const openTime = new Date(k[0]);
        let timeStr = `${openTime.getMonth() + 1}/${openTime.getDate()}`;
        if (timeframe === '1D') {
          timeStr = openTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (timeframe === '1W') {
          const m = openTime.getMonth() + 1;
          const d = openTime.getDate();
          const hh = openTime.getHours().toString().padStart(2, '0');
          timeStr = `${m}/${d} ${hh}:00`;
        } else if (timeframe === '1Y') {
          const yy = openTime.getFullYear().toString().substring(2);
          const m = openTime.getMonth() + 1;
          const d = openTime.getDate();
          timeStr = `${yy}/${m}/${d}`;
        }

        const open = Number(parseFloat(k[1]).toFixed(2));
        const high = Number(parseFloat(k[2]).toFixed(2));
        const low = Number(parseFloat(k[3]).toFixed(2));
        const close = Number(parseFloat(k[4]).toFixed(2));
        // k[7] is USDT volume (in USD thousands)
        const volume = Math.round(parseFloat(k[7]) / 1000);

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

      // Calculate SMA 20 with exact lookback across all points
      const withSMA = allPoints.map((pt, idx, arr) => {
        if (idx >= 19) {
          const slice = arr.slice(idx - 19, idx + 1);
          const sum = slice.reduce((acc, curr) => acc + curr.close, 0);
          const sma20 = Number((sum / 20).toFixed(2));
          return { ...pt, sma20 };
        }
        return { ...pt, sma20: pt.close };
      });

      // Return exact targetLimit points with smooth SMA 20!
      return withSMA.slice(-targetLimit);
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
  if (timeframe === '1M') { range = '3mo'; interval = '1d'; }
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
          if (timeframe === '1D') {
            timeStr = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          } else if (timeframe === '1W') {
            const m = t.getMonth() + 1;
            const d = t.getDate();
            const hh = t.getHours().toString().padStart(2, '0');
            timeStr = `${m}/${d} ${hh}:00`;
          } else if (timeframe === '1Y') {
            const yy = t.getFullYear().toString().substring(2);
            const m = t.getMonth() + 1;
            const d = t.getDate();
            timeStr = `${yy}/${m}/${d}`;
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
        const withSMA = points.map((pt, idx, arr) => {
          let sma20 = pt.close;
          if (idx >= 19) {
            const slice = arr.slice(idx - 19, idx + 1);
            const sum = slice.reduce((acc, curr) => acc + curr.close, 0);
            sma20 = Number((sum / 20).toFixed(2));
          } else if (arr.length >= 5) {
            const slice = arr.slice(0, idx + 1);
            const sum = slice.reduce((acc, curr) => acc + curr.close, 0);
            sma20 = Number((sum / slice.length).toFixed(2));
          }
          return { ...pt, sma20 };
        });

        if (timeframe === '1M' && withSMA.length > 30) {
          return withSMA.slice(-30);
        }
        return withSMA;
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
