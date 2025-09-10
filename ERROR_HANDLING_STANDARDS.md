# Error Handling Standards

Dokumen ini menjelaskan standar error handling yang konsisten di seluruh aplikasi MTS Frontend.

## Bug Fixes - Parameters Component

### Issue: `groups.map is not a function`
**Error**: `Parameters.tsx:288 Uncaught TypeError: groups.map is not a function`

**Root Cause**: 
- API response tidak selalu mengembalikan array
- State bisa ter-set ke nilai non-array saat error
- Tidak ada safety check sebelum menggunakan `.map()`

**Solution Applied**:
1. **Safety checks pada render**:
   ```tsx
   // Before (Error prone)
   {groups.map((group) => (...))}
   
   // After (Safe)
   {Array.isArray(groups) && groups.map((group) => (...))}
   ```

2. **Enhanced data loading functions**:
   ```tsx
   const loadGroups = useCallback(async () => {
     try {
       const response = await parametersAPI.getGroups();
       const groupsData = response.data || [];
       // Ensure we always set an array
       setGroups(Array.isArray(groupsData) ? groupsData : []);
     } catch (err) {
       setGroups([]); // Set empty array on error
     }
   }, []);
   ```

3. **Conditional rendering improvements**:
   ```tsx
   // Enhanced empty state check
   {(!Array.isArray(parameters) || parameters.length === 0) && (
     <tr><td colSpan={5}>No parameters found</td></tr>
   )}
   ```

### Error Boundary Implementation
Added React Error Boundary (`src/components/common/ErrorBoundary.tsx`) to catch and handle React errors gracefully:

- Prevents application crashes
- Shows user-friendly error messages
- Provides retry mechanisms
- Shows technical details in development mode
- Integrated into main App component

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

### 3. Error Boundary (`src/components/common/ErrorBoundary.tsx`)
React Error Boundary untuk menangani error yang tidak tertangani di komponen React.

#### Features:
- Catches JavaScript errors anywhere in component tree
- Logs error information for debugging
- Displays fallback UI instead of crashing
- Provides retry and reload options
- Shows stack trace in development mode

#### Usage:
```tsx
import ErrorBoundary from './components/common/ErrorBoundary';

// Wrap your app or specific components
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

## Standar Implementation

### 1. Pattern yang Benar
```tsx
import Alert from '../../components/ui/Alert';
import { getErrorMessage } from '../../utils/errorHandler';

// State
const [error, setError] = useState('');
const [data, setData] = useState<Type[]>([]);

// Error handling dalam async function
try {
  const response = await apiCall();
  const result = response.data || [];
  // Always ensure array type
  setData(Array.isArray(result) ? result : []);
  setError(''); // Clear previous errors
} catch (err) {
  setError(getErrorMessage(err, 'Fallback error message'));
  setData([]); // Set safe default on error
}

// Safe rendering dengan array checks
{Array.isArray(data) && data.map((item) => (
  <div key={item.id}>{item.name}</div>
))}

// Safe empty state
{(!Array.isArray(data) || data.length === 0) && (
  <div>No data found</div>
)}

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

// ❌ Unsafe array operations tanpa checks
{data.map((item) => ...)} // Could crash if data is not array

// ❌ Unsafe length checks
{data.length === 0 && <div>Empty</div>} // Could crash if data is not array
```

## File yang Telah Diupdate

### 1. Features yang Sudah Konsisten
- **Parameters** (`src/features/parameters/Parameters.tsx`)
  - ✅ Menggunakan Alert component
  - ✅ Menggunakan getErrorMessage utility
  - ✅ Error handling yang konsisten di semua try-catch blocks
  - ✅ **FIXED**: Added safety checks for `groups.map()` and `parameters.map()`
  - ✅ **FIXED**: Enhanced data loading with array validation
  - ✅ **FIXED**: Improved empty state rendering

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

- **App** (`src/App.tsx`)
  - ✅ **NEW**: Added ErrorBoundary wrapper untuk global error handling

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
3. **Always check if data is array** sebelum menggunakan `.map()`, `.length`, dll
4. **Set safe defaults on error** (empty arrays, null values)
5. **Clear previous errors** saat operasi berhasil: `setError('')`
6. **Provide meaningful fallback messages** di getErrorMessage
7. **Log errors to console** untuk debugging: `console.error('Context:', err)`
8. **Don't use browser alert()** untuk user-facing errors
9. **Consistent error state management** dengan useState
10. **Use Error Boundaries** untuk catch React component errors

### Array Safety Pattern
```tsx
// Always check before array operations
if (Array.isArray(data)) {
  const result = data.map(...);
  const isEmpty = data.length === 0;
}

// Or use safe inline checks
{Array.isArray(data) && data.map(...)}
{(!Array.isArray(data) || data.length === 0) && <EmptyState />}
```

## Testing Error Handling

Untuk memastikan error handling bekerja dengan baik:

1. Test dengan network errors
2. Test dengan API errors (400, 401, 403, 404, 500)
3. Test dengan malformed responses (non-array data)
4. Test dengan timeout errors
5. **Test dengan data yang tidak sesuai ekspektasi**
6. Verify error messages ditampilkan dengan design yang konsisten
7. Verify errors di-clear setelah operasi sukses
8. **Test Error Boundary dengan deliberate component errors**

## Future Improvements

1. **Error Boundaries** ✅ COMPLETED - untuk catch React errors
2. **Toast notifications** untuk non-blocking error messages
3. **Retry mechanisms** untuk recoverable errors
4. **Error tracking** dengan service seperti Sentry
5. **Internationalization** untuk error messages
6. **Loading states** yang lebih sophisticated
7. **Offline error handling** untuk network issues
