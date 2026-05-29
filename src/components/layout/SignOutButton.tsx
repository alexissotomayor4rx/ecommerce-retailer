'use client';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <button 
      onClick={handleSignOut} 
      className="text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition-colors ml-4" 
      title="Cerrar sesión"
    >
      <ArrowRightOnRectangleIcon className="h-6 w-6" />
    </button>
  );
}
