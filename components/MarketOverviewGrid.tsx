'use client';

import React from 'react';
import { MarketQuote } from '@/lib/types';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, ChevronRight, Bookmark } from 'lucide-react';

interface MarketOverviewGridProps {
  quotes: MarketQuote[];
  selectedQuote: MarketQuote | null;
  onSelectQuote: (quote: MarketQuote) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
}

export function MarketOverviewGrid({
  quotes,
  selectedQuote,
  onSelectQuote,
  watchlist,
  onToggleWatchlist
}: MarketOverviewGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {quotes.map((item) => {
        const isPositive = item.change >= 0;
        const isSelected = selectedQuote?.symbol === item.symbol;
        const isBookmarked = watchlist.includes(item.symbol);

        // Calculate position in Day's High/Low Range
        const rangeSpan = item.high - item.low || 1;
        const currentPosPercent = Math.min(Math.max(((item.price - item.low) / rangeSpan) * 100, 0), 100);

        return (
          <div
            key={item.symbol}
            onClick={() => onSelectQuote(item)}
            className={`glass-panel glass-panel-hover rounded-2xl p-4 cursor-pointer relative overflow-hidden transition-all border ${
              isSelected
                ? 'border-indigo-500/80 ring-2 ring-indigo-500/30 bg-slate-900/90'
                : 'border-slate-800/80 hover:border-slate-700/80'
            }`}
          >
            {/* Top Bar: Symbol & Region & Bookmark */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/50">
                  {item.symbol}
                </span>
                <span className="text-[10px] font-medium text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                  {item.region}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWatchlist(item.symbol);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  isBookmarked
                    ? 'text-amber-400 bg-amber-500/10'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
                }`}
                title={isBookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
              </button>
            </div>

            {/* Name */}
            <h3 className="text-sm font-bold text-slate-200 truncate mb-3">{item.name}</h3>

            {/* Price & Sparkline Row */}
            <div className="grid grid-cols-12 gap-2 items-center mb-3">
              <div className="col-span-7">
                <div className="text-2xl font-bold font-mono tracking-tight text-white">
                  {item.price.toLocaleString(undefined, { minimumFractionDigits: item.price < 10 ? 3 : 2 })}
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className={`inline-flex items-center text-xs font-mono font-semibold px-2 py-0.5 rounded-md ${
                      isPositive
                        ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                        : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                    }`}
                  >
                    {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {isPositive ? '+' : ''}{item.change.toFixed(2)} ({isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>

              {/* Sparkline Chart */}
              <div className="col-span-5 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={item.sparkline}>
                    <defs>
                      <linearGradient id={`grad-${item.symbol}`} x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={isPositive ? '#10b981' : '#f43f5e'}
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor={isPositive ? '#10b981' : '#f43f5e'}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={isPositive ? '#10b981' : '#f43f5e'}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill={`url(#grad-${item.symbol})`}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Day High / Low Progress Range Bar */}
            <div className="pt-2 border-t border-slate-800/60">
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>L: {item.low.toLocaleString()}</span>
                <span className="text-slate-500">Day Range</span>
                <span>H: {item.high.toLocaleString()}</span>
              </div>
              <div className="relative w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 bottom-0 left-0 rounded-full ${
                    isPositive ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${currentPosPercent}%` }}
                ></div>
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}
