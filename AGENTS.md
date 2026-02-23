# AGENTS.md: AI Coding Agent Guide

## Project Snapshot

**My Qur'an App** is a single-page web application (SPA) for browsing and reading Al-Qur'an. Built with React 19, TypeScript, Tailwind CSS, and Vite. Fetches Surah and Ayat data from the public equran.id REST API. No backend, no database, no authentication required. Designed for mobile-first viewing (400px width constraint) with RTL support for Arabic text.

**Tech Stack**: React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons + equran.id API

---

## Root Setup Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production (outputs to dist/)
npm run build

# TypeScript type-check (no emit)
npx tsc --noEmit

# Linting (check ESLint rules)
npm run lint

# Clean build artifacts
npm run clean

# Preview production build locally
npm run preview
```

---

## Universal Conventions

### TypeScript & Typing

- **Strict mode enabled** in tsconfig.json
- All component props must be typed
- Use interfaces for data objects (see [src/types.ts](src/types.ts): `Surah`, `Ayat`, `SurahDetail`)
- JSX mode: `react-jsx` (no React import needed in every file)

### File Organization

```
src/
├── components/          # React components
│   ├── Home.tsx        # Surah list & search
│   └── SurahDetailView.tsx  # Surah detail & Ayat display
├── App.tsx             # Root container component (SPA router)
├── types.ts            # TypeScript interfaces
├── main.tsx            # React entry point
└── index.css           # Global styles + Tailwind
```

### Naming Conventions

- **Components**: PascalCase (`Home.tsx`, `SurahDetailView.tsx`)
- **Variables/Functions**: camelCase (`currentSurahId`, `handleSelectSurah`)
- **Constants**: UPPER_SNAKE_CASE (if global)
- **API endpoints**: Match equran.id pattern: `/api/v2/{resource}`

### Import Paths

- **Absolute imports**: Use `@/` alias (maps to project root)
  - ✅ DO: `import { Surah } from "@/types"`
  - ❌ DON'T: `import { Surah } from "../../types"`

### Styling

- **Framework**: Tailwind CSS 4.1.14 (utility-first CSS)
- **Custom utilities**: Available in [src/index.css](src/index.css)
  - Example: `.pl-13` for 13 units left padding (used in Surah header)
- **RTL support**: Use `dir="rtl"` attribute on parent; Amiri font embedded for Arabic
- **Responsive design**: Mobile-first, fixed width max-w-96 (400px) for desktop preview

### State Management

- **Pattern**: Local component state only (useState hooks)
- **Prop drilling**: Used for parent-child communication
- **Callbacks**: Child → Parent updates via callback props
  - Example: `onSelectSurah` in Home.tsx invokes parent's `setCurrentSurahId`
- **No Redux/Zustand**: Not needed for current scope

### Error Handling

- **Current practice**: Try-catch in useEffect, console.error for logging
- **Improvement opportunity**: Add user-facing error messages / toast notifications

---

## Key Files & Responsibilities

| File                                                                     | Purpose                                              | Key Export                                  |
| ------------------------------------------------------------------------ | ---------------------------------------------------- | ------------------------------------------- |
| [src/main.tsx](src/main.tsx)                                             | React entry point, mounts App to DOM                 | `createRoot()` call                         |
| [src/App.tsx](src/App.tsx)                                               | Root container, SPA router via conditional rendering | `App` component with `currentSurahId` state |
| [src/components/Home.tsx](src/components/Home.tsx)                       | Surah list with search, fetches from API             | `Home` component, displays Surahs           |
| [src/components/SurahDetailView.tsx](src/components/SurahDetailView.tsx) | Surah detail view, fetches & displays all Ayat       | `SurahDetailView` component                 |
| [src/types.ts](src/types.ts)                                             | TypeScript interfaces for data                       | `Surah`, `Ayat`, `SurahDetail` interfaces   |
| [src/index.css](src/index.css)                                           | Global styles, Tailwind directives, custom utilities | `.pl-13`, `--font-arabic` CSS var           |
| [vite.config.ts](vite.config.ts)                                         | Build configuration, path alias, plugins             | React + Tailwind integration                |
| [tsconfig.json](tsconfig.json)                                           | TypeScript compilation settings                      | Strict mode, ES2022 target                  |
| [package.json](package.json)                                             | Dependencies, scripts, project metadata              | npm scripts, all dependencies               |

---

## Common Patterns for Agents

### Pattern 1: Fetching Data in useEffect

Use this pattern when adding new data fetches (e.g., new API endpoint):

```typescript
// From Home.tsx (copy this structure)
const [surahs, setSurahs] = useState<Surah[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchSurahs = async () => {
    try {
      const response = await fetch("https://api.quran.com/api/v2/surat");
      const data = await response.json();
      setSurahs(data.data); // API response structure: { data: [] }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Surahs:", error);
      // TODO: Add user-facing error handling
    }
  };
  fetchSurahs();
}, []); // Empty dependency = run once on mount
```

**DO**:

- Use async IIFE or separate async function
- Always set loading state
- Handle errors with try-catch
- Check API response structure (equran.id uses `{ data: [...] }` wrapper)

**DON'T**:

- Call async function directly in useEffect (invalid syntax)
- Forget loading state
- Silently ignore errors

### Pattern 2: Parent-Child Navigation (Callback Pattern)

Use when adding new navigation flows:

```typescript
// In Parent (App.tsx)
const [currentSurahId, setCurrentSurahId] = useState<number | null>(null);

