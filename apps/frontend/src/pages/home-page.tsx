import React from 'react';
import { SEO } from '../components/seo';
import { TransitionLink, Button, Card, CardContent } from '../components/ui';

export const HomePage: React.FC = () => {
  return (
    <>
      <SEO
        title="Home"
        description="Welcome to Maglo - A modern full-stack application built with NestJS, GraphQL, Drizzle ORM, PostgreSQL, React, Redux Toolkit, and Tailwind CSS. Get started with our powerful features today."
        keywords="maglo, full-stack application, react, nestjs, graphql, home"
        url="/"
      />
      <div className="text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Welcome to Maglo</h1>
          <p className="text-xl text-muted-foreground mb-8">
            A modern full-stack application built with NestJS, GraphQL, Drizzle ORM, PostgreSQL,
            React, React Query, and Tailwind CSS.
          </p>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-primary mb-2">🚀 NestJS Backend</h3>
                  <p className="text-muted-foreground">
                    Scalable Node.js framework with TypeScript support
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-primary mb-2">🔍 GraphQL API</h3>
                  <p className="text-muted-foreground">
                    Flexible and efficient API with type safety
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-primary mb-2">🗄️ Drizzle ORM</h3>
                  <p className="text-muted-foreground">
                    Type-safe database operations with PostgreSQL
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-primary mb-2">⚛️ React Frontend</h3>
                  <p className="text-muted-foreground">
                    Modern UI with component-based architecture
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-primary mb-2">🔄 React Query</h3>
                  <p className="text-muted-foreground">
                    Powerful server state management for React
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-primary mb-2">🎨 Tailwind CSS</h3>
                  <p className="text-muted-foreground">
                    Utility-first CSS framework for rapid styling
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-12">
            <Button asChild size="lg" className="text-lg">
              <TransitionLink to="/register" transitionType="scale">
                Get Started
              </TransitionLink>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
