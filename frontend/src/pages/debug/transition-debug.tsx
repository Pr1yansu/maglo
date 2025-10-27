import Link from '@/components/ui/link'
import { useLocation } from 'react-router-dom'
import { routeConfig } from '@/lib/route-config'

const TransitionDebugPage = () => {
  const location = useLocation()
  const currentLevel = routeConfig.getLevel(location.pathname)

  const testRoutes = [
    { path: '/', label: 'Home', level: routeConfig.getLevel('/') },
    { path: '/login', label: 'Login', level: routeConfig.getLevel('/login') },
    { path: '/register', label: 'Register', level: routeConfig.getLevel('/register') },
    { path: '/dashboard', label: 'Dashboard', level: routeConfig.getLevel('/dashboard') },
    { path: '/dashboard/transactions', label: 'Transactions', level: routeConfig.getLevel('/dashboard/transactions') },
    { path: '/dashboard/invoices', label: 'Invoices', level: routeConfig.getLevel('/dashboard/invoices') },
    { path: '/dashboard/wallets', label: 'Wallets', level: routeConfig.getLevel('/dashboard/wallets') },
    { path: '/dashboard/settings', label: 'Settings', level: routeConfig.getLevel('/dashboard/settings') },
    { path: '/dashboard/invoices/new', label: 'New Invoice', level: routeConfig.getLevel('/dashboard/invoices/new') },
  ]

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Transition Debug Page</h1>
      
      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p><strong>Current Path:</strong> {location.pathname}</p>
        <p><strong>Current Level:</strong> {currentLevel ?? 'Not in hierarchy'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testRoutes.map((route) => {
          const isCurrent = route.path === location.pathname
          const direction = currentLevel !== undefined && route.level !== undefined 
            ? route.level > currentLevel ? 'forward' : 'backward'
            : 'unknown'

          return (
            <div key={route.path} className={`p-4 border rounded-lg ${isCurrent ? 'bg-blue-100 dark:bg-blue-900 border-blue-500' : 'bg-white dark:bg-gray-800 border-gray-200'}`}>
              <div className="mb-2">
                <strong>{route.label}</strong>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Level: {route.level ?? 'N/A'}
                </p>
                {!isCurrent && (
                  <p className="text-xs text-gray-500">
                    Direction: {direction}
                  </p>
                )}
              </div>
              
              {!isCurrent && (
                <div className="space-y-2">
                  <Link 
                    to={route.path} 
                    className="block w-full px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 text-center"
                    transitionType="slide"
                  >
                    Go (Slide)
                  </Link>
                  <Link 
                    to={route.path} 
                    className="block w-full px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 text-center"
                    transitionType="fade"
                  >
                    Go (Fade)
                  </Link>
                  <Link 
                    to={route.path} 
                    className="block w-full px-3 py-2 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 text-center"
                    transitionType="scale"
                  >
                    Go (Scale)
                  </Link>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-8 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
        <h3 className="font-bold mb-2">Debug Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Open browser developer tools (F12)</li>
          <li>Check the console for transition debug logs</li>
          <li>Navigate between routes and observe the direction and hierarchy logs</li>
          <li>Test different transition types to see if they work correctly</li>
        </ol>
      </div>
    </div>
  )
}

export default TransitionDebugPage