import React from 'react';
import { 
  ShieldCheck, 
  ChefHat, 
  BarChart3, 
  Refrigerator, 
  Plus, 
  Moon, 
  Sun, 
  Sparkles, 
  Keyboard
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'landing' | 'inventory' | 'cook' | 'impact';
  setCurrentTab: (tab: 'landing' | 'inventory' | 'cook' | 'impact') => void;
  onOpenAddModal: () => void;
  onOpenShortcuts: () => void;
  urgentCount: number;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAddModal,
  onOpenShortcuts,
  urgentCount,
  darkMode,
  setDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-40 glass-nav transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => setCurrentTab('landing')}
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <ShieldCheck className="w-6 h-6 text-white stroke-[2.5]" />
              {urgentCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[10px] font-bold text-white items-center justify-center">
                    {urgentCount}
                  </span>
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Expiry<span className="text-emerald-600 dark:text-emerald-400">Guard</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100 dark:bg-emerald-950/80 dark:text-emerald-300 rounded border border-emerald-200 dark:border-emerald-800">
                  v1.0
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Smart Pantry & Cook-First Waste Avoidance
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setCurrentTab('landing')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'landing'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentTab('inventory')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'inventory'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Refrigerator className="w-4 h-4 text-emerald-500" />
              Kitchen Stock
              {urgentCount > 0 && (
                <span className="px-1.5 py-0.2 text-xs font-bold rounded-full bg-amber-500 text-white">
                  {urgentCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentTab('cook')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'cook'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ChefHat className="w-4 h-4 text-amber-500" />
              Cook-First
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            </button>
            <button
              onClick={() => setCurrentTab('impact')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'impact'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-teal-500" />
              Impact Tracker
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all duration-150"
              title="Add food item (Shortcut: N)"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Add Item</span>
            </button>

            {/* Keyboard shortcut help */}
            <button
              onClick={onOpenShortcuts}
              className="hidden sm:flex p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Keyboard shortcuts (?)"
            >
              <Keyboard className="w-4 h-4" />
            </button>

            {/* Dark / Light toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setCurrentTab('landing')}
            className={`flex flex-col items-center gap-1 ${currentTab === 'landing' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500'}`}
          >
            <Sparkles className="w-4 h-4" />
            Overview
          </button>
          <button
            onClick={() => setCurrentTab('inventory')}
            className={`flex flex-col items-center gap-1 ${currentTab === 'inventory' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500'}`}
          >
            <Refrigerator className="w-4 h-4" />
            Stock ({urgentCount})
          </button>
          <button
            onClick={() => setCurrentTab('cook')}
            className={`flex flex-col items-center gap-1 ${currentTab === 'cook' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500'}`}
          >
            <ChefHat className="w-4 h-4" />
            Cook-First
          </button>
          <button
            onClick={() => setCurrentTab('impact')}
            className={`flex flex-col items-center gap-1 ${currentTab === 'impact' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500'}`}
          >
            <BarChart3 className="w-4 h-4" />
            Impact
          </button>
        </div>

      </div>
    </header>
  );
};
