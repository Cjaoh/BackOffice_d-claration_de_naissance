import React, { memo, useCallback, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
    HomeIcon,
    DocumentTextIcon,
    ChartBarIcon,
    UserGroupIcon,
    CogIcon,
    ArrowRightOnRectangleIcon,
    PlusIcon,
    EyeIcon,
} from "@heroicons/react/24/outline";

import { useAuth } from "../../contexts/AuthContext";
import { ROUTES } from "../../constants/routes";

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

interface MenuItem {
    name: string;
    path: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
}

const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    onToggle,
}) => {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        profile,
        signOut,
    } = useAuth();

    const roleLabel = {
        admin: "Administrateur",
        moderator: "Modérateur",
        user: "Utilisateur",
    } as const;

    const roleBadgeClass = {
        admin: "bg-red-500/20 text-red-300",
        moderator: "bg-orange-500/20 text-orange-300",
        user: "bg-cyan-500/20 text-cyan-300",
    } as const;

    const currentRole = profile?.role ?? 'user';

    const menuItems = useMemo<MenuItem[]>(() => {
        const items: MenuItem[] = [
            {
                name: "Tableau de bord",
                icon: HomeIcon,
                path: ROUTES.HOME,
                color: "from-cyan-500 to-teal-500",
            },
            {
                name: "Déclarations",
                icon: DocumentTextIcon,
                path: ROUTES.DECLARATIONS,
                color: "from-cyan-500 to-teal-500",
            },
            {
                name: "Nouvelle déclaration",
                icon: PlusIcon,
                path: ROUTES.NEW_DECLARATION,
                color: "from-cyan-500 to-teal-500",
            },
            {
                name: "Visualiser PDF",
                icon: EyeIcon,
                path: ROUTES.PDF_VIEW,
                color: "from-cyan-500 to-teal-500",
            },
            {
                name: "Statistiques",
                icon: ChartBarIcon,
                path: ROUTES.STATISTICS,
                color: "from-cyan-500 to-teal-500",
            },
        ];

        if (
            profile?.role === "admin" ||
            profile?.role === "moderator"
        ) {
            items.push({
                name: "Utilisateurs",
                icon: UserGroupIcon,
                path: ROUTES.USERS,
                color: "from-cyan-500 to-teal-500",
            });
        }

        if (profile?.role === "admin") {
            items.push({
                name: "Paramètres",
                icon: CogIcon,
                path: ROUTES.SETTINGS,
                color: "from-cyan-500 to-teal-500",
            });
        }

        return items;
    }, [profile]);

    const handleLogout = useCallback(async (): Promise<void> => {
        try {
            await signOut();
            navigate(ROUTES.LOGIN, {
                replace: true,
            });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }, [navigate, signOut]);

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={onToggle}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 w-64
                    border-r border-cyan-700/20
                    bg-slate-900/70
                    backdrop-blur-2xl
                    shadow-2xl
                    transform transition-transform duration-300 ease-in-out
                    ${
                        isOpen
                            ? "translate-x-0"
                            : "-translate-x-full lg:translate-x-0"
                    }
                `}
                aria-label="Sidebar navigation"
            >
                <div className="flex h-16 items-center justify-between border-b border-cyan-700/20 px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 shadow-lg">
                            <DocumentTextIcon className="h-5 w-5 text-white" />
                        </div>

                        <div>
                            <h1 className="bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-300 bg-clip-text text-xl font-bold text-transparent">
                                BackOffice
                            </h1>

                            {profile && (
                                <p className="text-xs text-slate-400">
                                    {profile.displayName}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={onToggle}
                        className="rounded-lg p-2 text-cyan-400 transition hover:bg-white/10 hover:text-white lg:hidden"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <nav className="mt-6 flex-1 px-3">
                    <div className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive =
                                location.pathname === item.path ||
                                location.pathname.startsWith(item.path + "/");

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => {
                                        if (isOpen) {
                                            onToggle();
                                        }
                                    }}
                                    className={`
                                        flex items-center gap-3 rounded-xl px-4 py-3
                                        transition-all duration-200
                                        ${
                                            isActive
                                                ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                                                : "text-cyan-300 hover:bg-white/10 hover:text-white"
                                        }
                                    `}
                                >
                                    <Icon
                                        className={`h-5 w-5 ${
                                            isActive
                                                ? "text-white"
                                                : "text-cyan-400"
                                        }`}
                                    />

                                    <span className="font-medium">
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                <div className="border-t border-cyan-700/20 p-4">
                    {profile && (
                        <div className="mb-4 rounded-xl border border-cyan-700/20 bg-slate-800/60 p-3">
                            <p className="truncate text-sm font-semibold text-white">
                                {profile.displayName}
                            </p>

                            <p className="truncate text-xs text-slate-400">
                                {profile.email}
                            </p>

                            <span className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs font-medium ${roleBadgeClass[currentRole as keyof typeof roleBadgeClass]}`}>
                                {roleLabel[currentRole as keyof typeof roleLabel]}
                            </span>
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        aria-label="Se déconnecter"
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-cyan-300 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
                    >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />

                        <span className="font-medium">
                            Déconnexion
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default memo(Sidebar);
