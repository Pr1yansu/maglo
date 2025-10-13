import { useMutation, useQuery } from '@tanstack/react-query';
import { gql } from '@apollo/client';
import { client } from '../graphql/client';
import { useAuth } from '../contexts/auth-context';
import { queryClient } from '../lib/query-client';

// GraphQL Mutations and Queries
const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      access_token
      user {
        id
        email
        username
        firstName
        lastName
        isActive
        isVerified
        createdAt
        updatedAt
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
      access_token
      user {
        id
        email
        username
        firstName
        lastName
        isActive
        isVerified
        createdAt
        updatedAt
      }
    }
  }
`;

const GET_USERS_QUERY = gql`
  query GetUsers {
    users {
      id
      email
      username
      firstName
      lastName
      isActive
      isVerified
      createdAt
      updatedAt
    }
  }
`;

// Auth hooks
export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (variables: { email: string; password: string }) => {
      const { data } = await client.mutate({
        mutation: LOGIN_MUTATION,
        variables: { loginInput: variables },
      });
      return data.login;
    },
    onSuccess: (data) => {
      login(data.access_token, data.user);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useRegister = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (variables: {
      email: string;
      username: string;
      password: string;
      firstName?: string;
      lastName?: string;
    }) => {
      const { data } = await client.mutate({
        mutation: REGISTER_MUTATION,
        variables: { registerInput: variables },
      });
      return data.register;
    },
    onSuccess: (data) => {
      login(data.access_token, data.user);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuth();

  return useMutation({
    mutationFn: async () => {
      // Clear any cached data
      queryClient.clear();
      logout();
    },
  });
};

// Data hooks
export const useUsers = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await client.query({
        query: GET_USERS_QUERY,
        fetchPolicy: 'cache-first',
      });
      return data.users;
    },
    enabled: isAuthenticated,
  });
};

// Profile hook
export const useProfile = () => {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['profile'],
    queryFn: () => user,
    enabled: isAuthenticated && !!user,
    staleTime: Infinity, // Profile data comes from auth context
  });
};
