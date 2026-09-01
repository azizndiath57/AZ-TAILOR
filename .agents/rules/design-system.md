# AZ-TAILOR - Flat Design System & UI Guidelines

This document outlines the strict design rules that must be followed when building components and pages for the AZ-TAILOR application (like clients, measurements, fittings, settings, etc.). Our UI uses a modern "Flat & Clean" aesthetic, leveraging Tailwind CSS. 

Do not use heavy shadows, gradient backgrounds, or 3D effects. Rely on subtle borders, clean typography, whitespace, and soft hover transitions.

## 1. Global Layout & Structure
- **Page Container:** Every page must be wrapped in:
  `<div className="max-w-7xl mx-auto space-y-8">` (Use `max-w-4xl` or `max-w-5xl` for settings/forms if they shouldn't stretch too wide).
- **Page Header:** Always include a flexbox header containing the title and an optional action button. Responsive wrapping is mandatory.
  ```tsx
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div>
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-800">Title</h2>
      <p className="text-sm text-gray-500 mt-1">Subtitle description.</p>
    </div>
    {/* Optional Action Button */}
  </div>
  ```

## 2. Card & Container Aesthetics (The "Flat" Rule)
We **NEVER** use heavy drop shadows (`shadow-md`, `shadow-lg`, etc.). Depth is created using subtle borders, light background colors, and very soft `shadow-sm` on specific tiny elements (like buttons).
- **Card Wrapper:** `<div className="bg-white border border-gray-200 rounded-xl overflow-hidden">`
- **Inner Padding:** Usually `p-4 md:p-6` or `p-6 md:p-8`.
- **Section Headers (Inside Cards):** `<h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">`

## 3. Typography & Text Colors
- **Primary Text:** `text-gray-900` or `text-gray-800`.
- **Secondary/Muted Text:** `text-gray-500` or `text-gray-400`.
- **Brand Highlights:** `text-brand` (custom color `#B48C5A` defined in `globals.css`).
- **Font Sizes & Weights:** 
  - Main titles: `text-2xl md:text-3xl font-semibold tracking-tight`.
  - Subtitles/Labels: `text-sm font-medium` or `text-xs font-semibold uppercase tracking-wide`.

## 4. Buttons & Interactive Elements
- **Primary Action (Dark):** 
  `<button className="px-4 py-2 bg-midnight text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-2 justify-center">`
- **Secondary Action (Outlined):** 
  `<button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm">`
- **Icon Buttons:** 
  `<button className="flex items-center justify-center p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">`

## 5. Forms & Inputs
- **Labels:** `<label className="block text-sm font-medium text-gray-700 mb-1">`
- **Inputs/Selects:** 
  `<input className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" />`

## 6. Badges & Status Indicators
Always use soft pastel backgrounds (`bg-[color]-50` or `100`) with strongly saturated text colors.
- **Example (Standard Status):** 
  `<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">En cours</span>`
- **Example (Tiny Info Tag):** 
  `<span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-red-50 text-red-600">Urgent</span>`

## 7. Lists, Tables & Hover Animations
- Use `divide-y divide-gray-100` on list containers or table bodies to separate items cleanly.
- **Hover Effects:** Every interactive row or list item must highlight gently: `<div className="hover:bg-gray-50 transition-colors">` or `<tr className="hover:bg-gray-50 transition-colors">`.

## 8. Icons
- We use Google Material Symbols. Always include `aria-hidden="true"`.
- Adjust sizing explicitly with Tailwind brackets if needed: `<span aria-hidden="true" className="material-symbols-outlined text-[18px]">icon_name</span>`.

## 9. Responsiveness
- Use `flex-col sm:flex-row` for headers, actions, and list items that need to stack on mobile.
- **Tables:** Ensure horizontal scrolling on mobile: 
  `<div className="overflow-hidden overflow-x-auto"><table className="w-full text-left min-w-[800px]">...</table></div>`
- Ensure full-width buttons on mobile with `w-full sm:w-auto`.
