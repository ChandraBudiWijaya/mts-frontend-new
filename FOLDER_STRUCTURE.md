# MTS Frontend - Folder Structure

## 📁 Struktur Folder yang Telah Direfactor

Berikut adalah struktur folder baru yang telah diorganisir untuk meningkatkan skalabilitas dan kemudahan development:

```
src/
├── app/                     # App configuration & entry point
│   └── App.tsx             # Main app component dengan routing
│
├── components/              # Reusable components
│   ├── ui/                 # Basic UI components
│   │   ├── Alert.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── StatCard.tsx
│   ├── layout/             # Layout components
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   └── Sidebar.tsx
│   ├── charts/             # Chart components (future)
│   ├── forms/              # Form components (future)
│   └── map/                # Map components
│
├── features/               # Feature-based modules
│   ├── auth/               # Authentication feature
│   │   ├── components/
│   │   │   └── Login.tsx
│   │   ├── context/
│   │   │   ├── AuthContext.ts
│   │   │   ├── AuthProvider.tsx
│   │   │   └── index.ts
│   │   └── hooks/
│   │       └── useAuth.ts
│   ├── dashboard/          # Dashboard feature
│   │   ├── components/     # Dashboard-specific components
│   │   └── Dashboard.tsx   # Main dashboard page
│   └── locations/          # Locations feature
│       ├── components/     # Location-specific components
│       ├── Locations.tsx
│       └── LocationDetail.tsx
│
├── shared/                 # Shared utilities
│   ├── api/                # API services
│   │   └── index.ts        # All API endpoints
│   ├── hooks/              # Shared custom hooks
│   │   └── index.ts        # Hook re-exports
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # All interface definitions
│   ├── utils/              # Utility functions
│   │   └── index.ts        # Helper functions
│   └── constants/          # App constants
│
├── assets/                 # Static assets
│   └── images/
│
├── styles/                 # Global styles
│   └── index.css           # Tailwind & custom styles
│
└── main.tsx               # App entry point
```

## 🎯 Keuntungan Struktur Baru

### 1. **Feature-Based Organization**
- Setiap feature memiliki folder sendiri dengan komponen, hooks, dan context yang terkait
- Mudah untuk menambah, menghapus, atau modify feature tanpa mempengaruhi yang lain
- Clear separation of concerns

### 2. **Shared Resources**
- API services, types, utils, dan hooks yang digunakan bersama ada di folder `shared/`
- Menghindari duplikasi code
- Consistent naming dan structure

### 3. **Component Hierarchy**
- UI components yang reusable di `components/ui/`
- Layout components di `components/layout/`
- Feature-specific components di dalam masing-masing feature folder

### 4. **Scalability**
- Mudah untuk menambah feature baru
- Structure yang konsisten memudahkan onboarding developer baru
- Mudah untuk maintenance dan debugging

## 📋 Migrasi yang Telah Dilakukan

### ✅ Sudah Dipindahkan:
- `src/types/` → `src/shared/types/`
- `src/services/api.ts` → `src/shared/api/index.ts`
- `src/utils/helpers.ts` → `src/shared/utils/index.ts`
- `src/contexts/auth/` → `src/features/auth/context/`
- `src/hooks/useAuth.ts` → `src/features/auth/hooks/useAuth.ts`
- `src/pages/Login.tsx` → `src/features/auth/components/Login.tsx`
- `src/components/common/` → `src/components/layout/`
- `src/App.tsx` → `src/app/App.tsx`
- `src/index.css` → `src/styles/index.css`

### 🔄 Next Steps:
1. Pindahkan `src/pages/Dashboard.tsx` → `src/features/dashboard/Dashboard.tsx`
2. Pindahkan location pages ke `src/features/locations/`
3. Update semua import statements
4. Buat barrel exports (index.ts) untuk setiap feature
5. Add proper TypeScript path mapping di tsconfig.json

## 🚀 Best Practices

### 1. **Import Conventions**
```typescript
// ✅ Good - use barrel exports
import { useAuth } from '../../shared/hooks';
import { AuthProvider } from '../../features/auth/context';

// ❌ Avoid - direct file imports when barrel export exists
import { useAuth } from '../../features/auth/hooks/useAuth';
```

### 2. **File Naming**
- PascalCase untuk components: `LoginForm.tsx`
- camelCase untuk hooks: `useAuth.ts`
- kebab-case untuk utilities: `api-client.ts`

### 3. **Feature Organization**
Setiap feature harus memiliki:
- `components/` - Feature-specific components
- `hooks/` - Feature-specific hooks (jika ada)
- `types/` - Feature-specific types (jika ada)
- `utils/` - Feature-specific utilities (jika ada)

### 4. **Shared Resources**
Hanya taruh di `shared/` jika benar-benar digunakan oleh 2+ features.

## 🔧 Development Guidelines

1. **Adding New Feature:**
   ```bash
   src/features/new-feature/
   ├── components/
   ├── hooks/
   ├── types/
   └── index.ts
   ```

2. **Adding Shared Component:**
   ```bash
   src/components/ui/NewComponent.tsx
   ```

3. **Adding Shared Utility:**
   ```bash
   src/shared/utils/newUtil.ts
   # then export in src/shared/utils/index.ts
   ```

Struktur ini akan membuat codebase lebih maintainable dan scalable untuk development jangka panjang!
