import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { 
  FoodCategory, 
  FoodItem, 
  StorageLocation, 
  UrgencyStatus 
} from '../types';
import { 
  getDaysRemaining, 
  getUrgencyStatus, 
  formatCurrency, 
  formatWeight 
} from '../utils/calculations';
import { 
  Search, 
  Refrigerator, 
  Snowflake, 
  Package, 
  Sparkles, 
  CheckCircle2, 
  Trash2, 
  AlertTriangle, 
  Clock, 
  Lightbulb, 
  Plus, 
  RotateCcw,
  ArrowUpDown,
  X
} from 'lucide-react';

interface InventoryViewProps {
  items: FoodItem[];
  onConsumeItem: (item: FoodItem) => void;
  onDiscardItem: (item: FoodItem) => void;
  onFreezeItem: (item: FoodItem) => void;
  onDeleteItem: (itemId: string) => void;
  onOpenAddModal: () => void;
  onResetSeedData: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  items,
  onConsumeItem,
  onDiscardItem,
  onFreezeItem,
  onDeleteItem,
  onOpenAddModal,
  onResetSeedData,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<StorageLocation | 'all'>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<UrgencyStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'urgency' | 'name' | 'cost' | 'newest'>('urgency');

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global key listener for '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    const active = items.filter((i) => i.status === 'active');

    return active
      .filter((item) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = item.name.toLowerCase().includes(q);
          const matchesTip = item.storageTip?.toLowerCase().includes(q);
          const matchesCat = item.category.toLowerCase().includes(q);
          if (!matchesName && !matchesTip && !matchesCat) return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }

        // Location filter
        if (selectedLocation !== 'all' && item.location !== selectedLocation) {
          return false;
        }

