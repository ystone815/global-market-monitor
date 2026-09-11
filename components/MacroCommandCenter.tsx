'use client';

import React from 'react';
import { MarketQuote, MarketSentiment } from '@/lib/types';
import { 
  Flame, 
  Coins, 
  Droplet, 
  Bitcoin, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap, 
  Banknote,
  Landmark
} from 'lucide-react';

interface MacroCommandCenterProps {
  quotes: MarketQuote[];
  sentiment: MarketSentiment;
  onSelectQuote: (quote: MarketQuote) => void;
  selectedSymbol: string;
}

export function MacroCommandCenter({
  quotes,
  sentiment,
  onSelectQuote,
  selectedSymbol
}: MacroCommandCenterProps) {
  // Extract key macro quotes
  const vix = quotes.find((q) => q.symbol === '^VIX') || {
    symbol: '^VIX',
    name: 'CBOE Volatility (VIX)',
    price: sentiment.vixScore,
    change: sentiment.vixChange,
    changePercent: (sentiment.vixChange / (sentiment.vixScore - sentiment.vixChange)) * 100,
    high: 17.8,
    low: 15.9,
    volume: 'N/A',
    assetClass: 'indices',
    region: 'US',
    sparkline: [],
    updatedAt: 'Now'
  };

  const gold = quotes.find((q) => q.symbol === 'GC=F') || {
    symbol: 'GC=F',
    name: 'Gold Futures',
    price: 2585.5,
    change: 18.2,
    changePercent: 0.71,
    high: 2592.0,
    low: 2568.0,
    volume: '185K',
    assetClass: 'commodities',
    region: 'GLOBAL',
    sparkline: [],
    updatedAt: 'Now'
  };

  const crude = quotes.find((q) => q.symbol === 'CL=F') || {
    symbol: 'CL=F',
    name: 'Crude Oil WTI',
    price: 69.45,
    change: 1.25,
    changePercent: 1.83,
    high: 70.1,
    low: 68.15,
    volume: '340K',
    assetClass: 'commodities',
    region: 'GLOBAL',
    sparkline: [],
    updatedAt: 'Now'
  };

  const btc = quotes.find((q) => q.symbol === 'BTC-USD') || {
    symbol: 'BTC-USD',
    name: 'Bitcoin',
    price: 58450.0,
    change: 1420.0,
    changePercent: 2.49,
    high: 59100.0,
    low: 56800.0,
    volume: '28.4B',
    assetClass: 'crypto',
    region: 'GLOBAL',
    sparkline: [],
    updatedAt: 'Now'
  };

  const us10y = quotes.find((q) => q.symbol === '^TNX') || {
    symbol: '^TNX',
    name: 'US 10Y Treasury Yield',
    price: 3.66,
    change: -0.04,
    changePercent: -1.08,
    high: 3.71,
    low: 3.65,
    volume: 'N/A',
    assetClass: 'bonds',
    region: 'US',
    sparkline: [],
    updatedAt: 'Now'
  };

  const m2 = quotes.find((q) => q.symbol === 'M2-SUPPLY') || {
    symbol: 'M2-SUPPLY',
    name: 'US M2 Money Supply',
    price: 21.35,
    change: 0.51,
    changePercent: 2.45,
    high: 21.40,
    low: 20.80,
    volume: '$21.35T',
    assetClass: 'macro',
    region: 'US',
    sparkline: [],
    updatedAt: 'FRED Monthly'
  };

  // Determine overall Macro Risk Regime
  let riskStatus = '🟢 RISK-ON / HIGH LIQUIDITY EXPANSION';
  let riskBg = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
  let riskDesc = 'M2 Supply Expanding ($21.35T) + VIX Subdued & Bitcoin/Equities Momentum';

  if (vix.price > 22 || crude.changePercent > 3.0) {
    riskStatus = '🔴 RISK-OFF / FLIGHT TO SAFETY';
    riskBg = 'bg-rose-500/10 border-rose-500/30 text-rose-400';
    riskDesc = 'Elevated Volatility & Commodity Spike Caution';
  } else if (gold.changePercent > 1.5 && btc.changePercent < -1.5) {
    riskStatus = '🟡 SAFE HAVEN DEFENSIVE FLOW';
    riskBg = 'bg-amber-500/10 border-amber-500/30 text-amber-400';
    riskDesc = 'Capital Rotating from Risk Assets into Gold & Bonds';
  }

  const macroCards = [
    {
      item: vix,
      title: 'VIX Volatility',
      icon: Flame,
      iconColor: 'text-amber-400',
      badge: vix.price < 18 ? 'Subdued Risk' : 'High Volatility',
      desc: 'CBOE Fear Gauge'
    },
    {
      item: m2,
      title: 'US M2 Liquidity',
      icon: Banknote,
      iconColor: 'text-emerald-400',
      badge: '+2.45% YoY Growth',
      desc: 'FRED • $21.35 Trillion'
    },
    {
      item: gold,
      title: 'Gold Futures',
      icon: Coins,
      iconColor: 'text-yellow-400',
      badge: 'Safe Haven',
      desc: 'GC=F • Gold Bullion'
    },
    {
      item: crude,
      title: 'WTI Crude Oil',
      icon: Droplet,
      iconColor: 'text-cyan-400',
      badge: 'Energy / Inflation',
      desc: 'CL=F • Barrel Price'
    },
    {
      item: btc,
      title: 'Bitcoin (BTC)',
      icon: Bitcoin,
      iconColor: 'text-orange-400',
      badge: 'Digital Gold / Liquidity',
      desc: 'BTC-USD • Crypto Standard'
    },
    {
      item: us10y,
      title: 'US 10Y Yield',
      icon: Activity,
      iconColor: 'text-indigo-400',
      badge: '3.66% Benchmark Rate',
      desc: '^TNX • Treasury Yield'
    }
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 border border-indigo-500/30 shadow-2xl space-y-4 relative overflow-hidden bg-gradient-to-r from-slate-900/90 via-slate-900/95 to-slate-950">
      {/* Top Title & Risk Regime Signal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
            <Landmark className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">MACRO COMMAND CENTER</h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                GLOBAL LIQUIDITY & RISK MATRIX
              </span>
            </div>
            <p className="text-xs text-slate-400">
              VIX, M2 Money Supply, Gold, Oil, Bitcoin & Treasury Yield Command Dashboard
            </p>
          </div>
        </div>

        {/* Dynamic Macro Risk Signal Gauge */}
        <div className={`px-4 py-2 rounded-xl border ${riskBg} flex items-center gap-3 backdrop-blur-md`}>
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-current"></span>
          </div>
          <div>
            <span className="text-xs font-extrabold font-mono tracking-wide block">{riskStatus}</span>
            <span className="text-[10px] text-slate-300 opacity-90 block">{riskDesc}</span>
          </div>
        </div>
      </div>

      {/* 6 Macro Hero Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {macroCards.map(({ item, title, icon: Icon, iconColor, badge, desc }) => {
          const isPos = item.change >= 0;
          const isSelected = selectedSymbol === item.symbol;

          return (
            <div
              key={item.symbol}
              onClick={() => onSelectQuote(item as MarketQuote)}
              className={`glass-pill p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-500/30 bg-slate-800/90'
                  : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                  <span className="text-xs font-bold text-slate-200 truncate">{title}</span>
                </div>
              </div>

              <div className="text-lg font-bold font-mono text-white tracking-tight">
                {item.symbol === 'GC=F' || item.symbol === 'BTC-USD' ? '$' : ''}
                {item.symbol === 'M2-SUPPLY' ? `$${item.price}T` : item.price.toLocaleString(undefined, { minimumFractionDigits: item.price < 10 ? 2 : 2 })}
                {item.symbol === '^TNX' ? '%' : ''}
              </div>

              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800/60 text-xs font-mono">
                <span className="text-[9px] text-slate-400 truncate">{badge}</span>
                <span
                  className={`inline-flex items-center text-[10px] font-bold px-1 py-0.2 rounded ${
                    isPos
                      ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                      : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                  }`}
                >
                  {isPos ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                  {isPos ? '+' : ''}{item.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
