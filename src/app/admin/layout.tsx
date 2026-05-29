'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChartPieIcon, 
  ShoppingBagIcon, 
  InboxArrowDownIcon,
  ArrowLeftStartOnRectangleIcon
} from '@heroicons/react/24/outline';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: ChartPieIcon },
    { name: 'Órdenes', href: '/admin/orders', icon: InboxArrowDownIcon },
    { name: 'Productos', href: '/admin/products', icon: ShoppingBagIcon },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-slate-800">
          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">AdminPanel</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-slate-800">
          <button className="flex items-center space-x-3 text-red-600 dark:text-red-400 hover:text-red-700 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full">
            <ArrowLeftStartOnRectangleIcon className="w-6 h-6" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Mobile Header & Theme Toggle */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-6">
          <div className="md:hidden">
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">AdminPanel</span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/" className="text-sm text-gray-500 hover:text-indigo-600">Ver Tienda</Link>
          </div>
        </header>

        <div className="p-6 md:p-8 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
