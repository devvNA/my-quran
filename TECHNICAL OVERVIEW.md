# Technical Overview: My Qur'an App

## Core Components

### Tech Stack

- **Frontend Framework**: React 19.0.0 with React DOM
- **Build Tool**: Vite 6.2.0 (Lightning-fast bundler)
- **Language**: TypeScript ~5.8.2 (Strict mode enabled)
- **Styling**: Tailwind CSS 4.1.14 with @tailwindcss/vite plugin
- **Icons**: Lucide React 0.546.0 (SVG-based icon library)
- **Animations**: Motion 12.23.24 (Framer motion alternative)
- **Data Source**: equran.id REST API (public, no authentication required)
- **Optional Services**: Express.js 4.21.2, better-sqlite3 12.4.1, Google Generative AI

### Major Modules & Responsibilities

#### 1. **src/App.tsx** (Root Container Component)

- **Responsibility**: Single Page Application (SPA) controller and page router
- **Key State**: `currentSurahId` (number | null) - tracks which Surah is selected
- **Key Functions**:
  - `setCurrentSurahId()` - state setter passed to child components
  - Conditional rendering logic: Show Home when null, show SurahDetailView when set
- **Design Pattern**: Container component pattern (smart parent with state, dumb children with props)
- **Layout**: Fixed width (max-w-96) mobile-first design with minimal borders

#### 2. **src/components/Home.tsx** (Surah List Container)

- **Responsibility**: Display 114 Surahs with search/filter functionality
- **Data Fetching**: useEffect hook → async fetch from `equran.id/api/v2/surat`
- **State Management**:
  - `surahs`: Array of Surah objects
  - `loading`: Boolean for loading state
  - `searchQuery`: String for real-time search filtering
- **Key Functions**:
  - `handleSelectSurah(id)` - callback invokes parent's `setCurrentSurahId(id)`
  - `filteredSurahs` - computed array filtered by Surah name (Latin)
- **UI Elements**: Search input field, Surah list cards, loading indicator
- **Error Handling**: Try-catch with console.error (basic error handling)

#### 3. **src/components/SurahDetailView.tsx** (Surah Content Display)

- **Responsibility**: Render complete Surah with all Ayat (verses)
- **Props**: `surahId` (number), `onBack` (callback function)
- **Data Fetching**: useEffect hook → async fetch from `equran.id/api/v2/surat/{surahId}`
- **State Management**:
  - `surah`: SurahDetail object (Surah info + array of Ayat)
  - `loading`: Boolean
  - `showJumpModal`: Boolean for "Jump to Ayat" feature
  - `jumpAyatNumber`: Number input for jumping to specific ayat
- **Key Functions**:
  - `handleJumpAyat()` - scroll to specific Ayat in the list
  - `handleBack()` - invoke parent callback to return to Home
- **UI Elements**:
  - Hero header: Surah name (Arabic & Latin), metadata (number of Ayat, revelation location)
  - Jump navigation: Modal to jump to specific Ayat number
  - Ayat list: Each Ayat displays Arabic text (RTL) + transliteration + Indonesian translation
- **RTL Support**: `dir="rtl"` attribute, Amiri font for Arabic text

#### 4. **src/types.ts** (Type Definitions)

- **Surah Interface**:
  ```typescript
  {
    nomor: number;
    nama: string;           // e.g., "Al-Fatihah"
    namaLatin: string;      // e.g., "Al-Fatihah"
    jumlahAyat: number;
    tempatTurun: string;    // e.g., "Makkah"
    deskripsi?: string;
    audio?: string;         // URL to Qur'an audio
  }
  ```
- **Ayat Interface**:
  ```typescript
  {
    nomorAyat: number;
    teks: string;           // Arabic text
    teksLatin: string;      // Transliteration
    teksIndonesia: string;  // Indonesian translation
    audio?: string;         // Audio URL for this Ayat
  }
  ```
- **SurahDetail Interface**: Extends Surah with `ayat: Ayat[]`

### Configuration Files

#### **vite.config.ts**

- React plugin for JSX transformation
- Tailwind CSS Vite integration for optimized CSS
- Path alias: `@/*` maps to project root (allows `import from "@/components"`)
- Environment variable: `GEMINI_API_KEY` (pre-configured for potential AI features)
- Conditional HMR (Hot Module Replacement) for development

