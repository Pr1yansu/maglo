import {
  Home,
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
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useRef } from 'react'
import Link from '@/components/ui/link'

// Menu items.
const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
    index: 0,
  },
  {
    title: 'Transactions',
    url: '/dashboard/transactions',
    icon: ChartLine,
    index: 1,
  },
  {
    title: 'Invoices',
    url: '/dashboard/invoices',
    icon: ReceiptCent,
    index: 2,
  },
  {
    title: 'Wallets',
    url: '/dashboard/wallets',
    icon: Wallet,
    index: 3,
  },
  {
    title: 'Settings',
    url: '/dashboard/settings',
    icon: Settings,
    index: 4,
  },
]

const footerItems = [
  {
    title: 'Help',
    url: '/help',
    icon: LucideHelpCircle,
    index: 5,
  },
  {
    title: 'Logout',
    url: '/logout',
    icon: LogOut,
    index: 6,
  },
]

const frameworks = [
  { label: 'John Doe', value: 'johndoe' },
  { label: 'Jane Smith', value: 'janesmith' },
  { label: 'Alice Johnson', value: 'alicejohnson' },
]

export function DashboardSidebar() {
  const pathname = useLocation().pathname
  const linkRefs = useRef<Array<HTMLLIElement | null>>([])

  const isActive = (currentPath: string, itemUrl: string) => {
    if (currentPath === itemUrl) return true;
    if (currentPath.startsWith(itemUrl + '/') && itemUrl !== '/dashboard') return true;

    return false;
  };

  useGSAP(() => {
    gsap.fromTo(linkRefs.current,
      {
        autoAlpha: 0,
        y: 20,
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.1,
      }
    )

  }, [])
  return (
    <Sidebar className='!border-r-0' collapsible='icon'>
      <SidebarHeader className='px-3 group-data-[collapsible=icon]:px-0'>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-3 text-sm font-semibold dark:text-white">
            Maglo
          </SidebarGroupLabel>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent className='px-3 group-data-[collapsible=icon]:px-0'>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}
                  ref={
                    (el) => (linkRefs.current[item.index] = el)
                  }
                >
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      'group relative flex items-center gap-3 rounded-md py-6 px-4 text-sm font-bold',
                      'text-zinc-700 dark:text-secondary-foreground',
                      'transition-all duration-300 ease-in-out',
                      'hover:bg-primary hover:text-zinc-900 dark:hover:text-zinc-900',
                      isActive(pathname, item.url) &&
                      'bg-primary text-zinc-900 dark:text-zinc-900 shadow-sm'
                    )}
                  >
                    <Link to={item.url}>
                      <item.icon
                        className="!size-5 transition-transform duration-300 ease-in-out group-hover:scale-110"
                      />
                      <span className="transition-colors duration-300 ease-in-out">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className='px-3 group-data-[collapsible=icon]:px-2'>
        <SidebarMenu>
          {footerItems.map((item) => (
            <SidebarMenuItem key={item.title}
              ref={
                (el) => (linkRefs.current[item.index] = el)
              }
            >
              <SidebarMenuButton
                asChild
                className={cn(
                  'group relative flex items-center gap-3 rounded-md py-6 px-4 text-sm font-bold',
                  'text-zinc-700 dark:text-secondary-foreground',
                  'transition-all duration-300 ease-in-out',
                  'hover:bg-primary hover:text-zinc-900 dark:hover:text-zinc-900',
                  isActive(pathname, item.url) &&
                  'bg-primary text-zinc-900 dark:text-zinc-900 shadow-sm'
                )}
              >
                <Link to={item.url}>
                  <item.icon
                    className="!size-5 transition-transform duration-300 ease-in-out group-hover:scale-110"
                  />
                  <span className="transition-colors duration-300 ease-in-out">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/transactions': 'Transactions',
  '/dashboard/invoices': 'Invoices',
  '/dashboard/wallets': 'Wallets',
  '/dashboard/settings': 'Settings',
  '/dashboard/invoices/new': 'New Invoice',
}

export const DashboardHeader = () => {
  const location = useLocation()
  const [params] = useSearchParams()
  const invoiceNumber = params.get('invoiceNumber')

  const iconStyle =
    "!size-5 text-zinc-600 hover:text-primary dark:text-secondary-foreground dark:hover:text-primary cursor-pointer"

  const normalizedPath = location.pathname.replace(/\/$/, '')

  const baseTitle =
    routeTitles[normalizedPath] ||
    routeTitles[
    Object.keys(routeTitles).find((route) => normalizedPath.startsWith(route)) || ''
    ] ||
    ''

  const pageTitle =
    normalizedPath.startsWith('/dashboard/invoices/new') && invoiceNumber
      ? `${baseTitle} : ${invoiceNumber}`
      : baseTitle

  return (
    <div className="flex items-center justify-between w-full mb-3">
      <div className="flex items-center justify-center">
        <SidebarTrigger />
        <h3 className="text-base font-medium px-2">{pageTitle}</h3>
      </div>

      <div className="flex items-center gap-4">
        <Bell className={iconStyle} />
        <Combobox name="account" data={frameworks} />
      </div>
    </div>
  )
}