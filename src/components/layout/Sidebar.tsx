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
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Déclarations',
      icon: DocumentTextIcon,
      path: '/declarations',
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'Nouvelle déclaration',
      icon: PlusIcon,
      path: '/declarations/new',
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Visualiser PDF',
      icon: EyeIcon,
      path: '/pdf-view',
      color: 'from-orange-500 to-orange-600'
    },
    {
      name: 'Statistiques',
      icon: ChartBarIcon,
      path: '/statistics',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      name: 'Utilisateurs',
      icon: UserGroupIcon,
      path: '/users',
      color: 'from-pink-500 to-pink-600'
    },
    {
      name: 'Paramètres',
      icon: CogIcon,
      path: '/settings',
      color: 'from-gray-500 to-gray-600'
    }
  ], []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");  // redirection vers la page login
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      // tu peux ajouter une notification d'erreur ici si tu veux
    }
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 backdrop-blur-2xl bg-white/10 border-r border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#4CAF9E] to-[#26A69A] flex items-center justify-center shadow-lg">
              <DocumentTextIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-teal-300 to-green-300 bg-clip-text text-transparent">BackOffice</h1>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-md text-gray-200 hover:text-teal-300 hover:bg-white/10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r text-white shadow-lg' 
                      : 'text-gray-200 hover:bg-white/10 hover:text-white'
                    }
                    ${isActive ? item.color : ''}
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-300'}`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-3 py-3 rounded-xl text-gray-200 hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default memo(Sidebar);
