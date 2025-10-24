import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  LucideHelpCircle,
  LogOut,
  Bell,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Combobox } from '@/components/ui/combo-box'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

// Menu items.
const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Search',
    url: '/search',
    icon: Search,
  },
  {
    title: 'Inbox',
    url: '/inbox',
    icon: Inbox,
  },
  {
    title: 'Calendar',
    url: '/calendar',
    icon: Calendar,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
]

const footerItems = [
  {
    title: 'Help',
    url: '/help',
    icon: LucideHelpCircle,
  },
  {
    title: 'Logout',
    url: '/logout',
    icon: LogOut,
  },
]

const frameworks = [
  { label: 'John Doe', value: 'johndoe' },
  { label: 'Jane Smith', value: 'janesmith' },
  { label: 'Alice Johnson', value: 'alicejohnson' },
]

export function DashboardSidebar() {
  const pathname = useLocation().pathname
  return (
    <Sidebar className="p-2">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      'hover:bg-primary text-zinc-700 hover:text-zinc-900 py-5',
                      pathname === item.url && 'bg-primary text-zinc-900'
                    )}
                  >
                    <Link to={item.url}>
                      <item.icon className="!size-5" />
                      <span className="text-sm font-semibold">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {footerItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={cn(
                  'hover:bg-primary text-zinc-700 hover:text-zinc-900 py-5',
                  pathname === item.url && 'bg-primary text-zinc-900'
                )}
              >
                <Link to={item.url}>
                  <item.icon className="!size-5" />
                  <span className="text-sm font-semibold">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export const DashboardHeader = () => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center justify-center">
        <SidebarTrigger />
        <h3 className="text-base font-medium">Dashboard</h3>
      </div>
      <div className="flex items-center gap-4">
        <Search className="!size-5 text-zinc-600 hover:text-zinc-900 cursor-pointer" />
        <Bell className="!size-5 text-zinc-600 hover:text-zinc-900 cursor-pointer" />
        <Combobox name="account" data={frameworks} />
      </div>
    </div>
  )
}
