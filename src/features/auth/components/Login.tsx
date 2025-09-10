import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff } from "lucide-react";
import Input from '../../../components/ui/Input';
import Alert from '../../../components/ui/Alert';
import logo from "../../../assets/images/GGF_MTS.jpg";
import bananaBackground from '../../../assets/images/banana2.jpg';

export default function Login() {
  const { login, isAuthenticated } = useAuth(); // Remove loading from useAuth
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
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan alamat email Anda"
              required
            />

            <div className="relative">
              <Input
                label="Kata Sandi"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan kata sandi Anda"
                autoComplete="off"
                required
              />
              <button
                type="button"
                onClick={handleTogglePassword}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Masuk...
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Lupa kata sandi?{' '}
              <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                Hubungi Admin
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
