import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '/', description: 'Focus search bar in Kitchen Stock' },
    { key: 'N', description: 'Open Add Food Item dialog' },
    { key: 'C', description: 'Switch to Cook-First Rescue Studio' },
    { key: 'I', description: 'Switch to Kitchen Stock Inventory' },
    { key: 'M', description: 'Switch to Impact & Waste Avoided Tracker' },
    { key: '?', description: 'Toggle this keyboard shortcuts helper' },
    { key: 'Esc', description: 'Close any active modal or menu' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Keyboard className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Keyboard Shortcuts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-2.5">
          {shortcuts.map((sc) => (
            <div 
              key={sc.key} 
              className="flex items-center justify-between p-2 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 text-xs"
            >
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                {sc.description}
              </span>
              <kbd className="px-2 py-1 rounded-md bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 shadow-xs font-mono font-bold text-slate-900 dark:text-white">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-center">
          <p className="text-[11px] text-slate-400">
            Engineered for power users and rapid zero-friction kitchen logging.
          </p>
        </div>
      </div>
    </div>
  );
};
