'use client';

import React, { useState } from 'react';
import { SectorPerformance, BondYield, CryptoAsset } from '@/lib/types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { Layers, DollarSign, Award, Bitcoin, ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';

interface AssetClassTabsProps {
  sectors: SectorPerformance[];
  bondYields: BondYield[];
  cryptoAssets: CryptoAsset[];
}

export function AssetClassTabs({ sectors, bondYields, cryptoAssets }: AssetClassTabsProps) {
  const [activeTab, setActiveTab] = useState<'sectors' | 'forex' | 'bonds' | 'crypto'>('sectors');
  
  // Forex Converter state
  const [calcAmount, setCalcAmount] = useState<number>(1000);
  const [calcPair, setCalcPair] = useState<'USD_KRW' | 'EUR_USD' | 'USD_JPY'>('USD_KRW');

  const rates = {
    USD_KRW: 1335.50,
    EUR_USD: 1.1085,
    USD_JPY: 141.25
  };

  const calculateConverted = () => {
    if (calcPair === 'USD_KRW') return (calcAmount * rates.USD_KRW).toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' ₩';
    if (calcPair === 'EUR_USD') return (calcAmount * rates.EUR_USD).toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' $';
    if (calcPair === 'USD_JPY') return (calcAmount * rates.USD_JPY).toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' ¥';
    return '0';
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80">
      {/* Sub Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-3 mb-5">
        <div className="flex items-center gap-1 glass-pill p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('sectors')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'sectors'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>US Sectors</span>
          </button>

          <button
            onClick={() => setActiveTab('forex')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'forex'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Forex & Converter</span>
          </button>

          <button
            onClick={() => setActiveTab('bonds')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'bonds'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Yield Curve</span>
          </button>

          <button
            onClick={() => setActiveTab('crypto')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'crypto'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bitcoin className="w-3.5 h-3.5" />
            <span>Crypto Dominance</span>
          </button>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Updated: Real-time Multi-asset Feed
        </span>
      </div>

      {/* TAB 1: SECTOR PERFORMANCE HEATMAP */}
      {activeTab === 'sectors' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {sectors.map((sector) => {
              const isPos = sector.changePercent >= 0;
              return (
                <div
                  key={sector.symbol}
                  className={`p-3 rounded-xl border flex flex-col justify-between transition-transform hover:scale-105 ${
                    isPos
                      ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                  }`}
                >
                  <span className="text-[11px] font-bold text-slate-300 truncate">{sector.name}</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-xs font-mono font-semibold opacity-70">{sector.symbol}</span>
                    <span className="text-sm font-mono font-bold">
                      {isPos ? '+' : ''}{sector.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: FOREX MATRIX & CONVERTER */}
      {activeTab === 'forex' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* FX Rates List */}
          <div className="md:col-span-7 space-y-3">
            <div className="glass-pill p-3 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white">USD / KRW</span>
                <span className="text-[10px] text-slate-400 block">US Dollar to Korean Won</span>
              </div>
              <div className="text-right">
                <span className="text-base font-bold font-mono text-white">1,335.50 ₩</span>
                <span className="text-xs font-mono text-emerald-400 block">-4.20 (-0.31%)</span>
              </div>
            </div>

            <div className="glass-pill p-3 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white">EUR / USD</span>
                <span className="text-[10px] text-slate-400 block">Euro to US Dollar</span>
              </div>
              <div className="text-right">
                <span className="text-base font-bold font-mono text-white">1.1085 $</span>
                <span className="text-xs font-mono text-emerald-400 block">+0.0024 (+0.22%)</span>
              </div>
            </div>

            <div className="glass-pill p-3 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white">USD / JPY</span>
                <span className="text-[10px] text-slate-400 block">US Dollar to Japanese Yen</span>
              </div>
              <div className="text-right">
                <span className="text-base font-bold font-mono text-white">141.25 ¥</span>
                <span className="text-xs font-mono text-rose-400 block">-0.85 (-0.60%)</span>
              </div>
            </div>
          </div>

          {/* Quick FX Calculator */}
          <div className="md:col-span-5 glass-pill p-4 rounded-xl space-y-3 border border-indigo-500/20">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <ArrowUpDown className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Currency Converter</h4>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-medium">AMOUNT</label>
              <input
                type="number"
                value={calcAmount}
                onChange={(e) => setCalcAmount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-medium">CURRENCY PAIR</label>
              <select
                value={calcPair}
                onChange={(e: any) => setCalcPair(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="USD_KRW">USD → KRW (1335.50)</option>
                <option value="EUR_USD">EUR → USD (1.1085)</option>
                <option value="USD_JPY">USD → JPY (141.25)</option>
              </select>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] text-slate-400 block">ESTIMATED RESULT</span>
              <span className="text-xl font-bold font-mono text-emerald-400">{calculateConverted()}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: US TREASURY YIELD CURVE */}
      {activeTab === 'bonds' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">US Treasury Yield Curve (3M to 30Y)</span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              10Y-2Y Spread: +0.08% (Un-inverted)
            </span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bondYields.filter(b => !b.isSpread)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="maturity" stroke="#64748b" fontSize={11} />
                <YAxis domain={[3.0, 5.5]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  formatter={(value: any) => [`${value}%`, 'Yield']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Bar dataKey="yieldVal" fill="#6366f1" radius={[4, 4, 0, 0]}>
                  {bondYields.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 3 ? '#10b981' : '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* TAB 4: CRYPTO ASSETS & MARKET DOMINANCE */}
      {activeTab === 'crypto' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cryptoAssets.map((coin) => (
            <div key={coin.symbol} className="glass-pill p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white">{coin.name} ({coin.symbol})</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Cap: {coin.marketCap} • Dom: {coin.dominance}%</span>
              </div>
              <div className="text-right font-mono">
                <span className="text-sm font-bold text-white block">${coin.price.toLocaleString()}</span>
                <span className={`text-xs ${coin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
