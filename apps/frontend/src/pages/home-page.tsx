import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  return (
    <div className="text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Welcome to Maglo</h1>
        <p className="text-xl text-gray-600 mb-8">
          A modern full-stack application built with NestJS, GraphQL, Drizzle ORM, PostgreSQL,
          React, React Query, and Tailwind CSS.
        </p>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-primary-600 mb-2">🚀 NestJS Backend</h3>
              <p className="text-gray-600">Scalable Node.js framework with TypeScript support</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-primary-600 mb-2">🔍 GraphQL API</h3>
              <p className="text-gray-600">Flexible and efficient API with type safety</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-primary-600 mb-2">🗄️ Drizzle ORM</h3>
              <p className="text-gray-600">Type-safe database operations with PostgreSQL</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-primary-600 mb-2">⚛️ React Frontend</h3>
              <p className="text-gray-600">Modern UI with component-based architecture</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-primary-600 mb-2">🔄 React Query</h3>
              <p className="text-gray-600">Powerful server state management for React</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-primary-600 mb-2">🎨 Tailwind CSS</h3>
              <p className="text-gray-600">Utility-first CSS framework for rapid styling</p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Link
            to="/register"
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg text-lg inline-block"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};
