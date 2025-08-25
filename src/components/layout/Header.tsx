import React, { useEffect, useMemo, useState } from 'react';
import { 
  Bars3Icon, 
  BellIcon, 
  MagnifyingGlassIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';

interface HeaderProps {
  onMenuToggle: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, title = 'Tableau de bord' }) => {
  const [userName, setUserName] = useState<string>('Admin');
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        if (user.displayName) {
          setUserName(user.displayName);
        } else if (user.email) {
          setUserName(user.email);
        } else {
          setUserName('Admin');
        }
        setUserEmail(user.email);
      } else {
        setUserName('Admin');
        setUserEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const titleNode = useMemo(() => (
    <h1 className="text-xl font-semibold bg-gradient-to-r from-teal-300 to-green-300 bg-clip-text text-transparent">{title}</h1>
  ), [title]);

  return (
    <header className="backdrop-blur-xl bg-white/10 border-b border-white/10 shadow-2xl">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md text-gray-200 hover:text-teal-300 hover:bg-white/10"
            aria-label="Toggle menu"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <div className="hidden lg:block">{titleNode}</div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:block relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-300" />
            </div>
            <input
              type="text"
              placeholder="Rechercher..."
              className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl leading-5 bg-white/10 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 sm:text-sm backdrop-blur-sm"
            />
          </div>
          <button className="p-2 rounded-lg text-gray-200 hover:text-teal-300 hover:bg-white/10 relative" aria-label="Notifications">
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
          </button>
          <div className="relative">
            <button className="flex items-center space-x-3 p-2 rounded-lg text-gray-200 hover:text-teal-300 hover:bg-white/10" aria-label="User menu">
              <UserCircleIcon className="w-8 h-8" />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white">{userName}</p>
                <p className="text-xs text-gray-300">{userEmail ?? 'Administrateur'}</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
