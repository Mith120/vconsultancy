import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: string) => Promise<void>;
  signup: (userData: Omit<User, 'id'> & { password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('e6_user');
    const storedToken = localStorage.getItem('e6_token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string, role: string = 'customer') => {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, role })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Invalid credentials');
    }

    const data = await response.json();
    const loggedInUser: User = {
      ...data.user,
      id: data.user.id || `user-${Date.now()}`,
    };

    setUser(loggedInUser);
    setToken(data.token);
    setIsAuthenticated(true);
    localStorage.setItem('e6_user', JSON.stringify(loggedInUser));
    localStorage.setItem('e6_token', data.token);
  };

  const signup = async (userData: Omit<User, 'id'> & { password: string }) => {
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to register');
    }

    const data = await response.json();
    const newUser: User = {
      ...data.user,
      id: data.user.id || `user-${Date.now()}`,
    };

    setUser(newUser);
    setToken(data.token);
    setIsAuthenticated(true);
    localStorage.setItem('e6_user', JSON.stringify(newUser));
    localStorage.setItem('e6_token', data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('e6_user');
    localStorage.removeItem('e6_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
