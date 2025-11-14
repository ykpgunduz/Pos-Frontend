import { api } from './api';

interface LoginCredentials {
  email?: string;
  username?: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  data?: {
    token: string;
    user: {
      id: number;
      name: string;
      email: string;
      role?: string;
    };
  };
  message?: string;
}

export const authService = {
  // Login
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await api.post('/cafe/login', credentials);
      const data = response.data;

      console.log('API Response:', data); // Debug için

      // Başarılı login durumunda token'ı localStorage'a kaydet
      // API'den gelen response formatına göre uyarla
      const token = data.token || data.data?.token || data.access_token;
      const user = data.user || data.data?.user;
      
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('isAuthenticated', 'true');
        
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }

        // Success response'u düzenle
        return {
          success: true,
          data: {
            token: token,
            user: user || { id: 0, name: 'User', email: '' }
          },
          message: data.message || 'Giriş başarılı'
        };
      }

      // Token yoksa hata döndür
      return {
        success: false,
        message: data.message || 'Giriş yapılamadı'
      };

    } catch (error: any) {
      console.error('Login error:', error.response?.data || error);
      
      // Hata durumunda mesajı döndür
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Validasyon hatalarını işle
        if (errorData.errors) {
          const firstError = Object.values(errorData.errors)[0];
          const errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
          return {
            success: false,
            message: errorMessage || 'Lütfen tüm alanları doldurunuz',
          };
        }
        
        // Genel hata mesajı
        return {
          success: false,
          message: errorData.message || 'Kullanıcı adı veya şifre hatalı',
        };
      }
      
      return {
        success: false,
        message: 'Sunucuya bağlanılamadı',
      };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  },

  // Check if authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    const isAuth = localStorage.getItem('isAuthenticated');
    return !!(token && isAuth === 'true');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },
};
