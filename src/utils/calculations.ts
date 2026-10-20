import type { FoodCategory, FoodItem, RecipeSuggestion, UrgencyStatus } from '../types';

/**
 * Calculates calendar days between today and the target expiry date.
 * Positive = days until expiry; 0 = expires today; Negative = days expired.
 */
export function getDaysRemaining(expiryDate: string, referenceDate: Date = new Date()): number {
  const target = new Date(expiryDate);
  // Strip time component for pure calendar date comparison
  const ref = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const tgt = new Date(target.getFullYear(), target.getMonth(), target.getDate());

  const diffMs = tgt.getTime() - ref.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Maps days remaining into standardized urgency buckets:
 * - 'expired': days < 0
 * - 'urgent': 0 to 1 days (due today or tomorrow)
 * - 'soon': 2 to 3 days (within 72 hours)
 * - 'fresh': > 3 days
 */
export function getUrgencyStatus(expiryDate: string, referenceDate: Date = new Date()): UrgencyStatus {
  const days = getDaysRemaining(expiryDate, referenceDate);
  if (days < 0) return 'expired';
  if (days <= 1) return 'urgent';
  if (days <= 3) return 'soon';
  return 'fresh';
}

/**
 * Estimated lifecycle greenhouse gas emissions per kg of food by category.
 * Source: Derived from FAO / Poore & Nemecek (Science 2018) food loss indices.
 */
const CO2_FACTOR_PER_KG: Record<FoodCategory, number> = {
  meat_seafood: 7.2,   // High-impact protein emissions
  dairy_eggs: 3.4,     // Cold-chain and livestock factor
  produce: 1.3,        // Agriculture & refrigerated transport
  bakery: 1.6,         // Grain processing & baking energy
  pantry: 1.5,         // Packaged shelf goods
  beverages: 1.1,      // Bottling & distribution
  frozen: 2.2,         // Continuous freezing electricity
  leftovers: 3.0,      // Composite cooked meal benchmark
};

/**
 * Calculates averted kg CO2e for rescued food based on category and weight in grams.
 */
export function calculateEmissionsAverted(category: FoodCategory, weightGrams: number): number {
  const factor = CO2_FACTOR_PER_KG[category] || 2.0;
  const kg = Math.max(0, weightGrams) / 1000;
  return Number((kg * factor).toFixed(2));
}

export interface MatchedRecipe {
  recipe: RecipeSuggestion;
  matchedIngredients: string[];
  urgentIngredients: string[];
  matchScore: number; // percentage 0 - 100
}

/**
 * Scores and ranks recipes based on active inventory, heavily weighting items expiring in <= 3 days.
 */
export function matchRecipes(
  inventory: FoodItem[],
  recipes: RecipeSuggestion[],
  referenceDate: Date = new Date()
): MatchedRecipe[] {
  const activeItems = inventory.filter((item) => item.status === 'active');
  
  return recipes
    .map((recipe) => {
      const matchedIngredients: string[] = [];
      const urgentIngredients: string[] = [];

      recipe.targetIngredients.forEach((targetName) => {
        const found = activeItems.find(
          (inv) => inv.name.toLowerCase().includes(targetName.toLowerCase()) ||
                   targetName.toLowerCase().includes(inv.name.toLowerCase())
        );

        if (found) {
          matchedIngredients.push(found.name);
          const urgency = getUrgencyStatus(found.expiryDate, referenceDate);
          if (urgency === 'urgent' || urgency === 'soon') {
            urgentIngredients.push(found.name);
          }
        }
      });

      // Calculate score: base match + high bonus for saving urgent items
      const baseRatio = recipe.targetIngredients.length > 0
        ? matchedIngredients.length / recipe.targetIngredients.length
        : 0;
      
      const urgentBonus = urgentIngredients.length * 0.25;
      const finalScore = Math.min(100, Math.round((baseRatio * 75 + urgentBonus * 25)));

      return {
        recipe,
        matchedIngredients,
        urgentIngredients,
        matchScore: finalScore,
      };
    })
    .sort((a, b) => {
      // Prioritize recipes that save urgent items first, then overall score
      if (b.urgentIngredients.length !== a.urgentIngredients.length) {
        return b.urgentIngredients.length - a.urgentIngredients.length;
      }
      return b.matchScore - a.matchScore;
    });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatWeight(grams: number): string {
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(1)} kg`;
  }
  return `${Math.round(grams)} g`;
}
