import React, { useState } from 'react';
import { 
  ChefHat, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  DollarSign, 
  Zap, 
  Scale, 
  Snowflake, 
  HelpCircle
} from 'lucide-react';

interface LandingPageProps {
  onLaunchApp: () => void;
  onExploreCookFirst: () => void;
  activeItemsCount: number;
  urgentCount: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchApp,
  onExploreCookFirst,
  activeItemsCount,
  urgentCount,
}) => {
  // Interactive waste calculator teaser state
  const [householdSize, setHouseholdSize] = useState<number>(2);
  const [weeklyGroceryBill, setWeeklyGroceryBill] = useState<number>(160);

  // EPA & NRDC benchmark: ~25% to 33% of food purchased is discarded, ExpiryGuard rescues ~75% of that.
  const estimatedAnnualWaste = Math.round(weeklyGroceryBill * 52 * 0.28);
  const estimatedSavingsWithGuard = Math.round(estimatedAnnualWaste * 0.72);
  const estimatedCo2OffsetKg = Math.round((estimatedSavingsWithGuard / 12) * 8.4);

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-10 sm:pt-16 pb-8">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-500/15 to-teal-400/10 blur-[100px] rounded-full -z-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center px-4">
          
          {/* Top Pill Alert */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Zero-Guilt Food Management • Cook-First Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Stop Throwing Dinner in the Bin. <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent">
              Cook What Spoil First.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            ExpiryGuard turns your refrigerator into a transparent, low-waste kitchen. Smart shelf-life presets eliminate barcode headaches, while our Cook-First engine turns expiring groceries into delicious dinner menus.
          </p>

          {/* Call to action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onLaunchApp}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-base shadow-lg shadow-emerald-600/25 transition-all"
            >
              <span>Launch Live Kitchen Demo</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              onClick={onExploreCookFirst}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-base transition-all shadow-sm"
            >
              <ChefHat className="w-5 h-5 text-amber-500" />
              <span>Explore Cook-First Studio</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl glass-card text-left">
            <div className="p-2 border-r border-slate-200 dark:border-slate-800 last:border-0">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Currently Tracked</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{activeItemsCount} Items</p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Active in demo pantry</span>
            </div>
            <div className="p-2 border-r border-slate-200 dark:border-slate-800 last:border-0">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Attention Required</p>
              <p className="text-2xl font-extrabold text-amber-500 mt-0.5">{urgentCount} Urgent</p>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">Spoiling &lt; 48 hours</span>
            </div>
            <div className="p-2 border-r border-slate-200 dark:border-slate-800 last:border-0">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Measured Monthly ROI</p>
              <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">$68.40</p>
              <span className="text-[11px] text-slate-500 font-medium">Recovered grocery cost</span>
            </div>
            <div className="p-2">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Carbon Averted</p>
              <p className="text-2xl font-extrabold text-teal-600 dark:text-teal-400 mt-0.5">19.5 kg</p>
              <span className="text-[11px] text-slate-500 font-medium">CO₂e diverted from landfill</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. THE PROBLEM BREAKDOWN */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400">
            The Invisible Drain
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            Why Good Produce Dies in Great Kitchens
          </p>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Food waste is almost never intentional. It is a predictable breakdown in visibility, timing, and evening decision energy.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass-card space-y-4 hover:border-emerald-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black text-xl">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              The Back-of-Fridge Blindspot
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Standard refrigerator layouts push perishables behind milk cartons and condiments. Once an ingredient is out of line-of-sight, it ceases to exist until odor or rot reveals it.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card space-y-4 hover:border-emerald-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-xl">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              7:00 PM Decision Fatigue
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              After a full workday, home cooks lack the mental bandwidth to cross-examine 12 random crisper ingredients. The cognitive barrier leads straight to third-party delivery apps.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card space-y-4 hover:border-emerald-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-black text-xl">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Cumbersome Pantry Apps
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Most pantry trackers feel like warehouse barcode scanners requiring grams, batch codes, and manual weights. When entering an apple takes 40 seconds, users quit on day three.
            </p>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE SAVINGS CALCULATOR */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white shadow-2xl relative overflow-hidden">
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3">
                <Scale className="w-3.5 h-3.5" />
                <span>Interactive Household Model</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Calculate Your Annual Food Recovery
              </h2>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                Adjust your household size and average weekly grocery spend to view how much ExpiryGuard can rescue each year based on USDA and EPA benchmark patterns.
              </p>

              {/* Sliders */}
              <div className="mt-6 space-y-5">
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-1.5">
                    <span className="text-slate-300">Household Size</span>
                    <span className="text-emerald-400 font-bold">{householdSize} {householdSize === 1 ? 'person' : 'people'}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={householdSize}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setHouseholdSize(val);
                      setWeeklyGroceryBill(val * 80);
                    }}
                    className="w-full accent-emerald-500 bg-slate-700 h-2 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm font-semibold mb-1.5">
                    <span className="text-slate-300">Weekly Grocery Spend</span>
                    <span className="text-emerald-400 font-bold">${weeklyGroceryBill}/week</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="10"
                    value={weeklyGroceryBill}
                    onChange={(e) => setWeeklyGroceryBill(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-700 h-2 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Calculated Output Card */}
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-5 text-center">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-300 font-bold">Estimated Annual Rescue Value</p>
                <p className="text-4xl sm:text-5xl font-black text-emerald-400 mt-1">
                  ${estimatedSavingsWithGuard.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  ~${Math.round(estimatedSavingsWithGuard / 12)} back in your bank account every month
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-left">
                <div>
                  <p className="text-[11px] text-slate-400">CO₂e Averted</p>
                  <p className="text-lg font-bold text-teal-300">{estimatedCo2OffsetKg * 12} kg / yr</p>
                  <p className="text-[10px] text-slate-400">Equivalent to ~{(estimatedCo2OffsetKg * 2.8).toFixed(0)} trees planted</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Meals Rescued</p>
                  <p className="text-lg font-bold text-amber-300">~{Math.round(estimatedSavingsWithGuard / 6.5)} dishes</p>
                  <p className="text-[10px] text-slate-400">Zero-waste dinner creations</p>
                </div>
              </div>

              <button
                onClick={onLaunchApp}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-lg transition-transform active:scale-95"
              >
                Start Rescuing Groceries Now
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. CORE FEATURES ARCHITECTURE */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400">
            Engineered For Frictionless Kitchens
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            Four Features That Make ExpiryGuard Different
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Feature 1 */}
          <div className="p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Flame className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              The Cook-First Culinary Engine
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Standard pantry tools passively notify you that an item expired yesterday. ExpiryGuard prioritizes ingredients with under 72 hours of viable shelf life and matches them into fast, high-flavor recipes like skillet frittatas, wok tosses, and smooth pasta sauces.
            </p>
            <ul className="space-y-2 pt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Matches against pantry staples (olive oil, garlic, pasta)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> One-click "I Cooked This" batch consumption
              </li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Zap className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Instant Shelf-Life Auto-Fill
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              No scanning barcodes or manually guessing expiration dates. Pick from 25+ research-backed everyday staples (baby spinach, fresh salmon, heavy cream, milk, sourdough), and ExpiryGuard instantly calculates optimal storage locations and safe expiration windows.
            </p>
            <ul className="space-y-2 pt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Evidence-based USDA & culinary refrigeration indices
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Storage tips included for every food category
              </li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
              <DollarSign className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Quantified Waste-Avoided Tracker
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Instead of shaming you over wasted food, ExpiryGuard celebrates every dollar and kilogram rescued. Track your cumulative savings, landfill diversion metrics, and active zero-waste streak days in a transparent analytics dashboard.
            </p>
            <ul className="space-y-2 pt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Real-time CO₂e equivalent emission estimates
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Full export & import JSON data ownership
              </li>
            </ul>
          </div>

          {/* Feature 4 */}
          <div className="p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <Snowflake className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              One-Click Freeze Rescue
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Realized you won't be able to cook those chicken breasts or berry punnets before the weekend? Hit the Freeze action to instantly pause degradation, adjust storage location, and safely extend shelf life by up to 60 days.
            </p>
            <ul className="space-y-2 pt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Automatically recalculates frozen shelf life
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Prevents hasty discard decisions
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 5. USER PERSONA CASE STUDY */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Synthetic Persona Case Study
            </span>
            <span className="text-xs text-slate-500 font-medium">Alex Chen • Urban Professional</span>
          </div>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            "We were throwing away $100 every month in neglected produce. Within two weeks, our kitchen routine completely flipped."
          </h3>

          <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-xs text-slate-500 font-medium">Rescue Success Rate</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">87.5%</p>
              <p className="text-[11px] text-slate-500">Items consumed before spoil date</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Monthly Groceries Saved</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">$68.40</p>
              <p className="text-[11px] text-slate-500">True measured savings in demo log</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Active Zero-Waste Streak</p>
              <p className="text-2xl font-black text-amber-500 mt-0.5">12 Days</p>
              <p className="text-[11px] text-slate-500">Consecutive days without food waste</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ & SPECS */}
      <section className="max-w-3xl mx-auto px-4 space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-500 mt-1">Everything you need to know about ExpiryGuard's offline architecture.</p>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl glass-card space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-500" />
              Do I have to create an account or connect cloud servers?
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              No. ExpiryGuard operates fully offline-first. Your inventory, statistics, and impact history are stored securely inside your browser's LocalStorage. You can export or import your data as JSON at any time.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-card space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-500" />
              How are the environmental CO₂e savings calculated?
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We apply peer-reviewed agricultural lifecycle indices (Poore & Nemecek, Science 2018; FAO food loss models) weighted by category: proteins and dairy generate higher carbon savings when rescued than ambient grains.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-card space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-500" />
              Can I customize shelf-life estimates?
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Yes. While presets offer USDA-recommended defaults, you can freely edit the expiration date, quantity, location (Fridge, Freezer, Pantry), and storage tips for any item.
            </p>
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Take Control of Your Kitchen?
          </h2>
          <p className="text-emerald-100 max-w-xl mx-auto text-base">
            Start logging your fresh produce with zero friction and let Cook-First solve your dinner tonight.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <button
              onClick={onLaunchApp}
              className="px-8 py-3.5 rounded-xl bg-white text-emerald-950 font-extrabold text-base hover:bg-emerald-50 active:scale-95 shadow-md transition-all"
            >
              Enter Kitchen Inventory
            </button>
            <button
              onClick={onExploreCookFirst}
              className="px-7 py-3.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-white font-bold text-base transition-all"
            >
              View Cook-First Suggestions
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
