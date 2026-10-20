import { describe, it, expect, beforeEach } from 'vitest';
import { 
  loadInventory, 
  saveInventory, 
  loadStats, 
  saveStats, 
  exportDataAsJSON, 
  importDataFromJSON 
} from '../src/utils/storage';
import type { FoodItem } from '../src/types';

describe('Storage and Serialization Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads seed items when localStorage is empty', () => {
    const items = loadInventory();
    expect(items.length).toBeGreaterThan(0);
    expect(items[0]).toHaveProperty('name');
    expect(items[0]).toHaveProperty('expiryDate');
  });

  it('persists and retrieves updated inventory in localStorage', () => {
    const customItem: FoodItem = {
      id: 'custom-1',
      name: 'Test Gala Apples',
      category: 'produce',
      location: 'fridge',
      quantity: 4,
      unit: 'apples',
      addedDate: '2026-10-20',
      expiryDate: '2026-11-05',
      estimatedCost: 4.5,
      estimatedWeightGrams: 500,
      storageTip: 'Keep chilled',
      status: 'active',
    };

    saveInventory([customItem]);
    const retrieved = loadInventory();
    expect(retrieved.length).toBe(1);
    expect(retrieved[0].name).toBe('Test Gala Apples');
  });

  it('exports valid JSON schema containing inventory and statistics', () => {
    const jsonString = exportDataAsJSON();
    const parsed = JSON.parse(jsonString);

    expect(parsed.app).toBe('ExpiryGuard');
    expect(parsed.version).toBe('1.0.0');
    expect(Array.isArray(parsed.inventory)).toBe(true);
    expect(parsed.stats).toHaveProperty('totalDollarsSaved');
  });

  it('imports valid JSON payload successfully', () => {
    const backupPayload = {
      app: 'ExpiryGuard',
      version: '1.0.0',
      inventory: [
        {
          id: 'imported-1',
          name: 'Imported Organic Tofu',
          category: 'produce',
          location: 'fridge',
          quantity: 1,
          unit: 'block',
          addedDate: '2026-10-21',
          expiryDate: '2026-10-28',
          estimatedCost: 2.99,
          estimatedWeightGrams: 350,
          storageTip: 'Submerge in water',
          status: 'active',
        }
      ],
      stats: {
        totalDollarsSaved: 120.5,
        totalKgRescued: 15.2,
        totalCo2SavedKg: 38.0,
        itemsConsumedCount: 22,
        itemsDiscardedCount: 1,
        consecutiveStreakDays: 20,
      },
      records: []
    };

    const success = importDataFromJSON(JSON.stringify(backupPayload));
    expect(success).toBe(true);

    const loaded = loadInventory();
    expect(loaded.length).toBe(1);
    expect(loaded[0].name).toBe('Imported Organic Tofu');

    const stats = loadStats();
    expect(stats.totalDollarsSaved).toBe(120.5);
  });

  it('rejects malformed or invalid JSON imports gracefully', () => {
    const badJson = '{"notAValidPayload": true}';
    const success = importDataFromJSON(badJson);
    expect(success).toBe(false);
  });
});
