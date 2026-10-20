import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <p className="font-extrabold text-sm text-slate-900 dark:text-white">
                ExpiryGuard
              </p>
              <p className="text-xs text-slate-500">
                Zero-Waste Kitchen Inventory & Cook-First Studio
              </p>
            </div>
          </div>

          <div className="text-center md:text-right text-xs text-slate-500 space-y-1">
            <p>
              Open source under MIT License • Project 1 of 9 Autonomous Engineering Portfolio
            </p>
            <p className="text-[11px] text-slate-400">
              Target account: <a href="https://github.com/ahmadijaz687" target="_blank" rel="noreferrer" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">github.com/ahmadijaz687</a> • Sample data strictly labeled synthetic.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};