// Pass to child
<Home onSelectSurah={(id) => setCurrentSurahId(id)} />

// In Child (Home.tsx)
interface HomeProps {
  onSelectSurah: (id: number) => void;
}

export function Home({ onSelectSurah }: HomeProps) {
  const handleClick = (surahId: number) => {
    onSelectSurah(surahId); // Call parent callback
  };
  // ...
}
```

**DO**:

- Name callback props with `on` prefix: `onSelectSurah`, `onBack`, etc.
- Type callback signatures: `(id: number) => void`
- Pass data through callback first param

**DON'T**:

- Use string-based routing (no router needed yet)
- Lift state higher than necessary
- Pass multiple data via multiple callbacks (batch into one callback)

### Pattern 3: Conditional Rendering Based on State

Use this for page-level navigation (like Home vs Detail view):

```typescript
// From App.tsx (copy this structure)
return (
  <div className="...">
    {currentSurahId === null ? (
      <Home onSelectSurah={(id) => setCurrentSurahId(id)} />
    ) : (
      <SurahDetailView
        surahId={currentSurahId}
        onBack={() => setCurrentSurahId(null)}
      />
    )}
  </div>
);
```

**DO**:

- Use ternary for two branches
- Track state at parent level (container component)
- Pass state as props to children

**DON'T**:

- Render both Home and SurahDetailView simultaneously
- Store route state in multiple places

### Pattern 4: Styling with Tailwind + Custom Utilities

Use this when adding new UI components:

```typescript
// In JSX
<div className="flex flex-col gap-4 px-4 py-2 rounded-lg border border-gray-200">
  <p className="text-lg font-bold">{surahName}</p>
</div>

// For custom styles, add to src/index.css:
// Example from file:
@layer utilities {
  .pl-13 {
    @apply pl-[3.25rem];
  }
}

// Then use: <div className="pl-13">...</div>
```

**DO**:

- Use Tailwind utility classes in `className` prop
- Import custom utilities from [src/index.css](src/index.css)
- Mobile-first: `px-4 md:px-6 lg:px-8` (add breakpoints if needed)

**DON'T**:

- Write CSS-in-JS or inline `<style>` tags
- Create global CSS outside of Tailwind directives
- Use deprecated Tailwind syntax

### Pattern 5: RTL & Font Support for Arabic Text

Use this when displaying Arabic Qur'an text:

```typescript
// Parent wrapper
<div dir="rtl" className="font-arabic">
  <p className="text-lg">{arabicText}</p>
</div>

