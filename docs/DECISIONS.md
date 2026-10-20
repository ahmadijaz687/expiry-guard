# Architecture Decision Records (ADR) & Originality Audit: ExpiryGuard

## ADR 001: Originality Audit & Market Distinction
- **Date**: 2026-10-21
- **Status**: Accepted
- **Context**:
  Existing grocery and fridge apps (e.g., generic pantry counters, grocery list apps) fail because they treat kitchen inventory like warehouse ERP systems: users are required to scan barcodes, input batch numbers, and manually type weights. Consequently, users abandon them within 3 days.
- **Decision**:
  ExpiryGuard differentiates itself through two core mechanics:
  1. **Zero-Friction "Shelf-Life Presets"**: Selecting common staples automatically fills optimal location, storage tip, and realistic spoilage windows.
  2. **Cook-First Suggestion Algorithm**: Rather than just displaying a passive red warning text, ExpiryGuard dynamically clusters items reaching expiration in the next 72 hours and surfaces actionable, home-cook-friendly recipe concepts.
  3. **Quantified Positive Feedback Loop (Waste Avoided Tracker)**: Quantifies financial savings ($) and ecological impact (kg CO₂e), transforming guilt into positive reinforcement.

---

## ADR 002: Frontend Architecture & Client-Side Persistence
- **Date**: 2026-10-21
- **Status**: Accepted
- **Context**:
  As a Tier 1 (Beginner) project adhering to the instructions:
  - Requires clean component structure, responsive layout, dark/light theme, and empty/error states.
  - Data must persist without requiring an expensive backend server or cloud login barrier.
- **Decision**:
  - Build with **React 19 + TypeScript + Vite**.
  - Persist application state in browser `localStorage` with versioned schema migration and automated fallback to realistic synthetic seed data for instant evaluation.
  - Provide complete JSON Data Export/Import, allowing users full data ownership and offline reliability.

---

## ADR 003: Design System & Styling Strategy
- **Date**: 2026-10-21
- **Status**: Accepted
- **Context**:
  The application must look like a modern commercial consumer product with high visual polish, WCAG AA compliance, and responsive layouts across mobile and desktop.
- **Decision**:
  - **Color Palette**:
    - Primary: Crisp Forest Emerald (`emerald-600` / `emerald-500` dark mode) reflecting freshness and sustainability.
    - Urgency Accents: Warning Amber (`amber-500`), Spoilage Rose (`rose-500`), Fresh Mint (`teal-500`).
    - Neutrals: Slate gray system with subtle translucent glassmorphic surfaces (`backdrop-blur-md`).
  - **Typography**: Clean sans-serif hierarchy with balanced tracking and font weights.
  - **Motion**: Micro-animations capped at 150–200ms using CSS transitions, with strict `prefers-reduced-motion` compliance.

---

## ADR 004: Testing & Quality Gate Plan
- **Date**: 2026-10-21
- **Status**: Accepted
- **Decision**:
  - Implement minimum 10 rigorous unit tests using Vitest and Testing Library.
  - Cover core domain algorithms:
    - Expiry status classification (`urgent`, `expiring_soon`, `fresh`, `expired`).
    - Waste calculation formula (CO₂e conversion factors and cost estimates).
    - Cook-first recipe ranking and ingredient matching.
    - Local storage serialization/deserialization.
