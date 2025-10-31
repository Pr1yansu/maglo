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
      <main className="p-5 w-full overflow-x-auto">
        <DashboardHeader />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}

export default DashboardLayout
