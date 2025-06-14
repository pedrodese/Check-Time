'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginRequest, LoginResponse } from '@/types/api';
import { api } from '@/lib/api';

interface AuthContextType {
  user: LoginResponse['user'] | null;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/users/profile')
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (data: LoginRequest) => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    const { access_token } = response.data;

    localStorage.setItem('token', access_token);

    // Buscar o perfil do usuário antes de redirecionar
    const profile = await api.get('/users/profile');
    setUser(profile.data);

    if (profile.data.role.toUpperCase() === 'ADMIN') {
      router.push('/admin');
    } else {
      router.push('/funcionario');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 