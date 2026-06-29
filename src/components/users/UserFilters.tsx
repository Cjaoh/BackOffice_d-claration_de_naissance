import React from 'react';
import Input from '../ui/Input';
import type { UserRole, UserStatus } from '../../services/userService';

interface UserFiltersProps {
    searchTerm: string;
    roleFilter: 'all' | UserRole;
    statusFilter: 'all' | UserStatus;

    onSearchChange: (value: string) => void;
    onRoleFilterChange: (value: 'all' | UserRole) => void;
    onStatusFilterChange: (value: 'all' | UserStatus) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
    searchTerm,
    roleFilter,
    statusFilter,
    onSearchChange,
    onRoleFilterChange,
    onStatusFilterChange,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <Input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={onSearchChange}
                className="bg-white/10 text-white placeholder-cyan-300 border border-cyan-700 rounded-xl focus:ring-cyan-400 focus:border-cyan-400"
            />

            <select
                value={roleFilter}
                onChange={(e) =>
                    onRoleFilterChange(
                        e.target.value as 'all' | UserRole
                    )
                }
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-cyan-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
                <option value="all">Tous les rôles</option>
                <option value="admin">Administrateur</option>
                <option value="moderator">Modérateur</option>
                <option value="user">Utilisateur</option>
            </select>

            <select
                value={statusFilter}
                onChange={(e) =>
                    onStatusFilterChange(
                        e.target.value as 'all' | UserStatus
                    )
                }
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-cyan-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="suspended">Suspendu</option>
            </select>

        </div>
    );
};

export default React.memo(UserFilters);