#### **tsconfig.json**

- **Target**: ES2022 (modern JavaScript)
- **JSX Mode**: react-jsx (automatic, no React import needed in every file)
- **Strict Mode**: Enabled for type safety
- **Module Resolution**: bundler (compatible with Vite)
- **Isolated Modules**: Each file compiles independently

#### **src/index.css**

- Tailwind CSS directives (`@tailwind base/components/utilities`)
- Custom CSS variables: `--font-arabic: "Amiri"` (Google Fonts)
- Custom Tailwind utility: `.pl-13` for Surah header indentation
- Global body styling (margin reset, font smoothing)

---

## Component Interactions

### Data Flow Diagram

```
┌──────────────────────────────────┐
│         App.tsx                  │
│  State: currentSurahId           │
│  (number | null)                 │
└────────┬─────────────────────────┘
         │
    ┌────┴──────────────────────────────┐
    │                                   │
    v                                   v
┌─────────────────┐        ┌──────────────────────────┐
│   Home.tsx      │        │  SurahDetailView.tsx     │
│                 │        │                          │
│ fetch:          │        │ Props:                   │
│ /api/v2/surat   │        │ - surahId (number)       │
│                 │        │ - onBack (callback)      │
│ State:          │        │                          │
│ - surahs[]      │        │ fetch:                   │
│ - loading       │        │ /api/v2/surat/{surahId} │
│ - searchQuery   │        │                          │
│                 │        │ State:                   │
│ Callback:       │        │ - surah (SurahDetail)    │
│ onSelectSurah   │        │ - loading                │
│ (invoke as:     │        │ - showJumpModal          │
│ setCurrentSurah │        │ - jumpAyatNumber        │
│   Id)           │        │                          │
└────────┬────────┘        └───────────┬──────────────┘
         │                            │
         │                            │
         └───► Parent receives ◄──────┘
              callbacks &
              updates state

Communication Methods:
    - Props (downward): currentSurahId → SurahDetailView
    - Callbacks (upward): onSelectSurah, onBack → parent state update
    - No shared Redux/Zustand; pure React local state
```

### Typical User Workflow

1. **App initializes** with `currentSurahId = null` → renders `Home.tsx`
2. **Home.tsx mounts** → useEffect fetches Surahs from equran.id
3. **User searches** Surah name in search input → `searchQuery` state updates → UI re-renders filtered list
4. **User clicks Surah card** → `onSelectSurah(surahId)` callback invoked → `setCurrentSurahId(surahId)` in App.tsx
5. **App re-renders** with `currentSurahId !== null` → renders `SurahDetailView.tsx` instead of Home
6. **SurahDetailView mounts** → useEffect fetches Surah detail + all Ayat using the `surahId` prop
7. **User views Ayat** with Arabic text (RTL), Latin transliteration, Indonesian translation
8. **User clicks Back** → `onBack()` callback invoked → `setCurrentSurahId(null)` in App.tsx
9. **App re-renders** Home.tsx with previous search state maintained (if not reset)

### APIs & Interfaces

- **equran.id REST API** (public):
  - `GET /api/v2/surat` → Returns array of 114 Surahs
  - `GET /api/v2/surat/{surahNumber}` → Returns Surah with full Ayat array
  - No authentication, CORS-enabled for browser requests
- **No dependency injection or service patterns** currently used; direct fetch in components
- **No external state management** (Redux, Context API, Zustand); useState suffices for current scope

---

## Runtime Behavior

### Application Initialization

1. **Browser loads index.html** → Vite-bundled JavaScript loads
2. **main.tsx executes**:
   - Imports React, App component, and global CSS (index.css)
   - `ReactDOM.createRoot(document.getElementById('root'))` mounts React to DOM
   - `React.StrictMode` wraps App for development-only checks (detects side effects, unsafe lifecycles)
3. **App.tsx renders**:
   - Initial state: `currentSurahId = null`
   - Conditional branch: null → render Home.tsx
4. **Home.tsx useEffect runs** (on mount):
   - Calls `fetch('https://api.quran.com/api/v2/surat')`
   - Sets `loading = true` while fetching
   - On success: Sets `surahs` state, `loading = false`
   - On error: Logs error, `loading` remains true (no error toast shown)

