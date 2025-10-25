import {
  Home,
  Search,
  Settings,
  LucideHelpCircle,
  LogOut,
  Bell,
  ChartLine,
  ReceiptCent,
  Wallet,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
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
    title: 'Transactions',
    url: '/dashboard/transactions',
    icon: ChartLine,
  },
  {
    title: 'Invoices',
    url: '/dashboard/invoices',
    icon: ReceiptCent,
  },
  {
    title: 'Wallets',
    url: '/dashboard/wallets',
    icon: Wallet,
  },
  {
    title: 'Settings',
    url: '/dashboard/settings',
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
    <Sidebar className='!border-r-0'>
      <SidebarHeader className='px-3'>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-3 text-sm font-semibold dark:text-white">
            Maglo
          </SidebarGroupLabel>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent className='px-3'>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      'hover:bg-primary text-zinc-700 hover:text-zinc-900 dark:text-secondary-foreground py-6 px-4  dark:hover:text-zinc-900 duration-300',
                      pathname === item.url && 'bg-primary text-zinc-900 dark:text-zinc-900'
                    )}
                  >
                    <Link to={item.url}>
                      <item.icon className="!size-5" />
                      <span className="text-sm font-bold">
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
      <SidebarFooter className='px-3'>
        <SidebarMenu>
          {footerItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={cn(
                  'hover:bg-primary text-zinc-700 hover:text-zinc-900 dark:text-secondary-foreground py-6 px-4  dark:hover:text-zinc-900 duration-300',
                  pathname === item.url && 'bg-primary text-zinc-900 dark:text-zinc-900'
                )}
              >
                <Link to={item.url}>
                  <item.icon className="!size-5" />
                  <span className="text-sm font-bold">{item.title}</span>
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
  const iconstyle = "!size-5 text-zinc-600 hover:text-primary dark:text-secondary-foreground dark:hover:text-primary cursor-pointer"
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center justify-center">
        <SidebarTrigger />
        <h3 className="text-base font-medium">Dashboard</h3>
      </div>
      <div className="flex items-center gap-4">
        <Search className={iconstyle} />
        <Bell className={iconstyle} />
        <Combobox name="account" data={frameworks} />
      </div>
    </div>
  )
}
