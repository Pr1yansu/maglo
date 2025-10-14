import React, { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { initializeAuth } from '../store/slices/auth-slice';

interface AuthInitializerProps {
  children: React.ReactNode;
}

export const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return <>{children}</>;
};
