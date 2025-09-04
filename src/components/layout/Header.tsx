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
    <h1 className="text-xl font-extrabold bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-300 bg-clip-text text-transparent select-none">
      {title}
    </h1>
  ), [title]);

  return (
    <header className="backdrop-blur-2xl bg-slate-900/80 border-b border-cyan-700/20 shadow-lg sticky top-0 z-20">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md text-cyan-400 hover:text-teal-400 hover:bg-cyan-900/30 transition-colors duration-300"
            aria-label="Toggle menu"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <div className="hidden lg:block select-none">{titleNode}</div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Recherche */}
          <div className="hidden md:block relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-cyan-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher..."
              className="block w-full pl-10 pr-3 py-2 rounded-2xl text-white bg-white/10 border border-cyan-700 placeholder-cyan-400/70 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 
                         sm:text-sm backdrop-blur-sm transition-colors duration-300"
            />
          </div>

          {/* Notifications */}
          <button
            className="p-2 rounded-lg text-cyan-400 hover:text-teal-400 hover:bg-cyan-900/30 relative transition-colors duration-300"
            aria-label="Notifications"
          >
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 animate-pulse ring-2 ring-red-700"></span>
          </button>

          {/* User */}
          <div className="relative">
            <button
              className="flex items-center space-x-3 p-2 rounded-lg text-cyan-400 hover:text-teal-400 hover:bg-cyan-900/30 transition-colors duration-300"
              aria-label="User menu"
            >
              <UserCircleIcon className="w-8 h-8" />
              <div className="hidden md:block text-left select-none">
                <p className="text-sm font-semibold text-white truncate max-w-xs">{userName}</p>
                <p className="text-xs text-cyan-400 truncate max-w-xs">{userEmail ?? 'Administrateur'}</p>
              </div>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
