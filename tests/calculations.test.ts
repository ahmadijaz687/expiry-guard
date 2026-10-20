import { describe, it, expect } from 'vitest';
import { 
  getDaysRemaining, 
  getUrgencyStatus, 
  calculateEmissionsAverted, 
  matchRecipes, 
  formatCurrency, 
  formatWeight 
} from '../src/utils/calculations';
import type { FoodItem, RecipeSuggestion } from '../src/types';

describe('Calculations Utility Suite', () => {
  const mockToday = new Date('2026-10-21T12:00:00Z');

  // Test 1: Future dates
  it('calculates positive days remaining for future dates', () => {
    const futureDate = '2026-10-26'; // +5 days
    const days = getDaysRemaining(futureDate, mockToday);
    expect(days).toBe(5);
  });

  // Test 2: Same calendar day
  it('calculates 0 days remaining when date is today', () => {
    const todayStr = '2026-10-21';
    const days = getDaysRemaining(todayStr, mockToday);
    expect(days).toBe(0);
  });

  // Test 3: Past dates
  it('calculates negative days remaining for expired dates', () => {
    const pastDate = '2026-10-18'; // -3 days
    const days = getDaysRemaining(pastDate, mockToday);
    expect(days).toBe(-3);
  });

  // Test 4: Urgency status - urgent
  it('marks items expiring today or tomorrow as urgent', () => {
    expect(getUrgencyStatus('2026-10-21', mockToday)).toBe('urgent');
    expect(getUrgencyStatus('2026-10-22', mockToday)).toBe('urgent');
  });

  // Test 5: Urgency status - soon
  it('marks items expiring in 2 to 3 days as soon', () => {
    expect(getUrgencyStatus('2026-10-23', mockToday)).toBe('soon');
    expect(getUrgencyStatus('2026-10-24', mockToday)).toBe('soon');
  });

  // Test 6: Urgency status - fresh
  it('marks items expiring in > 3 days as fresh', () => {
    expect(getUrgencyStatus('2026-10-28', mockToday)).toBe('fresh');
  });

  // Test 7: Urgency status - expired
  it('marks items with past dates as expired', () => {
    expect(getUrgencyStatus('2026-10-19', mockToday)).toBe('expired');
  });

  // Test 8: Emissions averted for high-impact protein
  it('calculates carbon emissions averted for meat & seafood using 7.2 factor', () => {
    // 500g = 0.5kg * 7.2 = 3.6 kg CO2e
    const co2 = calculateEmissionsAverted('meat_seafood', 500);
    expect(co2).toBe(3.6);
  });

  // Test 9: Emissions averted for dairy
  it('calculates carbon emissions averted for dairy & eggs using 3.4 factor', () => {
    // 1000g = 1kg * 3.4 = 3.4 kg CO2e
    const co2 = calculateEmissionsAverted('dairy_eggs', 1000);
    expect(co2).toBe(3.4);
  });

  // Test 10: Zero weight safety
  it('returns 0 kg CO2e when weight is zero or negative', () => {
    expect(calculateEmissionsAverted('produce', 0)).toBe(0);
    expect(calculateEmissionsAverted('produce', -50)).toBe(0);
  });

  // Test 11: Recipe matching algorithm prioritization
  it('prioritizes recipes that use items expiring in the next 72 hours', () => {
    const mockInventory: FoodItem[] = [
      {
        id: '1',
        name: 'Baby Spinach',
        category: 'produce',
        location: 'fridge',
        quantity: 1,
        unit: 'pack',
        addedDate: '2026-10-18',
        expiryDate: '2026-10-22', // Urgent (1 day)
        estimatedCost: 3.5,
        estimatedWeightGrams: 200,
        storageTip: '',
        status: 'active',
      },
      {
        id: '2',
        name: 'Carrots',
        category: 'produce',
        location: 'fridge',
        quantity: 1,
        unit: 'pack',
        addedDate: '2026-10-10',
        expiryDate: '2026-11-10', // Fresh
        estimatedCost: 2.0,
        estimatedWeightGrams: 400,
        storageTip: '',
        status: 'active',
      }
    ];

    const mockRecipes: RecipeSuggestion[] = [
      {
        id: 'rec-fresh',
        title: 'Roasted Carrots',
        prepTimeMinutes: 20,
        difficulty: 'Easy',
        servings: 2,
        description: 'Test dish',
        targetIngredients: ['Carrots'],
        pantryStaples: [],
        instructions: ['Bake'],
      },
      {
        id: 'rec-urgent',
        title: 'Spinach Omelette',
        prepTimeMinutes: 10,
        difficulty: 'Easy',
        servings: 1,
        description: 'Urgent rescue dish',
        targetIngredients: ['Baby Spinach'],
        pantryStaples: [],
        instructions: ['Whisk and fry'],
      }
    ];

    const ranked = matchRecipes(mockInventory, mockRecipes, mockToday);
    expect(ranked[0].recipe.id).toBe('rec-urgent');
    expect(ranked[0].urgentIngredients).toContain('Baby Spinach');
  });

  // Test 12: Formatting helpers
  it('formats currency and weight correctly', () => {
    expect(formatCurrency(4.99)).toBe('$4.99');
    expect(formatWeight(450)).toBe('450 g');
    expect(formatWeight(1200)).toBe('1.2 kg');
  });
});
