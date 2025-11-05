import {
  createAsyncThunk,
  createSlice,
  type ActionReducerMapBuilder,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import { apolloClient, TOKEN_STORAGE_KEY } from "@/lib/apollo-client";
import { LOGIN_MUTATION, REGISTER_MUTATION, ME_QUERY } from "@/graphql/auth";
import { ApolloError } from "@apollo/client";

export interface PublicUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  provider: "local" | "google" | "facebook";
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
}

interface AuthState {
  user: PublicUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  isProcessing: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isHydrating: true,
  isProcessing: false,
  error: null,
};

const extractErrorMessage = (error: unknown): string => {
  if (error instanceof ApolloError) {
    if (error.graphQLErrors.length > 0) {
      return error.graphQLErrors[0].message;
    }

    if (error.networkError) {
      return error.networkError.message;
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
};

const persistToken = (value: string | null): void => {
  if (value) {
    localStorage.setItem(TOKEN_STORAGE_KEY, value);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
};

const deriveApiBase = (): string => {
  const explicit = import.meta.env.VITE_API_URL as string | undefined;
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  const graphqlUrl =
    (import.meta.env.VITE_GRAPHQL_URL as string | undefined) ||
    "http://localhost:3000/graphql";

  try {
    const url = new URL(graphqlUrl);
    return url.origin.replace(/\/$/, "");
  } catch (error) {
    console.warn("Failed to derive API base from GRAPHQL url", error);
    return "http://localhost:3000";
  }
};

const API_BASE = deriveApiBase();

const fetchProfile = async (): Promise<PublicUser> => {
  const { data } = await apolloClient.query<{ me: PublicUser }>({
    query: ME_QUERY,
    fetchPolicy: "network-only",
  });

  return data.me;
};

export const hydrateSession = createAsyncThunk<
  { token: string; user: PublicUser } | null,
  void,
  { rejectValue: string }
>("auth/hydrate", async (_, thunkApi) => {
  const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

  if (!storedToken) {
    return null;
  }

  try {
    const profile = await fetchProfile();
    return { token: storedToken, user: profile };
  } catch (error) {
    persistToken(null);
    await apolloClient.clearStore().catch(() => undefined);
    return thunkApi.rejectWithValue(extractErrorMessage(error));
  }
});

export const loginUser = createAsyncThunk<
  { token: string; user: PublicUser },
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (credentials: LoginCredentials, thunkApi) => {
  try {
    const { data } = await apolloClient.mutate<{
      login: { accessToken: string; user: PublicUser };
    }>({
      mutation: LOGIN_MUTATION,
      variables: { input: credentials },
      fetchPolicy: "no-cache",
    });

    if (!data?.login) {
      throw new Error("Unexpected response from login mutation");
    }

    persistToken(data.login.accessToken);
    return { token: data.login.accessToken, user: data.login.user };
  } catch (error) {
    const message = extractErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
});

export const registerUser = createAsyncThunk<
  { token: string; user: PublicUser },
  RegisterPayload,
  { rejectValue: string }
>("auth/register", async (payload: RegisterPayload, thunkApi) => {
  try {
    const { data } = await apolloClient.mutate<{
      register: { accessToken: string; user: PublicUser };
    }>({
      mutation: REGISTER_MUTATION,
      variables: { input: payload },
      fetchPolicy: "no-cache",
    });

    if (!data?.register) {
      throw new Error("Unexpected response from register mutation");
    }

    persistToken(data.register.accessToken);
    return { token: data.register.accessToken, user: data.register.user };
  } catch (error) {
    const message = extractErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
});

export const completeOAuthFlow = createAsyncThunk<
  { token: string; user: PublicUser },
  string,
  { rejectValue: string }
>("auth/completeOAuth", async (accessToken: string, thunkApi) => {
  try {
    persistToken(accessToken);
    const profile = await fetchProfile();
    return { token: accessToken, user: profile };
  } catch (error) {
    persistToken(null);
    await apolloClient.clearStore().catch(() => undefined);
    const message = extractErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
});

export const logoutUser = createAsyncThunk<void, void>(
  "auth/logout",
  async () => {
    persistToken(null);
    await apolloClient.clearStore().catch(() => undefined);
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<AuthState>) => {
    builder
      .addCase(hydrateSession.pending, (state: AuthState) => {
        state.isHydrating = true;
        state.error = null;
      })
      .addCase(
        hydrateSession.fulfilled,
        (
          state: AuthState,
          action: PayloadAction<{ token: string; user: PublicUser } | null>
        ) => {
          state.isHydrating = false;
          state.error = null;

          if (action.payload) {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
          } else {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
          }
        }
      )
      .addCase(
        hydrateSession.rejected,
        (
          state: AuthState,
          action: ReturnType<typeof hydrateSession.rejected>
        ) => {
          state.isHydrating = false;
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          state.error = action.payload || action.error.message || null;
        }
      )
      .addCase(loginUser.pending, (state: AuthState) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (
          state: AuthState,
          action: PayloadAction<{ token: string; user: PublicUser }>
        ) => {
          state.isProcessing = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      )
      .addCase(
        loginUser.rejected,
        (state: AuthState, action: ReturnType<typeof loginUser.rejected>) => {
          state.isProcessing = false;
          state.error = action.payload || action.error.message || null;
        }
      )
      .addCase(registerUser.pending, (state: AuthState) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (
          state: AuthState,
          action: PayloadAction<{ token: string; user: PublicUser }>
        ) => {
          state.isProcessing = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      )
      .addCase(
        registerUser.rejected,
        (
          state: AuthState,
          action: ReturnType<typeof registerUser.rejected>
        ) => {
          state.isProcessing = false;
          state.error = action.payload || action.error.message || null;
        }
      )
      .addCase(completeOAuthFlow.pending, (state: AuthState) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(
        completeOAuthFlow.fulfilled,
        (
          state: AuthState,
          action: PayloadAction<{ token: string; user: PublicUser }>
        ) => {
          state.isProcessing = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      )
      .addCase(
        completeOAuthFlow.rejected,
        (
          state: AuthState,
          action: ReturnType<typeof completeOAuthFlow.rejected>
        ) => {
          state.isProcessing = false;
          state.error = action.payload || action.error.message || null;
        }
      )
      .addCase(logoutUser.fulfilled, (state: AuthState) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const beginOAuth = (provider: "google" | "facebook") => {
  window.location.href = `${API_BASE}/auth/${provider}`;
};

export const selectAuth = (state: RootState) => state.auth;

export const authReducer = authSlice.reducer;
