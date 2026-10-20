import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { FoodItem, UserStats, WasteRecord } from './types';
import { 
  loadInventory, 
  saveInventory, 
  loadStats, 
  saveStats, 
  loadWasteRecords, 
  saveWasteRecords, 
  resetAllDataToSeed 
} from './utils/storage';
import { 
  calculateEmissionsAverted, 
  getUrgencyStatus, 
  formatCurrency 
} from './utils/calculations';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { InventoryView } from './components/InventoryView';
import { CookFirstStudio } from './components/CookFirstStudio';
import { WasteTracker } from './components/WasteTracker';
import { AddItemModal } from './components/AddItemModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { Toast } from './components/Toast';
import type { ToastMessage } from './components/Toast';
import { Footer } from './components/Footer';

export function App() {
  const [currentTab, setCurrentTab] = useState<'landing' | 'inventory' | 'cook' | 'impact'>('landing');
  const [inventory, setInventory] = useState<FoodItem[]>(() => loadInventory());
  const [stats, setStats] = useState<UserStats>(() => loadStats());
  const [records, setRecords] = useState<WasteRecord[]>(() => loadWasteRecords());

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Dark mode initial check
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Sync state to LocalStorage
  useEffect(() => {
    saveInventory(inventory);
  }, [inventory]);

  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  useEffect(() => {
    saveWasteRecords(records);
  }, [records]);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if active in an input/textarea/select
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        if (e.key === 'Escape') {
          setIsAddModalOpen(false);
          setIsShortcutsOpen(false);
        }
        return;
      }

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setIsAddModalOpen(true);
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setCurrentTab('cook');
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        setCurrentTab('inventory');
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setCurrentTab('impact');
      } else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsAddModalOpen(false);
        setIsShortcutsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10b981', '#34d399', '#f59e0b', '#059669'],
      });
    } catch (e) {
      // safe fallback if canvas is not ready
    }
  };

  // 1. Consume Item
  const handleConsumeItem = (item: FoodItem) => {
    const co2Saved = calculateEmissionsAverted(item.category, item.estimatedWeightGrams);
    const today = new Date().toISOString().split('T')[0];

    // Update inventory
    setInventory((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: 'consumed', actionDate: today } : i))
    );

    // Append record
    const newRecord: WasteRecord = {
      id: 'rec-' + Date.now(),
      itemId: item.id,
      name: item.name,
      category: item.category,
      action: 'consumed',
      cost: item.estimatedCost,
      weightGrams: item.estimatedWeightGrams,
      co2SavedKg: co2Saved,
      date: today,
    };
    setRecords((prev) => [newRecord, ...prev]);

    // Update stats
    setStats((prev) => ({
      ...prev,
      totalDollarsSaved: Number((prev.totalDollarsSaved + item.estimatedCost).toFixed(2)),
      totalKgRescued: Number((prev.totalKgRescued + item.estimatedWeightGrams / 1000).toFixed(2)),
      totalCo2SavedKg: Number((prev.totalCo2SavedKg + co2Saved).toFixed(2)),
      itemsConsumedCount: prev.itemsConsumedCount + 1,
    }));

    triggerConfetti();
    showToast(
      'success',
      `Rescued ${item.name}!`,
      `+${formatCurrency(item.estimatedCost)} saved • +${co2Saved} kg CO₂e averted`
    );
  };

  // 2. Discard Item
  const handleDiscardItem = (item: FoodItem) => {
    const today = new Date().toISOString().split('T')[0];

    setInventory((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: 'discarded', actionDate: today } : i))
    );

    const newRecord: WasteRecord = {
      id: 'rec-' + Date.now(),
      itemId: item.id,
      name: item.name,
      category: item.category,
      action: 'discarded',
      cost: item.estimatedCost,
      weightGrams: item.estimatedWeightGrams,
      co2SavedKg: 0,
      date: today,
    };
    setRecords((prev) => [newRecord, ...prev]);

    setStats((prev) => ({
      ...prev,
      itemsDiscardedCount: prev.itemsDiscardedCount + 1,
      consecutiveStreakDays: 0, // resets streak
    }));

    showToast('error', `Marked ${item.name} as discarded`, `Logged in kitchen waste records.`);
  };

  // 3. Freeze Item
  const handleFreezeItem = (item: FoodItem) => {
    const currentExpiry = new Date(item.expiryDate);
    currentExpiry.setDate(currentExpiry.getDate() + 60); // Extend 60 days
    const newExpiry = currentExpiry.toISOString().split('T')[0];

    setInventory((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              location: 'freezer',
              expiryDate: newExpiry,
              storageTip: 'Frozen to prevent degradation. Thaw in fridge before cooking.',
            }
          : i
      )
    );

    showToast(
      'info',
      `Moved ${item.name} to Freezer`,
      `Shelf-life safely extended by 60 days (new expiry: ${newExpiry}).`
    );
  };

  // 4. Delete item permanently
  const handleDeleteItem = (itemId: string) => {
    setInventory((prev) => prev.filter((i) => i.id !== itemId));
    showToast('info', 'Item removed from kitchen');
  };

  // 5. Add new item
  const handleAddItem = (newItem: Omit<FoodItem, 'id' | 'status'>) => {
    const item: FoodItem = {
      ...newItem,
      id: 'item-' + Date.now(),
      status: 'active',
    };
    setInventory((prev) => [item, ...prev]);
    showToast('success', `Added ${item.name}`, `Stored in ${item.location}.`);
  };

  // 6. Batch Consume from Cook-First Studio
  const handleBatchConsume = (targetNames: string[], recipeTitle: string) => {
    let rescuedCount = 0;
    let savedDollars = 0;
    let savedCo2 = 0;
    const today = new Date().toISOString().split('T')[0];

    const updated = inventory.map((inv) => {
      if (inv.status === 'active') {
        const matches = targetNames.some(
          (t) =>
            inv.name.toLowerCase().includes(t.toLowerCase()) ||
            t.toLowerCase().includes(inv.name.toLowerCase())
        );
        if (matches) {
          rescuedCount++;
          savedDollars += inv.estimatedCost;
          savedCo2 += calculateEmissionsAverted(inv.category, inv.estimatedWeightGrams);
          return { ...inv, status: 'consumed' as const, actionDate: today };
        }
      }
      return inv;
    });

    if (rescuedCount > 0) {
      setInventory(updated);
      setStats((prev) => ({
        ...prev,
        totalDollarsSaved: Number((prev.totalDollarsSaved + savedDollars).toFixed(2)),
        totalKgRescued: Number((prev.totalKgRescued + (rescuedCount * 0.35)).toFixed(2)),
        totalCo2SavedKg: Number((prev.totalCo2SavedKg + savedCo2).toFixed(2)),
        itemsConsumedCount: prev.itemsConsumedCount + rescuedCount,
      }));

      triggerConfetti();
      showToast(
        'success',
        `Cooked "${recipeTitle}"!`,
        `Rescued ${rescuedCount} ingredients • +${formatCurrency(savedDollars)} saved!`
      );
    } else {
      showToast('info', `Cooked "${recipeTitle}"`, `Enjoy your meal!`);
    }
  };

  // 7. Reset to synthetic seed data
  const handleResetSeedData = () => {
    resetAllDataToSeed();
    setInventory(loadInventory());
    setStats(loadStats());
    setRecords(loadWasteRecords());
    showToast('info', 'Reset Kitchen Data', 'Restored synthetic demonstration pantry & statistics.');
  };

  const activeItems = inventory.filter((i) => i.status === 'active');
  const urgentCount = activeItems.filter((i) => {
    const u = getUrgencyStatus(i.expiryDate);
    return u === 'urgent' || u === 'soon';
  }).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        urgentCount={urgentCount}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onLaunchApp={() => setCurrentTab('inventory')}
            onExploreCookFirst={() => setCurrentTab('cook')}
            activeItemsCount={activeItems.length}
            urgentCount={urgentCount}
          />
        )}

        {currentTab === 'inventory' && (
          <InventoryView
            items={inventory}
            onConsumeItem={handleConsumeItem}
            onDiscardItem={handleDiscardItem}
            onFreezeItem={handleFreezeItem}
            onDeleteItem={handleDeleteItem}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onResetSeedData={handleResetSeedData}
          />
        )}

        {currentTab === 'cook' && (
          <CookFirstStudio
            inventory={inventory}
            onBatchConsume={handleBatchConsume}
            onNavigateToStock={() => setCurrentTab('inventory')}
          />
        )}

        {currentTab === 'impact' && (
          <WasteTracker
            stats={stats}
            records={records}
            onResetSeedData={handleResetSeedData}
            onRefreshData={() => {
              setInventory(loadInventory());
              setStats(loadStats());
              setRecords(loadWasteRecords());
            }}
          />
        )}
      </main>

      {/* Modals */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddItem={handleAddItem}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Floating Notifications */}
      <Toast toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default App;
