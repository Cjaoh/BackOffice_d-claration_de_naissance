import React, { memo, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  UserGroupIcon, 
  CogIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = useMemo(() => [
    {
      name: 'Tableau de bord',
      icon: HomeIcon,
      path: '/',
      color: 'from-cyan-500 to-teal-500'
    },
    {
      name: 'Déclarations',
      icon: DocumentTextIcon,
      path: '/declarations',
      color: 'from-cyan-500 to-teal-500'
    },
    {
      name: 'Nouvelle déclaration',
      icon: PlusIcon,
      path: '/declarations/new',
      color: 'from-cyan-500 to-teal-500'
    },
    {
      name: 'Visualiser PDF',
      icon: EyeIcon,
      path: '/pdf-view',
      color: 'from-cyan-500 to-teal-500'
    },
    {
      name: 'Statistiques',
      icon: ChartBarIcon,
      path: '/statistics',
      color: 'from-cyan-500 to-teal-500'
    },
    {
      name: 'Utilisateurs',
      icon: UserGroupIcon,
      path: '/users',
      color: 'from-cyan-500 to-teal-500'
    },
    {
      name: 'Paramètres',
      icon: CogIcon,
      path: '/settings',
      color: 'from-cyan-500 to-teal-500'
    }
  ], []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");  // redirection vers la page login
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      // Vous pouvez ajouter une notification d'erreur ici
    }
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 backdrop-blur-2xl bg-slate-900/60 border-r border-cyan-700/20 shadow-2xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        aria-label="Sidebar navigation"
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-cyan-700/20">
          <div className="flex items-center space-x-3 select-none">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg">
              <DocumentTextIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-extrabold bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-300 bg-clip-text text-transparent">
              BackOffice
            </h1>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-md text-cyan-400 hover:text-teal-400 hover:bg-cyan-800/30 transition-colors duration-300"
            aria-label="Fermer le menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="mt-6 px-3" aria-label="Menu principal">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 select-none
                    ${isActive 
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
                      : 'text-cyan-300 hover:bg-white/10 hover:text-white'
                    }
                  `}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-cyan-400'}`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-cyan-700/20">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-3 py-3 rounded-xl text-cyan-300 hover:bg-white/10 hover:text-white transition-all duration-200 select-none"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default memo(Sidebar);
