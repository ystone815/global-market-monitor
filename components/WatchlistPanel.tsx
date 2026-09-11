'use client';

import React from 'react';
import { MarketQuote } from '@/lib/types';
import { Bookmark, Trash2, ArrowUpRight } from 'lucide-react';

interface WatchlistPanelProps {
  watchlistSymbols: string[];
  quotes: MarketQuote[];
  onSelectQuote: (quote: MarketQuote) => void;
  onRemoveFromWatchlist: (symbol: string) => void;
}

export function WatchlistPanel({
  watchlistSymbols,
  quotes,
  onSelectQuote,
  onRemoveFromWatchlist
}: WatchlistPanelProps) {
  const bookmarkedQuotes = quotes.filter((q) => watchlistSymbols.includes(q.symbol));

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Bookmark className="w-4 h-4 fill-amber-400" />
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">Your Watchlist</h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">{bookmarkedQuotes.length} Saved</span>
      </div>

      {bookmarkedQuotes.length === 0 ? (
        <div className="text-center py-6 text-slate-500 text-xs">
          No saved assets. Click the bookmark icon on any market card to pin it here.
        </div>
      ) : (
        <div className="space-y-2">
          {bookmarkedQuotes.map((item) => {
            const isPos = item.change >= 0;
            return (
              <div
                key={item.symbol}
                onClick={() => onSelectQuote(item)}
                className="glass-pill p-2.5 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-800/80 border border-slate-800 transition-colors"
              >
                <div>
                  <span className="text-xs font-bold text-slate-200 block">{item.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">{item.symbol}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right font-mono">
                    <span className="text-xs font-bold text-white block">
                      {item.price.toLocaleString(undefined, { minimumFractionDigits: item.price < 10 ? 3 : 2 })}
                    </span>
                    <span className={`text-[10px] ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPos ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromWatchlist(item.symbol);
                    }}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
