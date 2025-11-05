import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  DashboardHeader,
  DashboardSidebar,
} from "@/components/dashboard/dashboard-sidebar";

const DashboardLayout = () => {
  return (
    <>
      <div className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:top-4 focus-within:left-4 focus-within:z-50 focus-within:flex focus-within:gap-2">
        <a
          href="#main-content"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>
        <a
          href="#sidebar-navigation"
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to navigation
        </a>
      </div>

      <div className="h-screen bg-background flex flex-col">
        <SidebarProvider>
          {/* Navigation landmark */}
          <nav
            id="sidebar-navigation"
            aria-label="Dashboard navigation"
            role="navigation"
          >
            <DashboardSidebar />
          </nav>

          {/* Main content area */}
          <div className="flex flex-col flex-1 w-full min-h-0">
            {/* Header landmark */}
            <header
              className="p-5 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0"
              role="banner"
              aria-label="Dashboard header"
            >
              <DashboardHeader />
            </header>

            {/* Main content landmark */}
            <main
              id="main-content"
              className="flex-1 p-5 w-full overflow-auto min-h-0"
              role="main"
              aria-label="Dashboard main content"
            >
              <Outlet />
            </main>
          </div>
        </SidebarProvider>
      </div>
    </>
  );
};

export default DashboardLayout;
