export type StorageLocation = 'fridge' | 'freezer' | 'pantry';

export type FoodCategory =
  | 'produce'
  | 'dairy_eggs'
  | 'meat_seafood'
  | 'bakery'
  | 'pantry'
  | 'beverages'
  | 'frozen'
  | 'leftovers';

export type UrgencyStatus = 'urgent' | 'soon' | 'fresh' | 'expired';

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  location: StorageLocation;
  quantity: number;
  unit: string;
  addedDate: string; // ISO date YYYY-MM-DD
  expiryDate: string; // ISO date YYYY-MM-DD
  estimatedCost: number; // in USD
  estimatedWeightGrams: number;
  storageTip: string;
  status: 'active' | 'consumed' | 'discarded';
  actionDate?: string;
}

export interface WasteRecord {
  id: string;
  itemId: string;
  name: string;
  category: FoodCategory;
  action: 'consumed' | 'discarded';
  cost: number;
  weightGrams: number;
  co2SavedKg: number;
  date: string;
}

export interface PresetFoodItem {
  name: string;
  category: FoodCategory;
  defaultLocation: StorageLocation;
  shelfLifeDays: number;
  storageTip: string;
  defaultCost: number;
  defaultWeightGrams: number;
  defaultUnit: string;
}

export interface RecipeSuggestion {
  id: string;
  title: string;
  prepTimeMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Intermediate';
  targetIngredients: string[]; // matching inventory items
  pantryStaples: string[]; // commonly available items like oil, salt, garlic
  instructions: string[];
  description: string;
  servings: number;
}

export interface UserStats {
  totalDollarsSaved: number;
  totalKgRescued: number;
  totalCo2SavedKg: number;
  itemsConsumedCount: number;
  itemsDiscardedCount: number;
  consecutiveStreakDays: number;
}
