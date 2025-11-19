'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, apiClient } from '@/lib/api-client';
import Cookies from 'js-cookie';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    full_name: string;
    role: string;
  }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const checkAuth = async () => {
    const token = Cookies.get('token');
    if (!token) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    try {
      dispatch({ type: 'AUTH_START' });
      const response = await apiClient.getMe();

      if (response.success) {
        dispatch({ type: 'AUTH_SUCCESS', payload: response.data.user });
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: 'Failed to authenticate' });
        Cookies.remove('token');
      }
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: 'Session expired' });
      Cookies.remove('token');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await apiClient.login({ email, password });

      if (response.success) {
        dispatch({ type: 'AUTH_SUCCESS', payload: response.data.user });
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.message });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
    }
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    full_name: string;
    role: string;
  }) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await apiClient.register(userData);

      if (response.success) {
        dispatch({ type: 'AUTH_SUCCESS', payload: response.data.user });
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.message });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      // Even if logout fails on server, clear local state
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
      Cookies.remove('token');
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};