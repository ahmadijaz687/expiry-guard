import type { RecipeSuggestion } from '../types';

export const RECIPE_CATALOG: RecipeSuggestion[] = [
  {
    id: 'frittata-rescue',
    title: 'Zero-Waste Skillet Frittata',
    prepTimeMinutes: 18,
    difficulty: 'Easy',
    servings: 3,
    description: 'The ultimate kitchen-sink hero: whisk eggs with wilting greens, cheeses, and peppers for a protein-packed dinner.',
    targetIngredients: ['Baby Spinach', 'Pasture-Raised Eggs', 'Bell Peppers', 'Cheddar Cheese Block', 'Broccoli Crown'],
    pantryStaples: ['Olive oil', 'Salt & black pepper', 'Garlic powder'],
    instructions: [
      'Preheat oven to 375°F (190°C) or prepare a covered non-stick skillet on medium-low.',
      'Sauté chopped peppers, broccoli, or wilting spinach in 1 tbsp olive oil for 3 minutes until softened.',
      'Whisk 4 to 6 eggs with salt, pepper, and a splash of milk or cream.',
      'Pour egg mixture over vegetables, fold in grated cheese, and cook undisturbed for 4 minutes.',
      'Transfer skillet to oven (or cover pan) for 8-10 minutes until eggs are golden and set.'
    ]
  },
  {
    id: 'stir-fry-crisp',
    title: 'High-Heat Crispy Veggie & Protein Stir-Fry',
    prepTimeMinutes: 15,
    difficulty: 'Easy',
    servings: 2,
    description: 'Fast, vibrant high-heat wok toss that revives crunch in vegetables and cooks proteins in minutes.',
    targetIngredients: ['Chicken Breasts', 'Bell Peppers', 'Broccoli Crown', 'Carrots'],
    pantryStaples: ['Soy sauce', 'Cooking oil', 'Garlic & ginger', 'Sesame oil or seeds'],
    instructions: [
      'Slice chicken into thin bite-sized strips and chop vegetables evenly.',
      'Heat 1 tbsp cooking oil in a large skillet or wok over high heat until smoking.',
      'Sear chicken for 4-5 minutes until browned and cooked through, then remove.',
      'Add broccoli florets, sliced carrots, and bell peppers; stir-fry vigorously for 3 minutes with a splash of water.',
      'Return chicken, drizzle with 2 tbsp soy sauce and minced garlic, toss for 60 seconds and serve over rice.'
    ]
  },
  {
    id: 'creamy-pasta-silk',
    title: 'Pan-Seared Salmon & Creamy Herb Tagliatelle',
    prepTimeMinutes: 20,
    difficulty: 'Medium',
    servings: 2,
    description: 'Transform expiring cream, fresh salmon, and greens into a luxury bistro pasta in 20 minutes.',
    targetIngredients: ['Atlantic Salmon Fillet', 'Heavy Cream', 'Baby Spinach', 'Fresh Mozzarella'],
    pantryStaples: ['Pasta (Fettuccine or Penne)', 'Butter & olive oil', 'Salt, pepper & lemon'],
    instructions: [
      'Boil pasta in generously salted water until al dente; reserve 1/2 cup pasta cooking water.',
      'Season salmon fillet with salt and pepper; sear skin-side down in olive oil for 4 minutes, flip and cook 2 minutes more, then flake into chunks.',
      'In the same skillet, reduce heat, pour in heavy cream and gently simmer for 2 minutes.',
      'Fold in baby spinach until wilted, toss with cooked pasta and reserved starchy water.',
      'Top with flaked salmon and mozzarella, finishing with cracked pepper and fresh lemon zest.'
    ]
  },
  {
    id: 'berry-cream-smoothie',
    title: 'Antioxidant Berry Smoothie Bowl',
    prepTimeMinutes: 5,
    difficulty: 'Easy',
    servings: 1,
    description: 'Save ripe berries, bananas, and yogurt in a fast, nutrient-dense breakfast or snack.',
    targetIngredients: ['Strawberries', 'Bananas', 'Greek Yogurt', 'Whole Milk', 'Almond Milk (Unsweetened)'],
    pantryStaples: ['Honey or maple syrup', 'Chia seeds or granola'],
    instructions: [
      'Add strawberries, sliced bananas, 1/2 cup Greek yogurt, and a splash of milk to blender.',
      'Blend on high for 45-60 seconds until thick and velvety.',
      'Pour into a bowl and top with remaining sliced fruit, granola, or seeds.'
    ]
  },
  {
    id: 'med-hummus-wrap',
    title: 'Crunchy Mediterranean Deli Wrap',
    prepTimeMinutes: 8,
    difficulty: 'Easy',
    servings: 2,
    description: 'Use open hummus, avocado, tortillas, and fresh crisper veggies for a clean, zero-cooking lunch.',
    targetIngredients: ['Whole Grain Tortillas', 'Hummus Dip', 'Avocado (Ripe)', 'Baby Spinach', 'Bell Peppers'],
    pantryStaples: ['Black pepper', 'Lemon juice', 'Red pepper flakes'],
    instructions: [
      'Warm tortillas on a dry skillet for 20 seconds each until pliable.',
      'Spread 3 generous tablespoons of hummus evenly across center.',
      'Layer sliced avocado, crisp bell pepper ribbons, and a handful of baby spinach.',
      'Season with black pepper and lemon juice, roll tightly, slice diagonally, and enjoy.'
    ]
  },
  {
    id: 'golden-french-toast',
    title: 'Custard Brioche French Toast Bake',
    prepTimeMinutes: 12,
    difficulty: 'Easy',
    servings: 3,
    description: 'Give stale artisan bread or brioche buns second life with an aromatic cinnamon-egg custard soak.',
    targetIngredients: ['Artisan Sourdough Loaf', 'Brioche Burger Buns', 'Pasture-Raised Eggs', 'Whole Milk', 'Heavy Cream'],
    pantryStaples: ['Butter', 'Cinnamon', 'Vanilla extract', 'Maple syrup'],
    instructions: [
      'Whisk eggs, milk, a dash of heavy cream, cinnamon, and vanilla in a shallow dish.',
      'Slice bread into 1-inch thick slices and soak both sides in the custard for 30 seconds.',
      'Melt 1 tbsp butter in a skillet over medium heat.',
      'Cook slices for 3-4 minutes per side until caramelized and golden brown.',
      'Serve warm with pure maple syrup and fresh fruit.'
    ]
  }
];