### Request/Response Handling

- **Fetch Method**: Native Fetch API (no axios/http client)
- **Error Handling**: Try-catch in useEffect; errors logged to console
- **Loading States**: Each component manages its own `loading` boolean
- **Response Processing**: Response JSON directly mapped to component state (minimal transformation)

### Business Workflows

1. **Search Surah**:
   - User types in search input → `searchQuery` state updates
   - computed `filteredSurahs` array re-calculated on each render (case-insensitive name match)
   - UI re-renders filtered list

2. **View Surah Detail**:
   - SurahDetailView receives `surahId` prop
   - useEffect triggers → fetches from `/api/v2/surat/{surahId}`
   - Full Surah object + Ayat array loaded into state
   - List of Ayat rendered; each Ayat shows Arabic, Latin, Indonesian

3. **Jump to Ayat**:
   - User opens modal, enters Ayat number
   - `handleJumpAyat()` scrolls DOM element with matching Ayat ID
   - (Scroll behavior not explicitly found in code; may use browser scroll-to or ref-based)

4. **Back Navigation**:
   - User clicks Back button
   - `onBack()` callback triggers parent's `setCurrentSurahId(null)`
   - App re-renders Home.tsx
   - All Home.tsx state persists (surahs list, search) unless user left the component

### Error Handling

- **Current Level**: Basic (try-catch with console.error)
- **No user-facing error messages**: Errors logged quietly; loading states may persist
- **No retry logic**: User must refresh page if API call fails
- **No validation**: Assumes API response always matches expected shape (Surah, Ayat types)

---

## Deployment Architecture

### Build Pipeline

1. **Development**: `npm run dev` starts Vite dev server on `http://localhost:3000`
   - HMR enabled (hot module replacement for instant reload on file save)
   - SourceMaps generated for debugging
   - TypeScript checked at build-time

2. **Production Build**: `npm run build`
   - Vite bundles React, TypeScript → single JavaScript bundle
   - Tailwind CSS purged (unused classes removed)
   - Assets minified (HTML, JS, CSS)
   - Output: Static files in `dist/` directory (browser can directly serve)
   - `index.html` as entry point with bundled JS injected

3. **Preview**: `npm run preview` serves built dist locally for testing

### Static Hosting Ready

- **No backend required**: All components fetch from public equran.id API
- **No database needed**: Data fetched on-demand from equran.id
- **No environment setup**: Optional GEMINI_API_KEY for future AI features (currently in vite.config, not used)
- **Hosting options**: GitHub Pages, Netlify, Vercel, AWS S3 + CloudFront, any static host

### External Dependency: equran.id API

- **Availability**: Requires internet connection and equran.id service uptime
- **CORS**: API designed for browser requests (CORS headers set)
- **No API key needed**: Public dataset, rate limiting likely in place
- **Fallback**: None; if API down, app unable to fetch data

### Security Considerations

- **No sensitive data**: No user authentication, no private keys in code
- **Environment Variable**: GEMINI_API_KEY should be kept in `.env` file (not committed)
- **Third-party dependency**: Entire Qur'an dataset reliant on equran.id; no local data caching

### Performance Characteristics

- **Bundle Size**: React 19 (lightweight), Tailwind CSS (optimized), Lucide icons (SVG, tree-shakeable)
- **Network**: Fetches ~10KB for Surah list, ~50-100KB per Surah detail (Ayat data)
- **Caching**: None implemented; every page refresh re-fetches data (equran.id may have browser cache)
- **Rendering**: Virtual list / pagination not implemented; all Ayat in single list (OK for 114 Surahs)

---

## Summary

**My Qur'an App** is a lightweight, single-page web application built with React 19 and TypeScript, styled with Tailwind CSS, bundled with Vite, and designed for mobile-first viewing. It fetches Qur'an data from the public equran.id API and displays Surahs and their Ayat in Arabic (RTL), Latin transliteration, and Indonesian translation. The application uses a simple state-driven navigation pattern (App.tsx as container routing to Home or SurahDetailView based on `currentSurahId` state), with no complex state management, database, or authentication. It is production-ready for static hosting on any modern hosting provider.
