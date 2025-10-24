import { Outlet } from 'react-router-dom'
import { SidebarProvider } from '@/components/ui/sidebar'
import {
  DashboardHeader,
  DashboardSidebar,
} from '@/components/dashboard/dashboard-sidebar'

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="p-3 w-full">
        <DashboardHeader />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}

export default DashboardLayout
