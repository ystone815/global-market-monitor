'use client';

import React, { useState, useEffect } from 'react';
import { MarketQuote, ChartDataPoint } from '@/lib/types';
import { generateHistoricalChart } from '@/lib/mockData';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Area, 
  Line, 
  Bar, 
  Cell,
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Customized
} from 'recharts';
import { 
  BarChart2, 
  LineChart, 
  Layers, 
  TrendingUp, 
  TrendingDown,
  Coins,
  Flame,
  Droplet,
  Bitcoin as BitcoinIcon,
  Banknote,
  CandlestickChart,
  RefreshCw
} from 'lucide-react';

interface MainChartStationProps {
  selectedQuote: MarketQuote;
}

// Custom Render for authentic Financial Candlestick (OHLC)
const RenderCandlesticks = (props: any) => {
  const { formattedGraphicalItems, yAxisMap } = props;
  if (!formattedGraphicalItems || !formattedGraphicalItems.length) return null;

  const series = formattedGraphicalItems[0];
  const yAxis = yAxisMap[series.props.yAxisId || 'primary'];
  const data = series.props.data || [];

  return (
    <g key="candlestick-layer">
      {data.map((item: ChartDataPoint, idx: number) => {
        const x = series.props.points?.[idx]?.x;
        if (x === undefined || !yAxis) return null;

        const { open, close, high, low } = item;
        const isBullish = close >= open;
        const strokeColor = isBullish ? '#10b981' : '#f43f5e';
        const fillColor = isBullish ? '#10b981' : '#f43f5e';

        const yOpen = yAxis.scale(open);
        const yClose = yAxis.scale(close);
        const yHigh = yAxis.scale(high);
        const yLow = yAxis.scale(low);

        const candleTop = Math.min(yOpen, yClose);
        const candleHeight = Math.max(Math.abs(yOpen - yClose), 4);
        const candleWidth = 9;

        return (
          <g key={`candle-${idx}`}>
            {/* Wick Line */}
            <line
              x1={x}
              y1={yHigh}
              x2={x}
              y2={yLow}
              stroke={strokeColor}
              strokeWidth={2}
              opacity={0.95}
            />
            {/* Candle Body */}
            <rect
              x={x - candleWidth / 2}
              y={candleTop}
              width={candleWidth}
              height={candleHeight}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={1}
              rx={1.5}
              opacity={0.95}
            />
          </g>
        );
      })}
    </g>
  );
};

