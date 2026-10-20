import React, { useState } from 'react';
import type { FoodCategory, FoodItem, PresetFoodItem, StorageLocation } from '../types';
import { PRESET_FOODS } from '../data/presets';
import { 
  X, 
  Plus, 
  Sparkles, 
  Search, 
  Lightbulb 
} from 'lucide-react';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: Omit<FoodItem, 'id' | 'status'>) => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
}) => {
  if (!isOpen) return null;

  // Preset search query
  const [presetSearch, setPresetSearch] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('produce');
  const [location, setLocation] = useState<StorageLocation>('fridge');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState('pack');
  const [expiryDaysOffset, setExpiryDaysOffset] = useState<number>(5);
  const [estimatedCost, setEstimatedCost] = useState<number>(3.99);
  const [estimatedWeightGrams, setEstimatedWeightGrams] = useState<number>(250);
  const [storageTip, setStorageTip] = useState('');

  // Handle Preset Selection
  const applyPreset = (preset: PresetFoodItem) => {
    setName(preset.name);
    setCategory(preset.category);
    setLocation(preset.defaultLocation);
    setExpiryDaysOffset(preset.shelfLifeDays);
    setEstimatedCost(preset.defaultCost);
    setEstimatedWeightGrams(preset.defaultWeightGrams);
    setUnit(preset.defaultUnit);
    setStorageTip(preset.storageTip);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const today = new Date();
    const expiry = new Date();
    expiry.setDate(today.getDate() + Number(expiryDaysOffset));

    onAddItem({
      name: name.trim(),
      category,
      location,
      quantity: Number(quantity) || 1,
      unit: unit.trim() || 'item',
      addedDate: today.toISOString().split('T')[0],
      expiryDate: expiry.toISOString().split('T')[0],
      estimatedCost: Number(estimatedCost) || 0,
      estimatedWeightGrams: Number(estimatedWeightGrams) || 100,
      storageTip: storageTip.trim(),
    });

    onClose();
  };

  const filteredPresets = PRESET_FOODS.filter((p) =>
    p.name.toLowerCase().includes(presetSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(presetSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Add Food Item
              </h3>
              <p className="text-xs text-slate-500">
                Choose a zero-friction preset or customize manually
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* 1. Quick Presets Bar */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Quick Auto-Fill Presets (25+ Available)
              </label>
              <div className="relative w-44">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter presets..."
                  value={presetSearch}
                  onChange={(e) => setPresetSearch(e.target.value)}
                  className="w-full pl-8 pr-2 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/40">
              {filteredPresets.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                    name === preset.name
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-400'
                  }`}
                >
                  {preset.name} ({preset.shelfLifeDays}d)
                </button>
              ))}
            </div>
          </div>

          {/* 2. Custom Input Form */}
          <form id="add-item-form" onSubmit={handleSubmit} className="space-y-4">
            
            {/* Item Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Item Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Organic Baby Spinach, Fresh Salmon Fillet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
              />
            </div>

            {/* Category & Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="produce">🥬 Produce</option>
                  <option value="dairy_eggs">🥛 Dairy & Eggs</option>
                  <option value="meat_seafood">🍗 Meat & Seafood</option>
                  <option value="bakery">🍞 Bakery</option>
                  <option value="pantry">🥫 Pantry</option>
                  <option value="leftovers">🍲 Leftovers</option>
                  <option value="beverages">🧃 Beverages</option>
                  <option value="frozen">🧊 Frozen</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Storage Zone
                </label>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => setLocation('fridge')}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      location === 'fridge'
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Fridge
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocation('freezer')}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      location === 'freezer'
                        ? 'bg-cyan-500 text-white border-cyan-500'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Freezer
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocation('pantry')}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      location === 'pantry'
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Pantry
                  </button>
                </div>
              </div>
            </div>

            {/* Quantity, Unit, Shelf-Life */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Unit
                </label>
                <input
                  type="text"
                  placeholder="pack, item, g"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Shelf Life (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={expiryDaysOffset}
                  onChange={(e) => setExpiryDaysOffset(parseInt(e.target.value) || 5)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>

            {/* Estimated Value ($) & Weight */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Estimated Cost ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Est. Weight (Grams)
                </label>
                <input
                  type="number"
                  min="10"
                  step="10"
                  value={estimatedWeightGrams}
                  onChange={(e) => setEstimatedWeightGrams(parseInt(e.target.value) || 100)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>

            {/* Storage Tip */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                Storage Advice / Culinary Tip
              </label>
              <input
                type="text"
                placeholder="e.g. Place dry paper towel inside container to absorb moisture."
                value={storageTip}
                onChange={(e) => setStorageTip(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
              />
            </div>

          </form>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-item-form"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-extrabold shadow-md shadow-emerald-600/20 transition-all"
          >
            Save to Kitchen
          </button>
        </div>

      </div>
    </div>
  );
};
