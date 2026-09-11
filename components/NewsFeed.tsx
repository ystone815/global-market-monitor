'use client';

import React from 'react';
import { MarketNews } from '@/lib/types';
import { Newspaper, ExternalLink } from 'lucide-react';

interface NewsFeedProps {
  news: MarketNews[];
}

export function NewsFeed({ news }: NewsFeedProps) {
  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Newspaper className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">Breaking Global News</h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">Live Wire</span>
      </div>

      <div className="space-y-3">
        {news.map((item) => (
          <div
            key={item.id}
            className="glass-pill p-3.5 rounded-xl border border-slate-800/60 hover:border-indigo-500/40 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                {item.category}
              </span>

              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  item.sentiment === 'Bullish'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : item.sentiment === 'Bearish'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-slate-700/50 text-slate-300'
                }`}
              >
                {item.sentiment}
              </span>
            </div>

            <h4 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors leading-snug">
              {item.title}
            </h4>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
              <span>{item.source} • {item.time}</span>
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-indigo-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
