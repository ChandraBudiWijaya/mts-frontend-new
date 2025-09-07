# MTS Frontend Dashboard

Sistem dashboard modern untuk monitoring dan tracking menggunakan React, TypeScript, dan Tailwind CSS.

## 🏗️ Struktur Project

```
src/
├── assets/                 # Gambar, icon, dan file statis
│   └── images/
│       ├── banana2.jpg     # Background login page
│       └── GGF.svg         # Logo aplikasi
├── components/             # Komponen reusable
│   ├── common/            # Layout dan komponen umum
│   │   ├── Header.tsx     # Header navigasi
│   │   ├── Layout.tsx     # Layout utama
│   │   ├── ProtectedRoute.tsx # Route protection
│   │   └── Sidebar.tsx    # Sidebar navigasi
│   └── ui/                # Komponen UI dasar
│       ├── Alert.tsx      # Komponen alert/notifikasi
│       ├── Button.tsx     # Komponen tombol
│       ├── Card.tsx       # Komponen kartu
│       ├── Input.tsx      # Komponen input form
│       ├── LoadingSpinner.tsx # Loading spinner
│       └── StatCard.tsx   # Kartu statistik
├── contexts/              # React Context providers
│   └── auth/              # Authentication context
│       ├── AuthContext.ts # Context definition
│       ├── AuthProvider.tsx # Provider component
│       └── index.ts       # Exports
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts         # Authentication hook
│   └── index.ts           # Exports
├── pages/                 # Halaman aplikasi
│   ├── Dashboard.tsx      # Halaman dashboard utama
│   └── Login.tsx          # Halaman login
├── services/              # API services
│   └── api.ts             # Axios configuration
├── types/                 # TypeScript type definitions
│   └── index.ts           # Type definitions
├── utils/                 # Utility functions
│   └── helpers.ts         # Helper functions
├── App.tsx                # Root component
├── main.tsx               # Entry point
└── index.css              # Global styles
```

## 🚀 Fitur

- ✅ Authentication dengan role-based access control (RBAC)
- ✅ Responsive design dengan Tailwind CSS
- ✅ TypeScript untuk type safety
- ✅ Modern React hooks dan context
- ✅ Protected routes
- ✅ Loading states dan error handling
- ✅ Clean component architecture

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Setup
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
```

### Demo Credentials
- Email: `admin@example.com`
- Password: `password`

## 📁 Arsitektur

### Context Pattern
- `AuthContext` untuk state management authentication
- Separated provider dan context untuk fast refresh compatibility

### Component Structure
- `components/ui/` - Reusable UI components
- `components/common/` - Layout dan navigasi components
- Clean props interfaces untuk semua components

### Type Safety
- Comprehensive TypeScript types di `types/index.ts`
- Proper type checking untuk semua API responses
- Type-safe context dan hooks

### Asset Management
- Optimized image loading
- SVG icons untuk performance
- Proper asset imports dengan Vite

## 🔧 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v3
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Heroicons
- **Date Handling**: date-fns
