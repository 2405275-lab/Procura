import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('auth_token') === 'true';
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('auth_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, rememberMe: boolean): Promise<boolean> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const mockUser: User = {
      email,
      name: email.split('@')[0].split('.').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' '),
      role: 'Procurement Director',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    };

    setIsAuthenticated(true);
    setUser(mockUser);

    if (rememberMe) {
      localStorage.setItem('auth_token', 'true');
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
    } else {
      sessionStorage.setItem('auth_token', 'true');
      sessionStorage.setItem('auth_user', JSON.stringify(mockUser));
    }

    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_user');
  };

  // Sync token from sessionStorage/localStorage on boot
  useEffect(() => {
    const localToken = localStorage.getItem('auth_token') === 'true';
    const sessionToken = sessionStorage.getItem('auth_token') === 'true';
    
    if (localToken || sessionToken) {
      setIsAuthenticated(true);
      const savedUser = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser({
          email: 'admin@veridion.com',
          name: 'Sarah Jenkins',
          role: 'Procurement Manager',
        });
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
