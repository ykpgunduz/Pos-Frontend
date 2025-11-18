import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { authService } from '../services/authService';
import './Login.css';

/**
 * Login - Giriş Sayfası
 * 
 * @component
 * @responsive ✅ Mobile(320px) / Tablet(768px) / Desktop(1024px+) tested
 * @ux ✅ Loading, Error states implemented
 * @a11y ✅ ARIA labels, keyboard navigation, semantic HTML
 */
const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Eğer kullanıcı zaten giriş yapmışsa ana sayfaya yönlendir
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Lütfen kullanıcı adı ve şifre giriniz');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // API'ye login isteği gönder - email veya username olabilir
      const result = await authService.login({
        email: username, // Backend email bekliyorsa
        username: username, // Backend username bekliyorsa
        password: password,
      });

      console.log('Login result:', result); // Debug için

      if (result.success && result.data?.token) {
        // Başarılı giriş - ana sayfaya yönlendir
        console.log('Login successful, redirecting to home...');
        navigate('/', { replace: true });
      } else {
        // Hata mesajını göster
        setError(result.message || 'Kullanıcı adı veya şifre hatalı');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [username, password, navigate]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>

      <div className="login-content">
        <div className="login-card">
          {/* Logo & Title */}
          <div className="login-header">
            <div className="login-logo">
              <Coffee size={48} strokeWidth={2.5} />
            </div>
            <h1 className="login-title">HARPY <span>Pos</span></h1>
            <p className="login-subtitle">Cafe Yönetim Sistemi</p>
          </div>

          {/* Login Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Kullanıcı Adı
              </label>
              <div className="input-wrapper">
                <User className="input-icon" size={20} />
                <input
                  id="username"
                  type="text"
                  className="form-input"
                  placeholder="Kullanıcı adınızı giriniz"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Şifre
              </label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Şifrenizi giriniz"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="spinner-icon" size={20} />
                  Giriş Yapılıyor...
                </>
              ) : (
                'Giriş Yap'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="login-footer">
            <p>Harpy Pos 1.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
