import type { FoodItem, UserStats, WasteRecord } from '../types';
import { SYNTHETIC_INITIAL_STATS, SYNTHETIC_PAST_RECORDS, SYNTHETIC_SEED_ITEMS } from '../data/seed';

const STORAGE_KEYS = {
  ITEMS: 'expiry_guard_inventory_v1',
  STATS: 'expiry_guard_stats_v1',
  RECORDS: 'expiry_guard_records_v1',
  THEME: 'expiry_guard_theme_v1',
  HAS_SEEDED: 'expiry_guard_seeded_v1',
};

export function loadInventory(): FoodItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ITEMS);
    if (!raw) {
      saveInventory(SYNTHETIC_SEED_ITEMS);
      return SYNTHETIC_SEED_ITEMS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading inventory from localStorage, falling back to seed', e);
    return SYNTHETIC_SEED_ITEMS;
  }
}

export function saveInventory(items: FoodItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save inventory to localStorage', e);
  }
}

export function loadStats(): UserStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    if (!raw) {
      saveStats(SYNTHETIC_INITIAL_STATS);
      return SYNTHETIC_INITIAL_STATS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return SYNTHETIC_INITIAL_STATS;
  }
}

export function saveStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats', e);
  }
}

export function loadWasteRecords(): WasteRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (!raw) {
      saveWasteRecords(SYNTHETIC_PAST_RECORDS);
      return SYNTHETIC_PAST_RECORDS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return SYNTHETIC_PAST_RECORDS;
  }
}

export function saveWasteRecords(records: WasteRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save records', e);
  }
}

export function resetAllDataToSeed(): void {
  saveInventory(SYNTHETIC_SEED_ITEMS);
  saveStats(SYNTHETIC_INITIAL_STATS);
  saveWasteRecords(SYNTHETIC_PAST_RECORDS);
}

export function exportDataAsJSON(): string {
  const payload = {
    app: 'ExpiryGuard',
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    inventory: loadInventory(),
    stats: loadStats(),
    records: loadWasteRecords(),
  };
  return JSON.stringify(payload, null, 2);
}

export function importDataFromJSON(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || !Array.isArray(parsed.inventory)) {
      throw new Error('Invalid schema format');
    }
    saveInventory(parsed.inventory);
    if (parsed.stats) saveStats(parsed.stats);
    if (Array.isArray(parsed.records)) saveWasteRecords(parsed.records);
    return true;
  } catch (e) {
    console.error('Failed to import JSON data', e);
    return false;
  }
}
