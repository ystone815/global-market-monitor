'use client';

import React from 'react';
import { MarketSentiment } from '@/lib/types';
import { Flame, ShieldAlert, TrendingUp, Compass, Zap } from 'lucide-react';

interface SentimentGaugeProps {
  sentiment: MarketSentiment;
}

export function SentimentGauge({ sentiment }: SentimentGaugeProps) {
  const { vixScore, vixChange, fearGreedScore, fearGreedLabel, advancingStocks, decliningStocks, unchangedStocks } = sentiment;
  
  const totalStocks = advancingStocks + decliningStocks + unchangedStocks;
  const advancingPct = Math.round((advancingStocks / totalStocks) * 100);
  const decliningPct = Math.round((decliningStocks / totalStocks) * 100);

  // Fear & Greed gauge needle rotation (-90deg to 90deg)
  const needleRotation = (fearGreedScore / 100) * 180 - 90;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Compass className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">Market Sentiment & Volatility</h3>
        </div>
        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
          RISK-ON FLOW
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* VIX Volatility Box */}
        <div className="glass-pill p-4 rounded-xl flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              CBOE Volatility Index (VIX)
            </span>
            <div className="text-2xl font-bold font-mono text-white">{vixScore.toFixed(2)}</div>
            <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              {vixChange > 0 ? '+' : ''}{vixChange.toFixed(2)} (Subdued Risk)
            </span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              LOW VOLATILITY
            </span>
            <span className="text-[10px] text-slate-500 mt-2">Historical Avg: 19.5</span>
          </div>
        </div>

        {/* Fear & Greed Index Dial */}
        <div className="glass-pill p-4 rounded-xl flex flex-col items-center justify-center text-center relative">
          <span className="text-xs text-slate-400 font-medium mb-1">Fear & Greed Index</span>
          
          {/* Semi Circle Gauge */}
          <div className="relative w-36 h-20 overflow-hidden my-1">
            <div className="w-36 h-36 rounded-full border-[10px] border-slate-800 border-t-emerald-500 border-r-emerald-400 border-b-amber-500 border-l-rose-500 transform -rotate-45"></div>
            {/* Needle */}
            <div
              className="absolute bottom-0 left-1/2 w-1 h-14 bg-white origin-bottom rounded-full shadow-lg transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-50%) rotate(${needleRotation}deg)` }}
            ></div>
            <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-slate-900 border-2 border-white rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold font-mono text-emerald-400">{fearGreedScore}</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">{fearGreedLabel}</span>
          </div>
        </div>
      </div>

      {/* Market Breadth Ratio Bar */}
      <div className="pt-2">
        <div className="flex justify-between items-center text-xs font-medium mb-1.5">
          <span className="text-emerald-400 font-mono">Advancing ({advancingStocks}) {advancingPct}%</span>
          <span className="text-slate-400">US Market Breadth</span>
          <span className="text-rose-400 font-mono">Declining ({decliningStocks}) {decliningPct}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
          <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${advancingPct}%` }}></div>
          <div className="bg-slate-600 h-full transition-all duration-500" style={{ width: `${100 - advancingPct - decliningPct}%` }}></div>
          <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: `${decliningPct}%` }}></div>
        </div>
      </div>
    </div>
  );
}
