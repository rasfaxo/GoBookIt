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
    <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/80 border-b border-blue-100" role="banner">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 bg-blue-600 text-white text-sm font-medium px-3 py-2 rounded">Skip to content</a>
      <nav className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8" aria-label="Primary">
        <Link
          href="/"
          className="text-lg font-extrabold tracking-tight text-blue-700 hover:text-blue-800 flex items-center gap-2"
        >
          <img
            src="/images/gobookit-logo.png"
            alt="GoBookIt"
            className="h-16 w-auto md:h-20 lg:h-24"
          />
        </Link>
    <div className="hidden md:flex items-center gap-1 text-sm font-medium text-blue-700" role="menubar">
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
                aria-label="Sign out"
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
