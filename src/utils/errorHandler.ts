/**
 * Utility untuk parsing error dari API agar konsisten
 *
 * @param error - error object dari catch
 * @param fallback - pesan fallback jika tidak ada message
 * @returns string pesan error
 */
export function getErrorMessage(error: unknown, fallback: string = 'Terjadi kesalahan') {
  if (typeof error === 'string') return error;
  if (error instanceof Error) {
    // Axios error
    // @ts-ignore
    if (error.response && error.response.data && error.response.data.message) {
      // @ts-ignore
      return error.response.data.message;
    }
    return error.message || fallback;
  }
  if (typeof error === 'object' && error !== null) {
    // @ts-ignore
    if (error.message) return error.message;
  }
  return fallback;
}
