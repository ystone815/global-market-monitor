'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { TickerTape } from '@/components/TickerTape';
import { MacroCommandCenter } from '@/components/MacroCommandCenter';
import { MarketOverviewGrid } from '@/components/MarketOverviewGrid';
import { MainChartStation } from '@/components/MainChartStation';
import { SentimentGauge } from '@/components/SentimentGauge';
import { AssetClassTabs } from '@/components/AssetClassTabs';
import { EconomicCalendar } from '@/components/EconomicCalendar';
import { NewsFeed } from '@/components/NewsFeed';
import { WatchlistPanel } from '@/components/WatchlistPanel';

import { MarketQuote, MarketSentiment, SectorPerformance, BondYield, CryptoAsset, EconomicEvent, MarketNews } from '@/lib/types';
import { INITIAL_QUOTES, INITIAL_SENTIMENT, SECTORS, BOND_YIELDS, CRYPTO_ASSETS, ECONOMIC_CALENDAR, MARKET_NEWS } from '@/lib/mockData';

export default function Home() {
  const [quotes, setQuotes] = useState<MarketQuote[]>(INITIAL_QUOTES);
  const [sentiment, setSentiment] = useState<MarketSentiment>(INITIAL_SENTIMENT);
  const [sectors, setSectors] = useState<SectorPerformance[]>(SECTORS);
  const [bondYields, setBondYields] = useState<BondYield[]>(BOND_YIELDS);
  const [crypto, setCrypto] = useState<CryptoAsset[]>(CRYPTO_ASSETS);
  const [calendar, setCalendar] = useState<EconomicEvent[]>(ECONOMIC_CALENDAR);
  const [news, setNews] = useState<MarketNews[]>(MARKET_NEWS);

  const [selectedQuote, setSelectedQuote] = useState<MarketQuote>(INITIAL_QUOTES[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeAssetFilter, setActiveAssetFilter] = useState<string>('all');
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [watchlist, setWatchlist] = useState<string[]>(['^GSPC', '^IXIC', 'USD/KRW', 'BTC-USD', 'GC=F', 'CL=F']);

  // Load Watchlist from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gmm_watchlist');
      if (saved) {
        setWatchlist(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save Watchlist to LocalStorage
  const handleToggleWatchlist = (symbol: string) => {
    setWatchlist((prev) => {
      const next = prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol];
      try {
        localStorage.setItem('gmm_watchlist', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Fetch API / Micro-tick update
  const fetchMarketData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/market');
      if (res.ok) {
        const data = await res.json();
        if (data.quotes) setQuotes(data.quotes);
        if (data.sentiment) setSentiment(data.sentiment);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Initial fetch & interval polling
  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 4000);
    return () => clearInterval(interval);
  }, [fetchMarketData]);

  // Keep selectedQuote updated with fresh prices
  useEffect(() => {
    const updated = quotes.find((q) => q.symbol === selectedQuote.symbol);
    if (updated) {
      setSelectedQuote(updated);
    }
  }, [quotes, selectedQuote.symbol]);

  // Filter quotes based on search and asset class button
  const filteredQuotes = quotes.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.region.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeAssetFilter === 'all' ||
      (activeAssetFilter === 'indices' && item.assetClass === 'indices') ||
      (activeAssetFilter === 'us' && item.region === 'US') ||
      (activeAssetFilter === 'asia_eu' && (item.region === 'ASIA' || item.region === 'EU')) ||
      (activeAssetFilter === 'forex' && item.assetClass === 'forex') ||
      (activeAssetFilter === 'commodities' && item.assetClass === 'commodities') ||
      (activeAssetFilter === 'crypto' && item.assetClass === 'crypto');

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#070a12] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Sticky Header Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        lastUpdated={lastUpdated}
        onRefresh={fetchMarketData}
        isRefreshing={isRefreshing}
      />

      {/* Real-time Ticker Tape Marquee */}
      <TickerTape quotes={quotes} onSelectQuote={setSelectedQuote} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-8">
        
        {/* TOPMOST SECTION: MACRO COMMAND CENTER (VIX, GOLD, OIL, BITCOIN, 10Y YIELD/FX) */}
        <section>
          <MacroCommandCenter
            quotes={quotes}
            sentiment={sentiment}
            onSelectQuote={setSelectedQuote}
            selectedSymbol={selectedQuote.symbol}
          />
        </section>

        {/* MAIN CHART STATION & SENTIMENT / WATCHLIST SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">
            <MainChartStation selectedQuote={selectedQuote} />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <SentimentGauge sentiment={sentiment} />
            <WatchlistPanel
              watchlistSymbols={watchlist}
              quotes={quotes}
              onSelectQuote={setSelectedQuote}
              onRemoveFromWatchlist={handleToggleWatchlist}
            />
          </div>
        </section>

        {/* ASSET FILTER BUTTONS & MARKET OVERVIEW GRID */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-3 rounded-2xl">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'All Assets' },
                { id: 'indices', label: 'Global Indices' },
                { id: 'us', label: 'US Equities' },
                { id: 'asia_eu', label: 'Asia & EU' },
                { id: 'forex', label: 'Forex' },
                { id: 'commodities', label: 'Commodities' },
                { id: 'crypto', label: 'Crypto' }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setActiveAssetFilter(btn.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                    activeAssetFilter === btn.id
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-400 font-mono text-right">
              Showing {filteredQuotes.length} quotes
            </span>
          </div>

          <MarketOverviewGrid
            quotes={filteredQuotes}
            selectedQuote={selectedQuote}
            onSelectQuote={setSelectedQuote}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
          />
        </section>

        {/* MULTI-ASSET DEEP DIVE TABS & MACRO / NEWS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            <AssetClassTabs sectors={sectors} bondYields={bondYields} cryptoAssets={crypto} />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <EconomicCalendar events={calendar} />
            <NewsFeed news={news} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800/80 mt-12 py-8 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>GLOBAL MARKET MONITOR • MACRO COMMAND CENTER</span>
          </div>
          <div>
            <span>GitHub Repository: </span>
            <a
              href="https://github.com/ystone815/global-market-monitor.git"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 hover:underline"
            >
              github.com/ystone815/global-market-monitor
            </a>
          </div>
          <span>© {new Date().getFullYear()} Global Market Monitor. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
