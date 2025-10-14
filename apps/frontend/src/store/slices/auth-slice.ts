import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload;

      // Set cookies with secure options
      const cookieOptions = {
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
      };

      Cookies.set('auth-token', token, cookieOptions);
      Cookies.set('user-data', JSON.stringify(user), cookieOptions);

      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.loading = false;
    },
    logout: (state) => {
      Cookies.remove('auth-token');
      Cookies.remove('user-data');

      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    initializeAuth: (state) => {
      const token = Cookies.get('auth-token');
      const userData = Cookies.get('user-data');

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          state.user = parsedUser;
          state.token = token;
          state.isAuthenticated = true;
        } catch (error) {
          // If parsing fails, clear invalid cookies
          Cookies.remove('auth-token');
          Cookies.remove('user-data');
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      }
      state.loading = false;
    },
  },
});

export const { setLoading, loginSuccess, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
