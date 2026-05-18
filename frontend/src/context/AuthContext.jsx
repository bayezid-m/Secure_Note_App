import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearStoredToken, getStoredToken, setStoredToken } from '../utils/storage';

const AuthContext = createContext(null);

function isJwtStructurallyValid(token) {
  if (!token) return false;
  const parts = token.split('.');
  return parts.length === 3 && parts.every(Boolean);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const stored = getStoredToken();
    return isJwtStructurallyValid(stored) ? stored : '';
  });

  useEffect(() => {
    if (token && isJwtStructurallyValid(token)) {
      setStoredToken(token);
    } else {
      clearStoredToken();
    }
  }, [token]);

  const login = (newToken) => {
    if (isJwtStructurallyValid(newToken)) {
      setToken(newToken);
    }
  };

  const logout = () => {
    setToken('');
    clearStoredToken();
  };

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
