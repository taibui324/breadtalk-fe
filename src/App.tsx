import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'sonner';
import { lazy, Suspense, useMemo, useState } from 'react';

// Auth Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Components
import LoadingScreen from './components/LoadingScreen';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages - Auth
import LoginPage from './pages/auth/LoginPage';

// Pages - Dashboard
import DashboardPage from './pages/dashboard/DashboardPage';

// Pages - Headquarters
import HQSendIngredientPage from './pages/hq/HQSendIngredientPage';

// Pages - Store
import StoreDailyProduction from './pages/store/StoreDailyProduction';

// Create a theme based on the minimals design
const createCustomTheme = (mode: 'light' | 'dark') => {
  return createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: {
              main: '#00A76F',
              light: '#5BE49B',
              dark: '#007867',
              contrastText: '#FFFFFF',
            },
            secondary: {
              main: '#8E33FF',
              light: '#C684FF',
              dark: '#5119B7',
              contrastText: '#FFFFFF',
            },
            success: {
              main: '#22C55E',
              light: '#77ED8B', 
              dark: '#118D57',
              contrastText: '#FFFFFF',
            },
            warning: {
              main: '#FFAB00',
              light: '#FFD666',
              dark: '#B76E00',
              contrastText: '#1C252E',
            },
            error: {
              main: '#FF5630',
              light: '#FFAC82',
              dark: '#B71D18',
              contrastText: '#FFFFFF',
            },
            info: {
              main: '#00B8D9',
              light: '#61F3F3',
              dark: '#006C9C',
              contrastText: '#FFFFFF',
            },
            grey: {
              50: '#FCFDFD',
              100: '#F9FAFB',
              200: '#F4F6F8',
              300: '#DFE3E8',
              400: '#C4CDD5',
              500: '#919EAB',
              600: '#637381',
              700: '#454F5B',
              800: '#1C252E',
              900: '#141A21',
            },
            background: {
              default: '#F9FAFB',
              paper: '#FFFFFF',
            },
            text: {
              primary: '#1C252E',
              secondary: '#637381',
              disabled: '#919EAB',
            },
            action: {
              active: '#637381',
              hover: alpha('#919EAB', 0.08),
              selected: alpha('#919EAB', 0.16),
              disabled: alpha('#919EAB', 0.8),
              focus: alpha('#919EAB', 0.24),
              disabledBackground: alpha('#919EAB', 0.24),
              hoverOpacity: 0.08,
              disabledOpacity: 0.48,
            },
            divider: alpha('#919EAB', 0.2),
          }
        : {
            // Dark mode palette
            primary: {
              main: '#00A76F',
              light: '#5BE49B',
              dark: '#007867',
              contrastText: '#FFFFFF',
            },
            secondary: {
              main: '#8E33FF',
              light: '#C684FF',
              dark: '#5119B7',
              contrastText: '#FFFFFF',
            },
            background: {
              default: '#171C24',
              paper: '#222B36',
            },
            text: {
              primary: '#FFFFFF',
              secondary: '#919EAB',
              disabled: '#637381',
            },
            action: {
              active: '#919EAB',
              hover: alpha('#919EAB', 0.08),
              selected: alpha('#919EAB', 0.16),
              disabled: alpha('#919EAB', 0.8),
              focus: alpha('#919EAB', 0.24),
              disabledBackground: alpha('#919EAB', 0.24),
              hoverOpacity: 0.08,
              disabledOpacity: 0.48,
            },
            divider: alpha('#919EAB', 0.24),
          }),
    },
    typography: {
      fontFamily: '"Public Sans", "Roboto", "Arial", sans-serif',
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
      h1: {
        fontWeight: 700,
        lineHeight: 1.2,
        fontSize: '2.5rem',
      },
      h2: {
        fontWeight: 700,
        lineHeight: 1.3,
        fontSize: '2rem',
      },
      h3: {
        fontWeight: 700,
        lineHeight: 1.4,
        fontSize: '1.5rem',
      },
      h4: {
        fontWeight: 700,
        lineHeight: 1.5,
        fontSize: '1.25rem',
      },
      h5: {
        fontWeight: 600,
        lineHeight: 1.5,
        fontSize: '1.125rem',
      },
      h6: {
        fontWeight: 600,
        lineHeight: 1.5,
        fontSize: '1rem',
      },
      subtitle1: {
        fontWeight: 500,
        lineHeight: 1.5,
        fontSize: '1rem',
      },
      subtitle2: {
        fontWeight: 500,
        lineHeight: 1.5,
        fontSize: '0.875rem',
      },
      body1: {
        lineHeight: 1.5,
        fontSize: '1rem',
      },
      body2: {
        lineHeight: 1.5,
        fontSize: '0.875rem',
      },
      caption: {
        lineHeight: 1.5,
        fontSize: '0.75rem',
      },
      overline: {
        fontWeight: 600,
        lineHeight: 1.5,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
      },
      button: {
        fontWeight: 600,
        lineHeight: 1.71429,
        fontSize: '0.875rem',
        textTransform: 'capitalize',
      },
    },
    shape: {
      borderRadius: 8,
    },
    shadows: [
      'none',
      '0px 1px 2px rgba(0, 0, 0, 0.08)',
      '0px 2px 4px rgba(0, 0, 0, 0.08)',
      '0px 4px 8px rgba(0, 0, 0, 0.08)',
      '0px 8px 16px rgba(0, 0, 0, 0.08)',
      '0px 12px 24px -4px rgba(0, 0, 0, 0.12)',
      '0px 16px 32px -4px rgba(0, 0, 0, 0.12)',
      '0px 20px 40px -4px rgba(0, 0, 0, 0.16)',
      '0px 24px 48px rgba(0, 0, 0, 0.20)',
      '0px 1px 1px rgba(0, 0, 0, 0.04)',
      '0px 2px 2px rgba(0, 0, 0, 0.08)',
      '0px 3px 3px rgba(0, 0, 0, 0.12)',
      '0px 4px 4px rgba(0, 0, 0, 0.16)',
      '0px 5px 5px rgba(0, 0, 0, 0.20)',
      '0px 6px 6px rgba(0, 0, 0, 0.24)',
      '0px 7px 7px rgba(0, 0, 0, 0.28)',
      '0px 8px 8px rgba(0, 0, 0, 0.32)',
      '0px 9px 9px rgba(0, 0, 0, 0.36)',
      '0px 10px 10px rgba(0, 0, 0, 0.40)',
      '0px 11px 11px rgba(0, 0, 0, 0.44)',
      '0px 12px 12px rgba(0, 0, 0, 0.48)',
      '0px 13px 13px rgba(0, 0, 0, 0.52)',
      '0px 14px 14px rgba(0, 0, 0, 0.56)',
      '0px 15px 15px rgba(0, 0, 0, 0.60)',
      '0px 16px 16px rgba(0, 0, 0, 0.64)',
      '0px 17px 17px rgba(0, 0, 0, 0.68)',
    ] as unknown as string[],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            fontWeight: 600,
            boxShadow: 'none',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0px 4px 12px -4px rgba(0, 0, 0, 0.2)',
            },
          },
          outlined: {
            '&:hover': {
              boxShadow: '0px 2px 6px -2px rgba(0, 0, 0, 0.1)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          rounded: {
            borderRadius: 16,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRadius: 0,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: alpha('#919EAB', 0.2),
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          rounded: {
            borderRadius: 8,
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 4,
          },
        },
      },
    },
  });
};

