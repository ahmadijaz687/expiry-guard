import React, { useState } from 'react';
import type { FoodItem } from '../types';
import { RECIPE_CATALOG } from '../data/recipes';
import { matchRecipes, getUrgencyStatus } from '../utils/calculations';
import { 
  ChefHat, 
  Flame, 
  Clock, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Utensils 
} from 'lucide-react';

interface CookFirstStudioProps {
  inventory: FoodItem[];
  onBatchConsume: (itemNames: string[], recipeTitle: string) => void;
  onNavigateToStock?: () => void;
}

export const CookFirstStudio: React.FC<CookFirstStudioProps> = ({
  inventory,
  onBatchConsume,
}) => {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(RECIPE_CATALOG[0].id);

  // Match recipes with live inventory
  const matchedRecipes = matchRecipes(inventory, RECIPE_CATALOG);

  // Find urgent items expiring within 72h
  const activeItems = inventory.filter((i) => i.status === 'active');
  const urgentItems = activeItems.filter((i) => {
    const u = getUrgencyStatus(i.expiryDate);
    return u === 'urgent' || u === 'soon';
  });

  const currentMatched = matchedRecipes.find((m) => m.recipe.id === selectedRecipeId) || matchedRecipes[0];
  const currentRecipe = currentMatched.recipe;

  const handleCookThis = () => {
    onBatchConsume(currentMatched.matchedIngredients, currentRecipe.title);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. URGENT RESCUE ALERT HEADER */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-emerald-500/10 border border-amber-300 dark:border-amber-800/60 glass-card">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
              <ChefHat className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Cook-First Rescue Studio
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-amber-500 text-white">
                  Standout Feature
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Our algorithm matches dishes prioritizing groceries that will spoil within 72 hours. Cooking these today saves your food, saves money, and clears your kitchen guilt.
              </p>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900/50 text-right">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Expiring in &lt; 72h</p>
            <p className="text-xl font-black text-amber-600 dark:text-amber-400">{urgentItems.length} Ingredients</p>
            <div className="flex flex-wrap gap-1 mt-1 justify-end max-w-xs">
              {urgentItems.slice(0, 3).map((item) => (
                <span key={item.id} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                  {item.name}
                </span>
              ))}
              {urgentItems.length > 3 && (
                <span className="text-[10px] text-slate-400">+{urgentItems.length - 3} more</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE: RECIPE LIST & DETAIL */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left Column: Recipe Suggestion Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Ranked by Rescue Priority
            </h3>
            <span className="text-xs text-slate-400">{matchedRecipes.length} dishes matched</span>
          </div>

          <div className="space-y-3">
            {matchedRecipes.map(({ recipe, urgentIngredients, matchScore }) => {
              const isSelected = recipe.id === currentRecipe.id;

              return (
                <div
                  key={recipe.id}
                  onClick={() => setSelectedRecipeId(recipe.id)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'glass-card border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                      : 'glass-card border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">
                      {recipe.title}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-black shrink-0 ${
                      matchScore >= 75
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : matchScore >= 40
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {matchScore}% Match
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {recipe.description}
                  </p>

                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {recipe.prepTimeMinutes} mins
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {recipe.servings} servings
                    </span>
                    <span>•</span>
                    <span className="font-medium">{recipe.difficulty}</span>
                  </div>

                  {/* Rescued Ingredients Badges */}
                  {urgentIngredients.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-rose-500 fill-rose-500" /> Rescues:
                      </span>
                      {urgentIngredients.map((name) => (
                        <span key={name} className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-semibold">
                          {name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Recipe Detail & Cooking Walkthrough (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-6">
            
            {/* Header */}
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {currentRecipe.difficulty} Recipe
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 font-semibold">{currentRecipe.prepTimeMinutes} Minutes Total</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                {currentRecipe.title}
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {currentRecipe.description}
              </p>
            </div>

            {/* Ingredients Matrix */}
            <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              
              {/* Target Pantry Items from Inventory */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  From Your Kitchen ({currentMatched.matchedIngredients.length}/{currentRecipe.targetIngredients.length})
                </h4>
                <ul className="space-y-1.5 text-xs">
                  {currentRecipe.targetIngredients.map((target) => {
                    const isMatched = currentMatched.matchedIngredients.includes(target);
                    const isUrgent = currentMatched.urgentIngredients.includes(target);

                    return (
                      <li key={target} className="flex items-center gap-2 font-medium">
                        {isMatched ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                        )}
                        <span className={isMatched ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400'}>
                          {target}
                        </span>
                        {isUrgent && (
                          <span className="text-[10px] font-extrabold text-rose-500 bg-rose-100 dark:bg-rose-950 px-1 rounded">
                            Urgent!
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Standard Pantry Staples */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                  Common Pantry Staples
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  {currentRecipe.pantryStaples.map((staple) => (
                    <li key={staple} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span>{staple}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Cooking Walkthrough</span>
              </h4>
              <div className="space-y-2.5">
                {currentRecipe.instructions.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <span className="w-5 h-5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar: I Cooked This Tonight! */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500">
                  Ready to eat? Marking this as cooked consumes matching ingredients and logs your avoided food waste.
                </p>
              </div>

              <button
                onClick={handleCookThis}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-sm shadow-md shadow-emerald-600/25 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>I Cooked This Tonight!</span>
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