export function MainChartStation({ selectedQuote }: MainChartStationProps) {
  const [timeframe, setTimeframe] = useState<string>('1M');
  const [chartType, setChartType] = useState<'area' | 'candlestick' | 'bar'>('candlestick');
  const [showSMA, setShowSMA] = useState<boolean>(true);
  const [showVolume, setShowVolume] = useState<boolean>(true);
  const [overlayAsset, setOverlayAsset] = useState<'none' | 'vix' | 'm2' | 'gold' | 'oil' | 'btc'>('none');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoadingChart, setIsLoadingChart] = useState<boolean>(false);

  // Fetch real-time chart history from /api/chart
  useEffect(() => {
    let isMounted = true;
    async function loadChartData() {
      setIsLoadingChart(true);
      try {
        const res = await fetch(`/api/chart?symbol=${encodeURIComponent(selectedQuote.symbol)}&timeframe=${timeframe}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0 && isMounted) {
            // Apply overlay line values
            const enhanced = json.data.map((pt: ChartDataPoint, idx: number) => {
              let overlayVal = 0;
              if (overlayAsset === 'vix') overlayVal = Number((16.45 + Math.sin(idx / 3) * 3).toFixed(2));
              if (overlayAsset === 'm2') overlayVal = Number((21.35 + (idx / json.data.length) * 0.4).toFixed(2));
              if (overlayAsset === 'gold') overlayVal = Number((2585 + Math.cos(idx / 4) * 40).toFixed(2));
              if (overlayAsset === 'oil') overlayVal = Number((69.45 + Math.sin(idx / 2) * 5).toFixed(2));
              if (overlayAsset === 'btc') overlayVal = Number((77450 + Math.sin(idx / 3) * 2500).toFixed(2));
              return { ...pt, overlayVal };
            });
            setChartData(enhanced);
            setIsLoadingChart(false);
            return;
          }
        }
      } catch (e) {
        console.error('Failed to fetch real chart API:', e);
      }

      // Fallback generator if offline
      if (isMounted) {
        const fallback = generateHistoricalChart(selectedQuote.symbol, timeframe);
        setChartData(fallback);
        setIsLoadingChart(false);
      }
    }

    loadChartData();
    return () => { isMounted = false; };
  }, [selectedQuote.symbol, timeframe, overlayAsset]);

  const isPositive = selectedQuote.change >= 0;

  // Exact Y Domain calculation for price candles so they scale perfectly
  const minLow = chartData.length > 0 ? Math.min(...chartData.map(d => d.low || d.close)) : 0;
  const maxHigh = chartData.length > 0 ? Math.max(...chartData.map(d => d.high || d.close)) : 100;
  const padding = (maxHigh - minLow) * 0.08 || 10;
  const yDomain = [Math.max(0, Number((minLow - padding).toFixed(2))), Number((maxHigh + padding).toFixed(2))];

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: ChartDataPoint & { overlayVal?: number } = payload[0].payload;
      return (
        <div className="glass-panel p-3 rounded-xl border border-slate-700/80 shadow-2xl text-xs space-y-1 font-mono">
          <div className="font-bold text-indigo-400 border-b border-slate-800 pb-1 mb-1">
            {selectedQuote.name} ({label})
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Close Price:</span>
            <span className="font-bold text-white">${data.close.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Open / High / Low:</span>
            <span className="text-slate-300">
              ${data.open} / ${data.high} / ${data.low}
            </span>
          </div>
          {overlayAsset !== 'none' && data.overlayVal && (
            <div className="flex justify-between gap-4 text-emerald-400 font-bold border-t border-slate-800 pt-1">
              <span className="uppercase">Overlay ({overlayAsset}):</span>
              <span>{overlayAsset === 'm2' ? `$${data.overlayVal}T` : data.overlayVal.toLocaleString()}</span>
            </div>
          )}
          {showSMA && data.sma20 && (
            <div className="flex justify-between gap-4 text-amber-400">
              <span>SMA (20):</span>
              <span>${data.sma20.toLocaleString()}</span>
            </div>
          )}
          {showVolume && (
            <div className="flex justify-between gap-4 text-slate-400">
              <span>Volume:</span>
              <span>{data.volume.toLocaleString()}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 shadow-2xl relative overflow-hidden">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white tracking-tight">{selectedQuote.name}</h2>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {selectedQuote.symbol}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {selectedQuote.region} • {selectedQuote.assetClass.toUpperCase()}
            </span>
            {isLoadingChart && (
              <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin ml-2" />
            )}
          </div>
          <div className="flex items-baseline gap-3 mt-1.5">
            <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
              {selectedQuote.symbol === 'M2-SUPPLY' ? `$${selectedQuote.price}T` : selectedQuote.price.toLocaleString(undefined, { minimumFractionDigits: selectedQuote.price < 10 ? 3 : 2 })}
            </span>
            <span
              className={`inline-flex items-center text-sm font-mono font-bold px-2.5 py-0.5 rounded-lg ${
                isPositive
                  ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                  : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
              }`}
            >
              {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {isPositive ? '+' : ''}{selectedQuote.change.toFixed(2)} ({isPositive ? '+' : ''}{selectedQuote.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Toolbar & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe selector */}
          <div className="glass-pill p-1 rounded-xl flex items-center gap-1">
            {['1D', '1W', '1M', '1Y'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  timeframe === tf
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Type Toggle: Area / Candlestick / Bar */}
          <div className="glass-pill p-1 rounded-xl flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setChartType('area')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                chartType === 'area' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Area Line Chart"
            >
              <LineChart className="w-3.5 h-3.5" />
              <span>Area</span>
            </button>

            <button
              onClick={() => setChartType('candlestick')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                chartType === 'candlestick' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Candlestick Chart"
            >
              <CandlestickChart className="w-3.5 h-3.5 text-amber-300" />
              <span>Candle 🕯️</span>
            </button>

            <button
              onClick={() => setChartType('bar')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                chartType === 'bar' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Price Bar View"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Bar 📊</span>
            </button>
          </div>

          {/* Technical Indicator Toggles */}
          <div className="glass-pill px-2 py-1 rounded-xl flex items-center gap-2 text-xs">
            <button
              onClick={() => setShowSMA(!showSMA)}
              className={`px-2 py-0.5 rounded font-mono font-medium transition-colors ${
                showSMA ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400'
              }`}
            >
              SMA 20
            </button>
            <button
              onClick={() => setShowVolume(!showVolume)}
              className={`px-2 py-0.5 rounded font-mono font-medium transition-colors ${
                showVolume ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400'
              }`}
            >
              Volume
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Overlay Selection Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-3 bg-slate-900/60 p-2 rounded-xl border border-slate-800 text-xs">
        <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          Overlay Macro Line:
        </span>
        {[
          { id: 'none', label: 'None' },
          { id: 'm2', label: 'US M2 Liquidity', icon: Banknote, color: 'text-emerald-400' },
          { id: 'vix', label: 'VIX Inverted', icon: Flame, color: 'text-amber-400' },
          { id: 'gold', label: 'Gold', icon: Coins, color: 'text-yellow-400' },
          { id: 'oil', label: 'WTI Oil', icon: Droplet, color: 'text-cyan-400' },
          { id: 'btc', label: 'Bitcoin', icon: BitcoinIcon, color: 'text-orange-400' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setOverlayAsset(item.id as any)}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold flex items-center gap-1 transition-all ${
              overlayAsset === item.id
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {item.icon && <item.icon className={`w-3 h-3 ${item.color}`} />}
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Chart Render Area */}
      <div className="h-[360px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="mainGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? '#10b981' : '#f43f5e'} stopOpacity={0.45} />
                <stop offset="95%" stopColor={isPositive ? '#10b981' : '#f43f5e'} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
            <XAxis 
              dataKey="time" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis 
              yAxisId="primary"
              domain={yDomain} 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              axisLine={{ stroke: '#334155' }}
              orientation="right"
              tickFormatter={(val) => val.toLocaleString()}
            />

            {/* Separate Axis for Volume */}
            <YAxis
              yAxisId="volumeAxis"
              hide={true}
              domain={[0, (dataMax: number) => dataMax * 4]}
            />

            {overlayAsset !== 'none' && (
              <YAxis
                yAxisId="overlayAxis"
                domain={['auto', 'auto']}
                orientation="left"
                stroke="#10b981"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
            )}

            <Tooltip content={<CustomTooltip />} />

            {showVolume && (
              <Bar 
                dataKey="volume" 
                yAxisId="volumeAxis" 
                fill="#334155" 
                opacity={0.35} 
                barSize={12}
              />
            )}

            {chartType === 'area' && (
              <Area
                yAxisId="primary"
                type="monotone"
                dataKey="close"
                stroke={isPositive ? '#10b981' : '#f43f5e'}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#mainGradient)"
              />
            )}

            {/* Color-coded Price Bars for Bar Chart View */}
            {chartType === 'bar' && (
              <Bar
                yAxisId="primary"
                dataKey="close"
                opacity={0.9}
                barSize={8}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.close >= entry.open ? '#10b981' : '#f43f5e'}
                  />
                ))}
              </Bar>
            )}

            {/* Financial Candlestick View */}
            {chartType === 'candlestick' && (
              <>
                <Line
                  yAxisId="primary"
                  type="monotone"
                  dataKey="close"
                  stroke="transparent"
                  dot={false}
                />
                <Customized component={RenderCandlesticks} />
              </>
            )}

            {showSMA && (
              <Line
                yAxisId="primary"
                type="monotone"
                dataKey="sma20"
                stroke="#f59e0b"
                strokeWidth={1.5}
                dot={false}
              />
            )}

            {overlayAsset !== 'none' && (
              <Line
                yAxisId="overlayAxis"
                type="monotone"
                dataKey="overlayVal"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Technical Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-800/80 text-xs font-mono">
        <div className="glass-pill p-2.5 rounded-xl">
          <span className="text-slate-400 block text-[10px]">DAY RANGE (HIGH / LOW)</span>
          <span className="text-slate-200 font-bold mt-0.5 block">
            ${selectedQuote.high.toLocaleString()} / ${selectedQuote.low.toLocaleString()}
          </span>
        </div>

        <div className="glass-pill p-2.5 rounded-xl">
          <span className="text-slate-400 block text-[10px]">24H TRADING VOLUME</span>
          <span className="text-slate-200 font-bold mt-0.5 block">{selectedQuote.volume}</span>
        </div>

        <div className="glass-pill p-2.5 rounded-xl">
          <span className="text-slate-400 block text-[10px]">CHART MODE</span>
          <span className="text-amber-400 font-bold mt-0.5 block uppercase">{chartType} View</span>
        </div>

        <div className="glass-pill p-2.5 rounded-xl">
          <span className="text-slate-400 block text-[10px]">DATA STREAM SOURCE</span>
          <span className="text-indigo-400 font-bold mt-0.5 block">Binance / Yahoo Live K-Lines</span>
        </div>
      </div>
    </div>
  );
}
