import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { User } from '../types';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { ADMIN_USER } from '@/constants';
import { trackAuthError, trackAuthStart, trackAuthSuccess } from '@/analytics';

type AuthFlow = 'login' | 'signup';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginWithGoogle: (authFlow?: AuthFlow) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const authFlowRef = useRef<AuthFlow>('login');

  // Check for persisted user on mount
  useEffect(() => {
    // For local testing, automatically log in the admin user
    if (import.meta.env.DEV) {
      setUser(ADMIN_USER);
      localStorage.setItem('muzikpick_user', JSON.stringify(ADMIN_USER));
    } else {
      const storedUser = localStorage.getItem('muzikpick_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setIsLoading(false);
  }, []);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        // Fetch user info using the access token
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        const profile = userInfo.data;
        
        const newUser: User = {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          avatarUrl: profile.picture
        };

        setUser(newUser);
        localStorage.setItem('muzikpick_user', JSON.stringify(newUser));
        trackAuthSuccess({ authFlow: authFlowRef.current, method: 'google' });
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        trackAuthError({
          authFlow: authFlowRef.current,
          method: 'google',
          errorType: 'profile_fetch_error'
        });
      } finally {
        setIsLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error('Google Login Failed:', errorResponse);
      trackAuthError({
        authFlow: authFlowRef.current,
        method: 'google',
        errorType: 'oauth_error'
      });
      setIsLoading(false);
    }
  });

  const loginWithGoogle = (authFlow: AuthFlow = 'login') => {
    authFlowRef.current = authFlow;
    trackAuthStart({ authFlow, method: 'google' });
    setIsLoading(true);

    try {
      googleLogin();
    } catch (error) {
      console.error('Failed to launch Google Login:', error);
      trackAuthError({
        authFlow,
        method: 'google',
        errorType: 'oauth_launch_error'
      });
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('muzikpick_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};