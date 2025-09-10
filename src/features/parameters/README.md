# Parameters Feature

Fitur untuk mengelola parameter aplikasi MTS (Mandor Tracking System).

## Overview

Parameter Management adalah modul yang memungkinkan administrator untuk:
- Melihat daftar parameter sistem
- Filter parameter berdasarkan group dan status
- Mencari parameter berdasarkan key
- Edit nilai parameter, deskripsi, dan status
- Test endpoint mobile settings

## Structure

```
parameters/
├── components/         # Komponen spesifik parameters (future)
├── types/             # Type definitions
│   └── index.ts       # Parameter interfaces
├── Parameters.tsx     # Main component
├── index.ts          # Feature exports
└── README.md         # Documentation (this file)
```

## Components

### Parameters
Komponen utama halaman parameter management.

**Features:**
- Tabel parameter dengan pagination
- Filter berdasarkan group dan status
- Debounced search (500ms delay)
- Modal untuk edit parameter
- Mobile settings test

**Props:** None (page component)

## Types

### Parameter
```typescript
interface Parameter {
  id: number;
  param_key: string;
  param_value: string;
  description?: string;
  group_name?: string;
  status: boolean;
  created_at?: string;
  updated_at?: string;
}
```

### ParameterFormData
```typescript
interface ParameterFormData {
  param_value: string;
  description: string;
  status: boolean;
}
```

### ParameterFilters
```typescript
interface ParameterFilters {
  group: string;
  status: string;
  search: string;
}
```

## API Endpoints

Menggunakan `parametersAPI` dari `shared/api`:

- `getAll(params?)` - Get parameters with filters
- `getById(id)` - Get single parameter
- `update(id, data)` - Update parameter
- `getGroups()` - Get parameter groups
- `getMobileSettings()` - Test mobile settings

## Usage

```tsx
import { Parameters } from '../features/parameters';

// In routing
<Route path="/parameters" element={<Parameters />} />
```

## Notes

- Menggunakan debounced search untuk optimasi performa
- Modal menggunakan portal untuk z-index management
- Error handling dengan try-catch dan user feedback
- Loading states untuk UX yang baik
- TypeScript strict mode compliant
