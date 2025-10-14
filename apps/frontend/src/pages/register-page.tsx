import React from 'react';
import { SEO } from '../components/seo';

export const RegisterPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Sign Up"
        description="Create your Maglo account and join our modern full-stack platform. Quick and secure registration process."
        keywords="register, sign up, create account, maglo registration"
        url="/register"
        noindex={true}
      />
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="text-center text-gray-600">Registration form coming soon...</p>
        </div>
      </div>
    </>
  );
};
