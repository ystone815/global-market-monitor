'use client';

import React from 'react';
import { MarketQuote } from '@/lib/types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerTapeProps {
  quotes: MarketQuote[];
  onSelectQuote?: (quote: MarketQuote) => void;
}

export function TickerTape({ quotes, onSelectQuote }: TickerTapeProps) {
  // Duplicate array for smooth infinite scrolling loop
  const tickerItems = [...quotes, ...quotes];

  return (
    <div className="w-full bg-slate-950/80 border-b border-slate-800/60 overflow-hidden py-2 shadow-inner">
      <div className="animate-marquee flex items-center space-x-6 whitespace-nowrap">
        {tickerItems.map((item, idx) => {
          const isPositive = item.change >= 0;
          return (
            <div
              key={`${item.symbol}-${idx}`}
              onClick={() => onSelectQuote?.(item)}
              className="inline-flex items-center space-x-2.5 px-3 py-1 rounded-lg bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800/80 cursor-pointer transition-colors"
            >
              <span className="text-xs font-semibold text-slate-300">{item.name}</span>
              <span className="text-xs font-mono font-medium text-white">
                {item.price.toLocaleString(undefined, { minimumFractionDigits: item.price < 10 ? 3 : 2 })}
              </span>
              <span
                className={`inline-flex items-center text-[11px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                  isPositive
                    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                    : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                )}
                {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
