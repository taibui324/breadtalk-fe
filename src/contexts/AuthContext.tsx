import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// User roles
export type UserRole = 'hq' | 'central-kitchen' | 'store';

// User interface
export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  storeId?: string; // For store and central kitchen users
  storeName?: string; // For store and central kitchen users
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample users for demonstration - In a real app, these would come from a database
const SAMPLE_USERS = [
  {
    id: 'user-hq-1',
    username: 'admin',
    password: 'password',
    name: 'Admin User',
    email: 'admin@breadtalk.com',
    role: 'hq' as UserRole,
  },
  {
    id: 'user-ck-1',
    username: 'kitchen',
    password: 'password',
    name: 'Kitchen Manager',
    email: 'kitchen@breadtalk.com',
    role: 'central-kitchen' as UserRole,
    storeId: 'ck-001',
    storeName: 'Central Kitchen - Main',
  },
  {
    id: 'user-store-1',
    username: 'store1',
    password: 'password',
    name: 'Store Manager 1',
    email: 'store1@breadtalk.com',
    role: 'store' as UserRole,
    storeId: 'st-001',
    storeName: 'Store #1 - Downtown',
  },
  {
    id: 'user-store-2',
    username: 'store2',
    password: 'password',
    name: 'Store Manager 2',
    email: 'store2@breadtalk.com',
    role: 'store' as UserRole,
    storeId: 'st-002',
    storeName: 'Store #2 - Westside',
  },
];

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for saved user on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('breadtalk_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (username: string, password: string, role: UserRole) => {
    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find user by username and password
    const foundUser = SAMPLE_USERS.find(
      u => u.username === username && u.password === password && u.role === role
    );

    if (!foundUser) {
      setLoading(false);
      throw new Error('Invalid username or password');
    }

    // Create user object without password
    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);

    // Save to local storage
    localStorage.setItem('breadtalk_user', JSON.stringify(userWithoutPassword));

    setLoading(false);

    // Navigate to appropriate home page based on role
    navigate('/');
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('breadtalk_user');
    navigate('/login');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// HOC for protected routes
export const withAuth = (Component: React.ComponentType<any>) => {
  return function WithAuth(props: any) {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        navigate('/login');
      }
    }, [isAuthenticated, loading, navigate]);

    if (loading) {
      return <div>Loading...</div>; // You can replace with a proper loading component
    }

    return isAuthenticated ? <Component {...props} /> : null;
  };
};
