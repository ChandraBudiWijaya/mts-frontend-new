import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../../../components/ui/Input';
import Alert from '../../../components/ui/Alert';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import logo from "../../../assets/images/GGF.svg";
import bananaBackground from '../../../assets/images/banana2.jpg';

export default function Login() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(formData);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login gagal. Periksa kembali email dan kata sandi Anda.');
      }
    } catch {
      setError('Login gagal. Periksa kembali email dan kata sandi Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTogglePassword = () => setShowPassword(!showPassword);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 h-screen overflow-hidden">
      
      {/* Kolom Kiri (3/4) - Latar Belakang dan Teks */}
      <div 
        className="hidden lg:flex lg:col-span-3 flex-col justify-center items-start p-12 text-white bg-cover bg-center relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${bananaBackground})`,
        }}
      >
        <div className="relative z-10">
          <h1 
            className="text-5xl font-bold leading-tight mb-4" 
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}
          >
            Mandor Tracking System
          </h1>
          <p 
            className="text-xl font-light max-w-2xl opacity-90" 
            style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}
          >
            Kelola dan pantau seluruh operasional perkebunan pisang Anda dengan lebih efisien dan akurat. 
            Dapatkan informasi real-time dan tingkatkan produktivitas tim Anda.
          </p>
        </div>
      </div>

      {/* Kolom Kanan (1/4) - Form Login */}
      <div className="col-span-1 flex flex-col justify-center items-center bg-gray-50 p-8 relative overflow-y-auto min-h-screen">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <img
              src={logo}
              alt="MTS Logo"
              className="w-28 h-auto mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-900">
              Selamat Datang!
            </h2>
            <p className="text-gray-600">Login ke akun Anda</p>
          </div>

          {error && (
            <div className="mb-4">
              <Alert variant="error">{error}</Alert>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Alamat Email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan email Anda"
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              }
            />
            
            <Input
              label="Kata Sandi"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan password Anda"
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
              rightIcon={
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              }
            />
            
            <button
              type="submit"
              disabled={isLoading || !formData.email || !formData.password}
              className="w-full py-3 px-4 text-base font-semibold text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#1e8e3e' }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="sm" color="white" />
                  <span className="ml-2">Memproses...</span>
                </div>
              ) : (
                'Login'
              )}
            </button>
            
            <div className="text-center text-sm">
              <p className="text-gray-600">
                Lupa password?{' '}
                <a 
                  href="mailto:chandrabw.cjcc@gmail.com" 
                  className="font-semibold text-green-700 hover:underline"
                >
                  Hubungi Admin IT
                </a>
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Demo: admin@example.com / password
              </p>
            </div>
          </form>
        </div>
        
        <p className="absolute bottom-5 text-xs text-gray-400">
          by Chandra Budi Wijaya - 122140093
        </p>
      </div>
    </div>
  );
}
