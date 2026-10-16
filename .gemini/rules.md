<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Developer Guidelines & Architectural Constraints - Chamscare PDEMS

## HR Operations Scope and Attendance Lock
- In this chat/task, create, edit, and update application features only within the HR Operations area unless the user explicitly changes this scope. Keep changes isolated so they do not affect other ERP features.
- On HR Operations Attendance Tracking / Mark Attendance & Shift Schedule, past dates are always read-only. Present, Late, Absent, and worked Half-Day attendance can only be recorded for today. Leave Day and Half-Day Leave can be scheduled for today or a future selected date; future dates cannot be marked as worked attendance.

## 1. Security & Credentials Safety (STRICT)
- NEVER commit `.env`, `.env.local`, `.env.production`, or private key files to Git.
- ALL environment variables must be validated using Zod via `src/env.ts`.
- NEVER prefix sensitive keys (e.g., `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`) with `NEXT_PUBLIC_`.
- NEVER log passwords, API keys, or user credentials to the browser console.
- Validate and sanitize all user inputs on the backend using Zod schemas.

## 2. Clean Code & Architecture Rules
- **Type Safety**: Enforce strict TypeScript typing across all files. Explicitly forbid `any` types.
- **Component Separation**:
  - `src/components/ui/`: Reusable, atomic UI components (Button, Input, Card, Badge).
  - `src/components/layout/`: Global structure (Sidebar, Header, Footer).
  - `src/components/modules/`: Domain/Epic-specific features (Production, FieldSales, Payroll, Analytics).
- **Single Responsibility**: Keep components under 150 lines where possible. Extract custom hooks and utility functions.
- **Client vs Server Components**: Use `'use client'` ONLY when state (`useState`), effects (`useEffect`), or browser events are required. Keep page layouts as Server Components by default.

## 3. UI & Theme Consistency
- **Primary Brand Accent**: `#006C4A` (Dark Emerald).
- **Sidebar Background**: `#08121E` (Dark Slate / Deep Navy).
- **Background**: `#F8FAFC` (Clean Light Gray).
- **Iconography**: Use `lucide-react` icons exclusively.

## 4. Modal, Dialog & System Calls UX (STRICT)
- **FORBID Native Browser Popups**: NEVER use native browser `alert()`, `confirm()`, or `prompt()` calls. They appear clunky, break branding, and degrade user experience.
- **Unified Modern Dialogs**: Always use the system `useDialog()` hook from `@/components/ui/DialogProvider`:
  - `await dialog.confirm({ title, message, confirmText, cancelText, variant })` for user confirmations (e.g., delete, sign out, critical actions).
  - `await dialog.showAlert({ title, message, variant })` for informative notices.
  - `dialog.toast(message, variant, title)` for non-blocking success/warning/info updates.

## 5. Form & Modal Window Architecture (STRICT)
All modal popups across the system (e.g., Bulk Intake, User Management, Customer Pharmacies, Return Tickets/RMA, Repack Orders) must strictly adhere to this standardized layout pattern:
- **React Portal Mounting (Mandatory)**: Always wrap modal popups in `<Portal>` from `@/components/ui/Portal` (which renders directly into `document.body`). This guarantees modal backdrops are never trapped or clipped by parent container CSS transforms (such as `.page-enter` with `translateY`), ensuring true `100vw x 100vh` backdrop coverage and exact screen centering.
- **Perfect Viewport Centering & Sizing**: Outer backdrop must use `fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs`. Modal card container must be constrained to `max-h-[90vh] flex flex-col overflow-hidden` so it is always vertically and horizontally balanced without overflowing or clipping the viewport.
- **Fixed Header**: Pinned cleanly at the top (`shrink-0`) with module icon container, bold title, descriptive subtitle, and close `X` button. Never allow the header to scroll out of view.
- **Scrollable Form Body**: Wrapped in a container with `flex-1 min-h-0 overflow-y-auto overscroll-contain` (or bounded `max-h-[65vh]`). Form fields must be laid out cleanly with labels in uppercase tracking, icons inside input boxes, and consistent field heights (`h-10 rounded-xl`).
- **Fixed, Fully Visible Action Footer**: Pinned cleanly at the bottom (`shrink-0`) outside the scrollable body so buttons are never clipped or hidden beneath the fold. Features audit compliance badges on the left (e.g., `21 CFR Part 11` or security tags) and distinct action buttons on the right (`Cancel` and primary submit action button). Primary submit button must be fully clickable and accessible without scrolling.
- **Smooth Animation & Backdrop**: Use `bg-black/60 backdrop-blur-xs` overlay with `animate-in fade-in` and card `animate-in zoom-in-95` for a modern, native-feeling desktop experience.

## 6. Strict Separation of View & Edit Modals (STRICT)
- **NO Edit Action inside View-Only Popups**: When a user clicks a "View" button to inspect record details (e.g. Lot Inspection Details, Customer Profile, User Info), the resulting modal must be STRICTLY READ-ONLY.
- **FORBID Nested Edit Buttons in View Modals**: NEVER place an "Edit", "Modify", or "Update" button inside a View Details modal footer or header. The footer must only feature compliance badges and a clean "Close" button.
- **Dedicated Edit Triggers Only**: Editing must ONLY be triggered directly from the primary table/card row action button (the dedicated "Edit" button) or from an explicit management workflow, preserving clear separation of inspection and modification.

## 7. Professional Language & Terminology Policy (STRICT - ENGLISH ONLY)
- **FORBID Sinhala Words or Script in Code & UI**: NEVER insert any Sinhala words, transliterated Sinhala (e.g., "badu", "wandi", "nawa"), or Sinhala Unicode characters inside ANY UI components, labels, badges, placeholders, comments, dropdowns, table headers, logs, or error messages.
- **Strict Standard Pharmaceutical ERP English**: All user interfaces, table headers, status tags, badges, notifications, modals, and code must strictly use standard, international English terminology compliant with GxP/NMRA conventions (e.g., use "Goods Replacement" instead of "Badu Return", "Settlement Mode" instead of "Settlement Type", etc.).

## 8. Automatic Supabase Database Synchronization & Migrations (STRICT)
- **Automatic Supabase Schema Synchronization**: Whenever a new table, column, enum, or schema entity is introduced or modified in the codebase, the agent MUST immediately create or update the corresponding SQL migration file in `supabase/migrations/` and apply/push it to the live Supabase database (`npx supabase db push`).
- **Live Database Connection (No Dummy/Mock Fallbacks)**: Ensure that all module tables, queries, inserts, updates, and deletes are wired directly to the live Supabase database tables with zero dummy data fallbacks, ensuring instant database updates.
- **Idempotent Policies**: All database migrations must use `DROP POLICY IF EXISTS` before `CREATE POLICY` to guarantee clean, collision-free database migration pushes.