// Placeholder component for routes not yet implemented
const PlaceholderPage = ({ pageName }: { pageName: string }) => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h2>{pageName}</h2>
    <p>This page is under construction.</p>
  </div>
);

// Loading component replaced with LoadingScreen
const LoadingPage = () => <LoadingScreen message="Loading application..." />;

// Protected Route component
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required, check if user has it
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  
  const theme = useMemo(() => createCustomTheme(mode), [mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-right" richColors />
      <Router>
        <AuthProvider>
          <Suspense fallback={<LoadingPage />}>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />

              {/* Dashboard Layout - Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardPage />} />

                {/* HQ Routes */}
                <Route path="hq">
                  <Route
                    path="send-ingredient"
                    element={
                      <ProtectedRoute requiredRole="hq">
                        <HQSendIngredientPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="send-product" element={<PlaceholderPage pageName="Send Product" />} />
                  <Route path="order-history" element={<PlaceholderPage pageName="Order History" />} />
                  <Route path="ingredient-list" element={<PlaceholderPage pageName="Ingredient List" />} />
                  <Route path="production-list" element={<PlaceholderPage pageName="Production List" />} />
                  <Route path="ingredient-database" element={<PlaceholderPage pageName="Ingredient Database" />} />
                  <Route path="semi-products-database" element={<PlaceholderPage pageName="Semi Products Database" />} />
                  <Route path="products-database" element={<PlaceholderPage pageName="Products Database" />} />
                  <Route path="employee-management" element={<PlaceholderPage pageName="Employee Management" />} />
                  <Route path="store-management" element={<PlaceholderPage pageName="Store Management" />} />
                  <Route path="statistics" element={<PlaceholderPage pageName="Statistics" />} />
                </Route>

                {/* Central Kitchen Routes */}
                <Route path="central-kitchen">
                  <Route
                    path="receive-order"
                    element={
                      <ProtectedRoute requiredRole="central-kitchen">
                        <PlaceholderPage pageName="CK Receive Order" />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="order-history" element={<PlaceholderPage pageName="CK Order History" />} />
                  <Route path="production-list" element={<PlaceholderPage pageName="CK Production List" />} />
                  <Route path="daily-production" element={<PlaceholderPage pageName="CK Daily Production" />} />
                  <Route path="inventory" element={<PlaceholderPage pageName="CK Inventory" />} />
                </Route>

                {/* Store Routes */}
                <Route path="store">
                  <Route path="receive-order" element={<PlaceholderPage pageName="Store Receive Order" />} />
                  <Route path="order-history" element={<PlaceholderPage pageName="Store Order History" />} />
                  <Route path="production-list" element={<PlaceholderPage pageName="Store Production List" />} />
                  <Route
                    path="daily-production"
                    element={
                      <ProtectedRoute requiredRole="store">
                        <StoreDailyProduction />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="inventory" element={<PlaceholderPage pageName="Store Inventory" />} />
                </Route>
              </Route>

              {/* Redirect to login for any unknown routes */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
