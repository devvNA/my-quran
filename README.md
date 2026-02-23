<div align="center">

# My Qur'an App 📖

**A modern, mobile-first web application for reading and browsing Al-Qur'an with real-time search and navigation features.**

[![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?logo=tailwindcss)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite)](https://vitejs.dev)

[View Live Demo](#) • [Get Started](#quick-start) • [API Reference](#api-reference)

</div>

---

## ✨ Features

- 📱 **Mobile-First Design** - Optimized for mobile devices with responsive layout
- 🔍 **Search Surahs** - Real-time search to find any Surah by name
- 📜 **Complete Qur'an** - Browse all 114 Surahs with detailed information
- 🎯 **Jump to Ayat** - Quick dropdown navigation to jump to any Ayat number
- 🌍 **Multi-Language Display**:
  - Arabic text (RTL) with Amiri font
  - Latin transliteration (Romanization)
  - Indonesian translation
- ✨ **Smooth Animations**:
  - Ayat highlight effect when jumping
  - Smooth scroll behavior
  - Interactive dropdown transitions
- 🎨 **Beautiful UI** - Clean, modern design with Tailwind CSS
- ⚡ **Fast Loading** - Built with Vite for instant development experience

---

## 🛠 Tech Stack

| Category               | Technology         |
| ---------------------- | ------------------ |
| **Frontend Framework** | React 19           |
| **Language**           | TypeScript 5.8     |
| **Styling**            | Tailwind CSS 4.1   |
| **Build Tool**         | Vite 6.2           |
| **Icons**              | Lucide React       |
| **API**                | equran.id REST API |
| **Package Manager**    | npm                |

---

## 📋 Prerequisites

- **Node.js** v18.0 or higher
- **npm** v9.0 or higher

Check your versions:

```bash
node --version
npm --version
```

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/my-quran-app.git
cd my-quran-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

The app will start on **http://localhost:3000**

### 4. Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory, ready for deployment.

---

## 📦 Available Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start development server (port 3000) |
| `npm run build`   | Build for production                 |
| `npm run preview` | Preview production build locally     |
| `npm run clean`   | Remove build artifacts               |
| `npm run lint`    | TypeScript type-check                |

---

## 📁 Project Structure

```
my-quran-app/
├── src/
│   ├── components/
│   │   ├── Home.tsx              # Surah list & search
│   │   └── SurahDetailView.tsx   # Surah detail & Ayat display
│   ├── App.tsx                   # Root container (SPA router)
│   ├── types.ts                  # TypeScript interfaces
│   ├── main.tsx                  # React entry point
│   └── index.css                 # Global styles & Tailwind
├── public/
├── index.html                    # HTML entry point
├── vite.config.ts                # Vite configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind configuration
├── package.json                  # Dependencies & scripts
└── README.md
```

---

## 🔌 API Reference

### equran.id API

This app uses the **equran.id** public REST API (no authentication required).

#### Get All Surahs

```bash
GET /api/v2/surat
```

**Response:**

```json
{
  "code": 200,
  "status": "OK",
  "data": [
    {
      "nomor": 1,
      "nama": "ٱلْفَاتِحَة",
      "namaLatin": "Al-Fatihah",
      "jumlahAyat": 7,
      "tempatTurun": "Mekah",
      "arti": "Pembukaan",
      "deskripsi": "...",
      "audioFull": { ... },
      "ayat": [ ... ]
    }
  ]
}
```

#### Get Specific Surah with Ayat

```bash
GET /api/v2/surat/{nomorSurah}
```

**Example:** `GET /api/v2/surat/1` (Al-Fatihah)

**Response body includes all Ayat (verses) of the Surah.**

---

## 🎨 UI Components

### Home.tsx

- Displays list of 114 Surahs
- Real-time search filtering by Surah name
- Click to view Surah details

### SurahDetailView.tsx

- Shows complete Surah with all Ayat
- Hero section with Surah name, meaning, and metadata
- Jump to Ayat dropdown navigation
- Smooth scroll with highlight animation
- Back button to return to list

---

## 🎯 Key Features Explained

### Jump to Ayat Feature

Users can quickly navigate to any Ayat by:

1. Clicking the "Jump to Ayat" button in the hero section
2. Selecting the Ayat number from a grid dropdown
3. Page smoothly scrolls to the selected Ayat
4. Selected Ayat highlights with a blinking animation for 3 cycles

### Search Functionality

- Real-time filtering as user types
- Case-insensitive matching
- Searches by Surah name (Latin)

### RTL Support

- Arabic text displays right-to-left
- Amiri font for authentic Arabic rendering
- Proper text alignment and spacing

---

## 🚀 Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Deploy to GitHub Pages

```bash
npm run build
# Upload the dist/ folder to GitHub Pages
```

### Deploy to Any Static Host

The app is fully static (no backend needed). Simply upload the contents of `dist/` to any static hosting service:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting
- Any FTP/web server

---

## 🔒 Environment Variables

Optional configuration for future AI features:

Create a `.env.local` file in the root:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

(Currently not used in the app, but infrastructure is in place)

---

## 📝 TypeScript Interfaces

### Surah

```typescript
interface Surah {
  nomor: number; // 1-114
  nama: string; // Arabic name
  namaLatin: string; // Latin transliteration
  jumlahAyat: number; // Number of verses
  tempatTurun: string; // "Mekah" or "Madinah"
  arti: string; // Meaning
  deskripsi: string; // Description
  audioFull: Record<string, string>; // Audio URLs
}
```

### Ayat

```typescript
interface Ayat {
  nomorAyat: number; // Verse number
  teksArab: string; // Arabic text
  teksLatin: string; // Transliteration
  teksIndonesia: string; // Indonesian translation
  audio: Record<string, string>; // Audio URLs
}
```

### SurahDetail

```typescript
interface SurahDetail extends Surah {
  ayat: Ayat[]; // Array of all verses
}
```

---

## 🎓 Learning Resources

- [React 19 Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev/guide)
- [equran.id Documentation](https://equran.id)

---

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Before Submitting PR

```bash
# Type-check
npx tsc --noEmit

# Build
npm run build

# Lint
npm run lint
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙌 Acknowledgments

- **equran.id** - For providing the free, open Qur'an API
- **React Team** - For the amazing React framework
- **Tailwind Labs** - For Tailwind CSS
- **Lucide** - For beautiful icons
- **Amiri Font** - For authentic Arabic typography

---

## 📞 Support

Have questions or found a bug?

- 📖 Check the [Documentation](./TECHNICAL%20OVERVIEW.md)
- 🐛 [Open an Issue](https://github.com/yourusername/my-quran-app/issues)
- 💬 [Start a Discussion](https://github.com/yourusername/my-quran-app/discussions)

---

<div align="center">

**Made with ❤️ for the Muslim community**

[⬆ back to top](#my-quran-app-)

</div>
