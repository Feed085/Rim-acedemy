import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User } from '@/types';
import { currentUser as mockUser } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: 'student' | 'teacher') => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
}

interface RegisterData {
  name: string;
  surname: string;
  email: string;
  phone?: string;
  password: string;
  role: 'student' | 'teacher';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('rim_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error('Kayıtlı kullanıcı verisi okunamadı', e);
        return null;
      }
    }
    return null;
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string, role: 'student' | 'teacher'): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      if (role === 'student') {
        const response = await fetch('http://localhost:5000/api/student/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success && data.token) {
          const mappedUser: User = {
            id: data.student.id,
            name: data.student.name,
            surname: data.student.surname,
            email: data.student.email,
            phone: data.student.phoneNumber,
            role: 'student',
            createdAt: new Date(), // Şimdilik yeni tarih, ileride backend'den alınabilir
          };
          setUser(mappedUser);
          localStorage.setItem('rim_auth_token', data.token);
          localStorage.setItem('rim_user', JSON.stringify(mappedUser));
          setIsLoading(false);
          return true;
        } else {
          console.error(data.message);
          setIsLoading(false);
          return false;
        }
      } else {
        // Mock teacher login
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (email && password) {
          const loggedInUser: User = {
            ...mockUser,
            email,
            role,
            name: 'Müəllim',
          };
          setUser(loggedInUser);
          setIsLoading(false);
          return true;
        }
      }
    } catch (err) {
      console.error('Giriş hatası:', err);
      setIsLoading(false);
      return false;
    }
    
    setIsLoading(false);
    return false;
  }, []);

  const register = useCallback(async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      if (userData.role === 'student') {
        const response = await fetch('http://localhost:5000/api/student/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: userData.name,
            surname: userData.surname,
            email: userData.email,
            password: userData.password,
            phoneNumber: userData.phone || ''
          })
        });
        
        const data = await response.json();
        
        if (data.success && data.token) {
          const mappedUser: User = {
            id: data.student.id,
            name: data.student.name,
            surname: data.student.surname,
            email: data.student.email,
            phone: data.student.phoneNumber,
            role: 'student',
            createdAt: new Date(),
          };
          setUser(mappedUser);
          localStorage.setItem('rim_auth_token', data.token);
          localStorage.setItem('rim_user', JSON.stringify(mappedUser));
          setIsLoading(false);
          return true;
        } else {
          console.error(data.message);
          setIsLoading(false);
          return false;
        }
      } else {
        // Mock teacher registration
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newUser: User = {
          id: `u${Date.now()}`,
          name: userData.name,
          surname: userData.surname,
          email: userData.email,
          phone: userData.phone,
          role: userData.role,
          createdAt: new Date(),
        };
        setUser(newUser);
        setIsLoading(false);
        return true;
      }
    } catch (err) {
      console.error('Kayıt hatası:', err);
      setIsLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('rim_auth_token');
    localStorage.removeItem('rim_user');
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
