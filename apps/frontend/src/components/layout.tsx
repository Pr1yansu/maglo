import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useLogout } from '../hooks/use-auth';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { TransitionLink } from './ui/transition-link';
import { PageTransitionWrapper } from './page-transition-wrapper';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const logoutMutation = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate('/');
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <TransitionLink to="/" className="flex-shrink-0" transitionType="fade">
                <h1 className="text-xl font-bold text-primary-600">Maglo</h1>
              </TransitionLink>
            </div>

            <div className="flex items-center space-x-4">
              <TransitionLink
                to="/components"
                className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium"
                transitionType="slide"
              >
                Components
              </TransitionLink>
              <TransitionLink
                to="/gallery"
                className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium"
                transitionType="fade"
              >
                Gallery
              </TransitionLink>

              {isAuthenticated ? (
                <>
                  <TransitionLink
                    to="/dashboard"
                    className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium"
                    transitionType="fade"
                  >
                    Dashboard
                  </TransitionLink>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{user?.username}</span>
                    </div>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                    >
                      {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" asChild>
                    <TransitionLink to="/login" transitionType="fade">
                      Login
                    </TransitionLink>
                  </Button>
                  <Button asChild>
                    <TransitionLink to="/register" transitionType="scale">
                      Register
                    </TransitionLink>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <PageTransitionWrapper>
        <main className="max-w-7xl mx-auto py-6 px-4">{children}</main>
      </PageTransitionWrapper>
    </div>
  );
};
