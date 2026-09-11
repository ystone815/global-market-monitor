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
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  BarChart2, 
  LineChart, 
  Layers, 
  Sliders, 
  Maximize2, 
  TrendingUp, 
  TrendingDown,
  Info 
} from 'lucide-react';

interface MainChartStationProps {
  selectedQuote: MarketQuote;
}

export function MainChartStation({ selectedQuote }: MainChartStationProps) {
  const [timeframe, setTimeframe] = useState<string>('1M');
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [showSMA, setShowSMA] = useState<boolean>(true);
  const [showVolume, setShowVolume] = useState<boolean>(true);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    const data = generateHistoricalChart(selectedQuote.symbol, timeframe);
    setChartData(data);
  }, [selectedQuote.symbol, timeframe]);

  const isPositive = selectedQuote.change >= 0;

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: ChartDataPoint = payload[0].payload;
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
          </div>
          <div className="flex items-baseline gap-3 mt-1.5">
            <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
              {selectedQuote.price.toLocaleString(undefined, { minimumFractionDigits: selectedQuote.price < 10 ? 3 : 2 })}
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

          {/* Chart Type Toggle */}
          <div className="glass-pill p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setChartType('area')}
              className={`p-1.5 rounded-lg transition-colors ${
                chartType === 'area' ? 'bg-slate-700 text-indigo-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Area Line Chart"
            >
              <LineChart className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-1.5 rounded-lg transition-colors ${
                chartType === 'bar' ? 'bg-slate-700 text-indigo-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Bar / Volume View"
            >
              <BarChart2 className="w-4 h-4" />
            </button>
          </div>

          {/* Indicator Toggles */}
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

      {/* Main Chart Render Area */}
      <div className="h-[360px] w-full">
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
              domain={['auto', 'auto']} 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              axisLine={{ stroke: '#334155' }}
              orientation="right"
              tickFormatter={(val) => val.toLocaleString()}
            />
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

            {chartType === 'area' ? (
              <Area
                type="monotone"
                dataKey="close"
                stroke={isPositive ? '#10b981' : '#f43f5e'}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#mainGradient)"
              />
            ) : (
              <Bar
                dataKey="close"
                fill={isPositive ? '#10b981' : '#f43f5e'}
                opacity={0.85}
              />
            )}

            {showSMA && (
              <Line
                type="monotone"
                dataKey="sma20"
                stroke="#f59e0b"
                strokeWidth={1.5}
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
          <span className="text-slate-400 block text-[10px]">RELATIVE STRENGTH (RSI)</span>
          <span className="text-emerald-400 font-bold mt-0.5 block">58.4 (Neutral-Bullish)</span>
        </div>

        <div className="glass-pill p-2.5 rounded-xl">
          <span className="text-slate-400 block text-[10px]">UPDATE FREQUENCY</span>
          <span className="text-indigo-400 font-bold mt-0.5 block">Real-time Tick Stream</span>
        </div>
      </div>
    </div>
  );
}
