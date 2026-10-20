import React, { useRef, useState } from 'react';
import type { UserStats, WasteRecord } from '../types';
import { formatCurrency, formatWeight } from '../utils/calculations';
import { 
  DollarSign, 
  Leaf, 
  Scale, 
  Flame, 
  Download, 
  Upload, 
  RotateCcw, 
  TrendingUp, 
  CheckCircle2, 
  XCircle,
  FileJson,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { exportDataAsJSON, importDataFromJSON } from '../utils/storage';

interface WasteTrackerProps {
  stats: UserStats;
  records: WasteRecord[];
  onResetSeedData: () => void;
  onRefreshData: () => void;
}

export const WasteTracker: React.FC<WasteTrackerProps> = ({
  stats,
  records,
  onResetSeedData,
  onRefreshData,
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalItemsHandled = stats.itemsConsumedCount + stats.itemsDiscardedCount;
  const rescueRatePercent = totalItemsHandled > 0 
    ? Math.round((stats.itemsConsumedCount / totalItemsHandled) * 100) 
    : 100;

  const handleExport = () => {
    const jsonStr = exportDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expiry-guard-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDataFromJSON(content);
      if (success) {
        setImportStatus('Backup restored successfully!');
        onRefreshData();
      } else {
        setImportStatus('Error: Invalid JSON format.');
      }
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Waste-Avoided Impact Tracker
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
              Verified ROI
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Real metrics calculated from your actual kitchen consumption. Every ingredient you cook prevents money lost to landfills and reduces municipal emissions.
          </p>
        </div>

        {/* Export / Import Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
            title="Export kitchen inventory and history as JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
            title="Import previously saved JSON backup"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Restore Backup</span>
          </button>
        </div>
      </div>

      {importStatus && (
        <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
          {importStatus}
        </div>
      )}

      {/* 2. BIG 4 METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Dollars Saved */}
        <div className="p-6 rounded-3xl glass-card border border-emerald-300 dark:border-emerald-800/80 bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Rescued Value
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-3">
            {formatCurrency(stats.totalDollarsSaved)}
          </p>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            Based on synthetic retail grocery cost
          </p>
        </div>

        {/* Food Weight Diverted */}
        <div className="p-6 rounded-3xl glass-card border border-teal-300 dark:border-teal-800/80 bg-gradient-to-br from-teal-500/5 to-cyan-500/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              Food Diverted
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Scale className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-3">
            {stats.totalKgRescued.toFixed(1)} kg
          </p>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            ~{(stats.totalKgRescued * 2.2).toFixed(1)} lbs saved from waste bins
          </p>
        </div>

        {/* Carbon Prevented */}
        <div className="p-6 rounded-3xl glass-card border border-cyan-300 dark:border-cyan-800/80 bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
              CO₂e Averted
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Leaf className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-3">
            {stats.totalCo2SavedKg.toFixed(1)} kg
          </p>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
            Equivalent to ~{Math.round(stats.totalCo2SavedKg * 2.5)} car miles avoided
          </p>
        </div>

        {/* Zero-Waste Streak */}
        <div className="p-6 rounded-3xl glass-card border border-amber-300 dark:border-amber-800/80 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Kitchen Streak
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Flame className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-3">
            {stats.consecutiveStreakDays} Days
          </p>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
            {rescueRatePercent}% items rescued successfully
          </p>
        </div>

      </div>

      {/* 3. VISUAL SUMMARY & BREAKDOWN */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Progress Ratio */}
        <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-emerald-500" />
            Kitchen Rescue Efficiency
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-emerald-600 dark:text-emerald-400">Consumed / Cooked ({stats.itemsConsumedCount})</span>
              <span className="text-rose-500">Discarded ({stats.itemsDiscardedCount})</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
              <div 
                className="bg-emerald-500 h-full rounded-l-full transition-all duration-500"
                style={{ width: `${rescueRatePercent}%` }}
              />
              <div 
                className="bg-rose-500 h-full rounded-r-full transition-all duration-500"
                style={{ width: `${100 - rescueRatePercent}%` }}
              />
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-500 space-y-1.5">
            <p className="leading-relaxed">
              Target benchmark: Keep rescue rate above <strong>85%</strong> to eliminate unnecessary grocery losses.
            </p>
          </div>
        </div>

        {/* Environmental Impact Translation */}
        <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Leaf className="w-4 h-4 text-teal-500" />
            Ecological Translation
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100/70 dark:bg-slate-900/70">
              <span className="text-slate-600 dark:text-slate-400">Equivalent Trees Seedlings Grown:</span>
              <span className="font-bold text-teal-600 dark:text-teal-400">
                {(stats.totalCo2SavedKg * 0.05).toFixed(1)} seedlings
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100/70 dark:bg-slate-900/70">
              <span className="text-slate-600 dark:text-slate-400">Water Footprint Conserved:</span>
              <span className="font-bold text-blue-500">
                ~{(stats.totalKgRescued * 650).toFixed(0)} liters
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100/70 dark:bg-slate-900/70">
              <span className="text-slate-600 dark:text-slate-400">Calculation Method:</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">FAO / Poore-Nemecek</span>
            </div>
          </div>
        </div>

        {/* Data Ownership & Reset */}
        <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <FileJson className="w-4 h-4 text-amber-500" />
              Data Ownership & Reset
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              All stats reside locally in your browser. Need to start fresh or demonstrate clean initial onboarding? Reset to the synthetic demonstration dataset anytime.
            </p>
          </div>

          <button
            onClick={onResetSeedData}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>

      </div>

      {/* 4. RECENT ACTION AUDIT LOG TABLE */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Recent Consumption & Waste Log
          </h3>
          <span className="text-xs text-slate-400">{records.length} logged actions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">Item Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Outcome</th>
                <th className="py-2.5 px-3">Value</th>
                <th className="py-2.5 px-3">Est. Weight</th>
                <th className="py-2.5 px-3">CO₂e Rescued</th>
                <th className="py-2.5 px-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                    {rec.name}
                  </td>
                  <td className="py-2.5 px-3 capitalize text-slate-600 dark:text-slate-400">
                    {rec.category.replace('_', ' ')}
                  </td>
                  <td className="py-2.5 px-3">
                    {rec.action === 'consumed' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Consumed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-500 font-bold">
                        <XCircle className="w-3.5 h-3.5" /> Discarded
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                    {formatCurrency(rec.cost)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">
                    {formatWeight(rec.weightGrams)}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-teal-600 dark:text-teal-400">
                    {rec.co2SavedKg > 0 ? `+${rec.co2SavedKg} kg` : '0 kg'}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">
                    {rec.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
