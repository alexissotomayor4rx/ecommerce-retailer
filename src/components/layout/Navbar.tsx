import Link from 'next/link';
import { ShoppingCartIcon, UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ThemeToggle } from '@/components/ThemeToggle';
import { createClient } from '@/utils/supabase/server';
import SignOutButton from './SignOutButton';

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const isAdmin = user?.app_metadata?.role === 'admin';
  const profileLink = isAdmin ? '/admin/dashboard' : (user ? '/profile' : '/login');

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
            ImportStore
          </Link>
          <div className="flex items-center space-x-6">
            <ThemeToggle />
            <button className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
            <Link href="/cart" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 relative">
              <ShoppingCartIcon className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-sm">0</span>
            </Link>
            <Link 
              href={profileLink} 
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${user ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300'}`}
              title={user ? (isAdmin ? 'Ir al Panel Admin' : 'Ir a mi perfil') : 'Iniciar sesión'}
            >
              <UserIcon className="h-6 w-6" />
            </Link>
            {user && <SignOutButton />}
          </div>
        </div>
      </div>
    </nav>
  );
}