        // Urgency filter
        if (selectedUrgency !== 'all') {
          const urgency = getUrgencyStatus(item.expiryDate);
          if (urgency !== selectedUrgency) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'urgency') {
          const daysA = getDaysRemaining(a.expiryDate);
          const daysB = getDaysRemaining(b.expiryDate);
          return daysA - daysB;
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'cost') {
          return b.estimatedCost - a.estimatedCost;
        }
        if (sortBy === 'newest') {
          return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
        }
        return 0;
      });
  }, [items, searchQuery, selectedCategory, selectedLocation, selectedUrgency, sortBy]);

  // Aggregate stats
  const activeItems = items.filter((i) => i.status === 'active');
  const urgentCount = activeItems.filter((i) => {
    const u = getUrgencyStatus(i.expiryDate);
    return u === 'urgent' || u === 'soon';
  }).length;
  const totalValue = activeItems.reduce((acc, curr) => acc + curr.estimatedCost, 0);

  const getUrgencyBadge = (expiryDate: string) => {
    const days = getDaysRemaining(expiryDate);
    const urgency = getUrgencyStatus(expiryDate);

    if (urgency === 'expired') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <Clock className="w-3 h-3" />
          Expired ({Math.abs(days)}d ago)
        </span>
      );
    }
    if (urgency === 'urgent') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse-subtle">
          <AlertTriangle className="w-3 h-3 text-rose-500" />
          {days === 0 ? 'Expires Today!' : 'Expires Tomorrow (1d)'}
        </span>
      );
    }
    if (urgency === 'soon') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
          <Clock className="w-3 h-3 text-amber-500" />
          {days} days left
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
        <Sparkles className="w-3 h-3 text-emerald-500" />
        Fresh ({days}d)
      </span>
    );
  };

  const getLocationIcon = (location: StorageLocation) => {
    switch (location) {
      case 'fridge':
        return <Refrigerator className="w-3.5 h-3.5 text-blue-500" />;
      case 'freezer':
        return <Snowflake className="w-3.5 h-3.5 text-cyan-400" />;
      case 'pantry':
        return <Package className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* 1. TOP STATS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Active Items</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{activeItems.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">In kitchen storage</p>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-amber-200 dark:border-amber-900/40 bg-amber-500/5">
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Urgent Attention (&lt;72h)</p>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{urgentCount}</p>
          <p className="text-[11px] text-amber-600/80 mt-0.5">Prioritize in dinner plans</p>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-emerald-200 dark:border-emerald-900/40 bg-emerald-500/5">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Inventory Retail Value</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{formatCurrency(totalValue)}</p>
          <p className="text-[11px] text-emerald-600/80 mt-0.5">Value at risk if spoiled</p>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Quick Actions</p>
            <button
              onClick={onOpenAddModal}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add Item (N)
            </button>
          </div>
          <button
            onClick={onResetSeedData}
            title="Reset synthetic demo items"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. FILTER & TOOLBAR */}
      <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
        
        {/* Row 1: Search + Location + Sort */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search items, storage tips, categories... (Press '/' to focus)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Location Segment Control */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium">
            <button
              onClick={() => setSelectedLocation('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedLocation === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Zones
            </button>
            <button
              onClick={() => setSelectedLocation('fridge')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                selectedLocation === 'fridge'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Refrigerator className="w-3.5 h-3.5" /> Fridge
            </button>
            <button
              onClick={() => setSelectedLocation('freezer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                selectedLocation === 'freezer'
                  ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Snowflake className="w-3.5 h-3.5" /> Freezer
            </button>
            <button
              onClick={() => setSelectedLocation('pantry')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                selectedLocation === 'pantry'
                  ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" /> Pantry
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none"
            >
              <option value="urgency">Expires Soonest</option>
              <option value="name">Name (A-Z)</option>
              <option value="cost">Highest Value</option>
              <option value="newest">Recently Added</option>
            </select>
          </div>

        </div>

        {/* Row 2: Category Chips & Urgency Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
          
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 mr-1 font-medium">Category:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'produce', label: '🥬 Produce' },
              { id: 'dairy_eggs', label: '🥛 Dairy & Eggs' },
              { id: 'meat_seafood', label: '🍗 Meat & Seafood' },
              { id: 'bakery', label: '🍞 Bakery' },
              { id: 'pantry', label: '🥫 Pantry' },
              { id: 'leftovers', label: '🍲 Leftovers' },
              { id: 'frozen', label: '🧊 Frozen' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 mr-1 font-medium">Urgency:</span>
            <button
              onClick={() => setSelectedUrgency(selectedUrgency === 'urgent' ? 'all' : 'urgent')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedUrgency === 'urgent'
                  ? 'bg-rose-500 text-white ring-2 ring-rose-400'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100'
              }`}
            >
              Urgent (&lt;24h)
            </button>
            <button
              onClick={() => setSelectedUrgency(selectedUrgency === 'soon' ? 'all' : 'soon')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedUrgency === 'soon'
                  ? 'bg-amber-500 text-white ring-2 ring-amber-400'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-100'
              }`}
            >
              Soon (&lt;72h)
            </button>
          </div>

        </div>

      </div>

      {/* 3. ITEM CARDS GRID */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 stroke-[2]" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {activeItems.length === 0 ? 'Your kitchen is all clear!' : 'No items match your filter criteria'}
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            {activeItems.length === 0
              ? 'All items have been consumed or rescued. Add new groceries or reset to the synthetic demonstration dataset.'
              : 'Try clearing your search query or switching the category/location filter to see more items.'}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            {activeItems.length === 0 ? (
              <button
                onClick={onResetSeedData}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-sm"
              >
                Reload Sample Kitchen Stock
              </button>
            ) : (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedLocation('all');
                  setSelectedUrgency('all');
                }}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const urgency = getUrgencyStatus(item.expiryDate);

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl glass-card border transition-all duration-200 flex flex-col justify-between hover:shadow-lg ${
                  urgency === 'urgent'
                    ? 'border-rose-400/80 dark:border-rose-800/80 bg-rose-500/[0.02]'
                    : urgency === 'soon'
                    ? 'border-amber-400/80 dark:border-amber-800/80 bg-amber-500/[0.02]'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Header: Title + Urgency Badge */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">
                          {item.quantity} {item.unit}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 capitalize font-medium">
                          {getLocationIcon(item.location)}
                          {item.location}
                        </span>
                      </div>
                    </div>
                    {getUrgencyBadge(item.expiryDate)}
                  </div>

                  {/* Metadata Row: Estimated cost & weight */}
                  <div className="mt-3 flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Value: <span className="text-emerald-600 dark:text-emerald-400">{formatCurrency(item.estimatedCost)}</span>
                    </span>
                    <span className="text-slate-500">
                      Approx. {formatWeight(item.estimatedWeightGrams)}
                    </span>
                  </div>

                  {/* Storage Tip callout */}
                  {item.storageTip && (
                    <div className="mt-3 flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 bg-emerald-500/5 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/20">
                      <Lightbulb className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item.storageTip}</span>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  
                  {/* Consume Button */}
                  <button
                    onClick={() => onConsumeItem(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-sm transition-all"
                    title="Mark as cooked or eaten (rescues money and avoids waste)"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Ate This!</span>
                  </button>

                  {/* Freeze action (if in fridge) */}
                  {item.location === 'fridge' && (
                    <button
                      onClick={() => onFreezeItem(item)}
                      className="p-2 rounded-xl text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 border border-cyan-200 dark:border-cyan-800 transition-colors"
                      title="Move to freezer (+60 days shelf life)"
                    >
                      <Snowflake className="w-4 h-4" />
                    </button>
                  )}

                  {/* Discard / Wasted Button */}
                  <button
                    onClick={() => onDiscardItem(item)}
                    className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Mark as spoiled / discarded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Remove Button */}
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Delete item"
                  >
                    <X className="w-4 h-4" />
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