// CSS in index.css:
// --font-arabic: "Amiri" is pre-configured
// Font.family loaded from Google Fonts (via Tailwind config or CDN)
```

**DO**:

- Set `dir="rtl"` on container
- Use `className="font-arabic"` on text elements
- Test alignment in both browsers

**DON'T**:

- Flip text direction with CSS transforms
- Use English fonts for Arabic (no fallback to sans-serif)

---

## Common Gotchas

1. **equran.id API Response Structure**: API wraps data in `{ data: [...] }`. Remember to access `.data` property:

   ```typescript
   const response = await fetch(...);
   const json = await response.json();
   const surahs = json.data; // ✅ Correct
   // NOT: const surahs = json; ❌ Wrong
   ```

2. **Surah Numbering**: Surah numbers (1-114) are the primary keys. Don't assume array index matches Surah number.

   ```typescript
   // equran.id API field: "nomor" (Surah number)
   const surahNumber = surah.nomor; // ✅ 1-114
   const arrayIndex = surahs.indexOf(surah); // ❌ Not always = Surah number
   ```

3. **Path Alias `@/`**: Must match vite.config.ts definition. Works in all imports but only after `npm install` + restart dev server.

4. **Tailwind Class Purging**: Unused Tailwind classes removed in production. Always use full class names (no dynamic className concatenation):

   ```javascript
   // ✅ Safe
   className={condition ? "text-red-500" : "text-blue-500"}

   // ❌ NOT SAFE (class may be purged)
   className={`text-${color}-500`}
   ```

5. **React 19 Changes**: No `ReactDOM.render()` (removed); use `createRoot()` in main.tsx. Components may not need React import (react-jsx mode).

---

## JIT Index: Quick Find Commands

### Find Components

```bash
# List all React components
rg -n "export (default )?function|export const.*React|export.*component" src/components --type ts --type tsx

# Find specific component usage
rg -n "Home|SurahDetailView" src/ --type tsx
```

### Find API Calls

```bash
# Find all fetch() calls
rg -n "fetch\(" src/ --type tsx

# Find equran.id API endpoints
rg -n "api.quran.com|equran.id" src/ --type tsx
```

### Find Types

```bash
# List all interfaces
rg -n "interface|type " src/types.ts --type ts

# Find component prop types
rg -n "interface.*Props" src/components --type tsx
```

### Find Styling

```bash
# Find Tailwind classes
rg -n "className=" src/ --type tsx | head -20

# Find custom CSS utilities
rg -n "@layer|@apply" src/index.css --type css
```

### Quick Stats

```bash
# Count components
find src/components -name "*.tsx" | wc -l

# Count dependencies
grep -c "\"name\":" package.json

# Check TypeScript errors
npx tsc --noEmit 2>&1 | grep "error"
```

---

## Pre-PR Checklist

Before submitting a PR or marking feature complete, run these commands:

```bash
# 1. Type-check passes
npx tsc --noEmit

# 2. Build succeeds
npm run build

# 3. Lint passes (if configured)
npm run lint

# 4. Manual testing (local dev server)
npm run dev
# → Open http://localhost:3000
# → Test: click Surah → detail view renders
# → Test: back button returns to Home
# → Test: search filters Surahs
# → Check console for errors (F12 DevTools)

# 5. Verify changes don't break existing pages
# → Home page loads and displays 114 Surahs
# → Surah detail page fetches and displays Ayat
# → RTL/Arabic text renders correctly
```

**Definition of Done**:

- ✅ `npx tsc --noEmit` passes (no type errors)
- ✅ `npm run build` succeeds (no build errors)
- ✅ Manual testing on http://localhost:3000 works as expected
- ✅ No console errors (F12 DevTools)
- ✅ Changes limited to agreed paths (src/components/, src/types.ts, etc.)

---

## Resources & Documentation

- **Technical Deep Dive**: See [TECHNICAL OVERVIEW.md](TECHNICAL OVERVIEW.md)
- **React 19 Docs**: https://react.dev
- **TypeScript Handbook**: https://www.typescriptlang.org/docs
- **Tailwind CSS**: https://tailwindcss.com
- **Vite Guide**: https://vitejs.dev/guide
- **equran.id API Docs**: https://equran.id (or explore `/api/v2/surat` endpoint)
- **Lucide Icons**: https://lucide.dev (browse available icons for the UI)

---

**Last Updated**: February 2026  
**Project**: My Qur'an App (v1.0 - Foundation)  
**Maintainer Notes**: Add git branch strategy, commit message format, and PR review guidelines as project evolves.
