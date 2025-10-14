import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthInitializer } from './components/auth-initializer';
import { Layout } from './components/layout';
import { HomePage } from './pages/home-page';
import { LoginPage } from './pages/login-page';
import { RegisterPage } from './pages/register-page';
import { DashboardPage } from './pages/dashboard-page';
import { ComponentsShowcase } from './pages/components-showcase';
import { GalleryPage } from './pages/gallery-page';

function App() {
  return (
    <AuthInitializer>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/components" element={<ComponentsShowcase />} />
          <Route path="/gallery" element={<GalleryPage />} />
        </Routes>
      </Layout>
    </AuthInitializer>
  );
}

export default App;
