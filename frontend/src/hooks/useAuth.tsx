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
  login: (email: string, rememberMe: boolean, role?: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (name: string, email: string, avatar?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('auth_token') === 'true';
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, rememberMe: boolean, role: string = 'Procurement Officer'): Promise<boolean> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Load role profile if it exists
    const savedProfilesStr = localStorage.getItem('procura_role_profiles');
    const savedProfiles = savedProfilesStr ? JSON.parse(savedProfilesStr) : {};
    const roleProfile = savedProfiles[role] || {};
    
    const mockUser: User = {
      email: roleProfile.email || email,
      name: roleProfile.name || (roleProfile.name || email.split('@')[0].split('.').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')),
      role: role,
      avatar: roleProfile.avatar || undefined,
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

  const updateUserProfile = (name: string, email: string, avatar?: string) => {
    if (!user) return;
    const updatedUser = { ...user, name, email, avatar };
    setUser(updatedUser);

    // Save to active session storage
    if (localStorage.getItem('auth_token') === 'true') {
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    }
    if (sessionStorage.getItem('auth_token') === 'true') {
      sessionStorage.setItem('auth_user', JSON.stringify(updatedUser));
    }

    // Also update role profiles mapping
    const savedProfilesStr = localStorage.getItem('procura_role_profiles');
    const savedProfiles = savedProfilesStr ? JSON.parse(savedProfilesStr) : {};
    savedProfiles[user.role] = { name, email, avatar };
    localStorage.setItem('procura_role_profiles', JSON.stringify(savedProfiles));
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
          email: 'admin@procura.com',
          name: 'Sarah Jenkins',
          role: 'Procurement Manager',
        });
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUserProfile }}>
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
