import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  beginOAuth,
  completeOAuthFlow,
  loginUser,
  logoutUser,
  registerUser,
  selectAuth,
  type LoginCredentials,
  type RegisterPayload,
} from "@/store/auth/auth-slice";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector(selectAuth);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const result = await dispatch(loginUser(credentials)).unwrap();
      return result.user;
    },
    [dispatch]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const result = await dispatch(registerUser(payload)).unwrap();
      return result.user;
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    await dispatch(logoutUser()).unwrap();
  }, [dispatch]);

  const completeOAuth = useCallback(
    async (token: string) => {
      const result = await dispatch(completeOAuthFlow(token)).unwrap();
      return result.user;
    },
    [dispatch]
  );

  return {
    ...authState,
    login,
    register,
    logout,
    beginOAuth,
    completeOAuth,
  };
};
