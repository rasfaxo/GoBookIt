'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUser, FaSignInAlt, FaSignOutAlt, FaBuilding } from 'react-icons/fa';
import { ThemeToggle } from '@/components';
import { toast } from 'react-toastify';

import { useAuth } from '@/lib/context/authContext';
import destroySession from '@/services/auth/destroySession';

const Header = (): JSX.Element => {
  const router = useRouter();
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const handleLogout = async () => {
    const { success, error } = await destroySession();
    if (success) {
      setIsAuthenticated(false);
      router.push('/login');
    } else if (error) {
      toast.error(error);
    }
  };
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/80 border-b border-blue-100">
      <nav className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-extrabold tracking-tight text-blue-700 hover:text-blue-800 flex items-center gap-2"
        >
          <span className="inline-block w-2 h-5 bg-gradient-to-b from-blue-500 to-blue-300 rounded" />
          GoBookIt
        </Link>
        <div className="hidden md:flex items-center gap-1 text-sm font-medium text-blue-700">
          <Link
            href="/"
            className="px-3 py-2 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Rooms
          </Link>
          {isAuthenticated && (
            <>
              <Link
                href="/bookings"
                className="px-3 py-2 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Bookings
              </Link>
              <Link
                href="/rooms/add"
                className="px-3 py-2 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Add Room
              </Link>
            </>
          )}
        </div>
  <div className="ml-auto flex items-center gap-3">
          {!isAuthenticated && (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-blue-700 hover:text-blue-800 px-3 py-2 rounded-md hover:bg-blue-50"
              >
                <FaSignInAlt className="mr-1 inline" /> Login
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold text-blue-700 hover:text-blue-800 px-3 py-2 rounded-md hover:bg-blue-50"
              >
                <FaUser className="mr-1 inline" /> Register
              </Link>
            </>
          )}
          {isAuthenticated && (
            <>
              <Link
                href="/rooms/my"
                className="text-sm font-semibold text-blue-700 hover:text-blue-800 px-3 py-2 rounded-md hover:bg-blue-50"
              >
                <FaBuilding className="mr-1 inline" /> My Rooms
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-semibold text-blue-700 hover:text-blue-800 px-3 py-2 rounded-md hover:bg-blue-50"
              >
                <FaSignOutAlt className="mr-1 inline" /> Sign Out
              </button>
            </>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};
export default Header;
