'use client';

import React from 'react';
import { EconomicEvent } from '@/lib/types';
import { Calendar, AlertCircle } from 'lucide-react';

interface EconomicCalendarProps {
  events: EconomicEvent[];
}

export function EconomicCalendar({ events }: EconomicCalendarProps) {
  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Calendar className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">Economic Calendar</h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">Fed & Macro Releases</span>
      </div>

      <div className="space-y-2.5">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="glass-pill p-3 rounded-xl flex items-center justify-between border border-slate-800/60 hover:border-slate-700/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-base">{evt.flag}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-200">{evt.event}</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      evt.impact === 'High'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {evt.impact}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 mt-0.5 block">{evt.time}</span>
              </div>
            </div>

            <div className="text-right font-mono text-xs">
              {evt.actual && (
                <span className="text-emerald-400 font-bold block">Actual: {evt.actual}</span>
              )}
              <span className="text-slate-400 text-[11px] block">Forecast: {evt.forecast || 'N/A'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
