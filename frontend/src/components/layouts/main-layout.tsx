import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:font-medium"
      >
        Skip to main content
      </a>

      <div className="min-h-screen bg-background">
        <main
          id="main-content"
          className="p-3 container mx-auto"
          role="main"
          aria-label="Main content area"
        >
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default MainLayout;
