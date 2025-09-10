# Error Handling Standards

Dokumen ini menjelaskan standar error handling yang konsisten di seluruh aplikasi MTS Frontend.

## Komponen yang Digunakan

### 1. Alert Component (`src/components/ui/Alert.tsx`)
Komponen standar untuk menampilkan pesan error, warning, success, dan info dengan design yang konsisten.

#### Variants:
- `error`: Background merah untuk error messages
- `warning`: Background kuning untuk warning messages  
- `success`: Background hijau untuk success messages
- `info`: Background biru untuk informational messages

#### Usage:
```tsx
import Alert from '../../components/ui/Alert';

// Error alert
<Alert variant="error">Error message here</Alert>

// Success alert  
<Alert variant="success">Success message here</Alert>
```

### 2. Error Handler Utility (`src/utils/errorHandler.ts`)
Utility function untuk mengekstrak pesan error dari berbagai tipe error object secara konsisten.

#### Function: `getErrorMessage(error: unknown, fallback: string)`
- Menangani Axios errors dengan response.data.message
- Menangani Error objects dengan error.message
- Menangani string errors
- Memberikan fallback message jika tidak ada message yang valid

#### Usage:
```tsx
import { getErrorMessage } from '../../utils/errorHandler';

try {
  await apiCall();
} catch (err) {
  setError(getErrorMessage(err, 'Default error message'));
}
```

## Standar Implementation

### 1. Pattern yang Benar
```tsx
import Alert from '../../components/ui/Alert';
import { getErrorMessage } from '../../utils/errorHandler';

// State
const [error, setError] = useState('');

// Error handling dalam async function
try {
  const response = await apiCall();
  // Handle success
  setError(''); // Clear previous errors
} catch (err) {
  setError(getErrorMessage(err, 'Fallback error message'));
}

// Display error dalam render
{error && (
  <Alert variant="error">
    {error}
  </Alert>
)}
```

### 2. Pattern yang Harus Dihindari
```tsx
// ❌ Menggunakan alert() browser
alert('Error message');

// ❌ Custom error styling yang tidak konsisten
<div className="bg-red-50 border border-red-200...">
  {error}
</div>

// ❌ Error handling manual tanpa utility
if (err instanceof Error) {
  setError(err.message);
} else {
  setError('Unknown error');
}
```

## File yang Telah Diupdate

### 1. Features yang Sudah Konsisten
- **Parameters** (`src/features/parameters/Parameters.tsx`)
  - ✅ Menggunakan Alert component
  - ✅ Menggunakan getErrorMessage utility
  - ✅ Error handling yang konsisten di semua try-catch blocks

- **RBAC** (`src/features/rbac/Rbac.tsx`)
  - ✅ Menggunakan Alert component  
  - ✅ Menggunakan getErrorMessage utility
  - ✅ Mengganti alert() dengan setError state

- **Locations** (`src/features/locations/Locations.tsx`)
  - ✅ Menggunakan Alert component (sudah ada)
  - ✅ Menggunakan getErrorMessage utility
  - ✅ Error handling yang konsisten

- **Users** (`src/features/users/Users.tsx`)
  - ✅ Menggunakan Alert component
  - ✅ Menggunakan getErrorMessage utility
  - ✅ Mengganti alert() dengan setError state
  - ✅ Error display yang konsisten

## Design System

Semua error message sekarang menggunakan design yang sama:
- Background: `bg-red-50`
- Border: `border-red-200` 
- Text: `text-red-800`
- Icon: Error icon dengan `text-red-400`
- Padding: `p-4`
- Border radius: `rounded-lg`

## Best Practices

1. **Always use getErrorMessage utility** untuk parsing error
2. **Always use Alert component** untuk displaying error
3. **Clear previous errors** saat operasi berhasil: `setError('')`
4. **Provide meaningful fallback messages** di getErrorMessage
5. **Log errors to console** untuk debugging: `console.error('Context:', err)`
6. **Don't use browser alert()** untuk user-facing errors
7. **Consistent error state management** dengan useState

## Testing Error Handling

Untuk memastikan error handling bekerja dengan baik:

1. Test dengan network errors
2. Test dengan API errors (400, 401, 403, 404, 500)
3. Test dengan malformed responses
4. Test dengan timeout errors
5. Verify error messages ditampilkan dengan design yang konsisten
6. Verify errors di-clear setelah operasi sukses

## Future Improvements

1. **Error Boundaries** untuk catch React errors
2. **Toast notifications** untuk non-blocking error messages
3. **Retry mechanisms** untuk recoverable errors
4. **Error tracking** dengan service seperti Sentry
5. **Internationalization** untuk error messages
